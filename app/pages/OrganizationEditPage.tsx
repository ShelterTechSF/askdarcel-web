import React from "react";
import ReactDOM from "react-dom";
import { Prompt, withRouter } from "react-router-dom";
import type { RouteComponentProps } from "react-router";
import _ from "lodash";

import { Loader } from "components/ui";
import EditAddresses from "../components/edit/EditAddress";
import EditServices from "../components/edit/EditServices";
import EditNotes from "../components/edit/EditNotes";
import EditSchedule from "../components/edit/EditSchedule";
import EditPhones from "../components/edit/EditPhones";
import EditSidebar from "../components/edit/EditSidebar";
import {
  buildScheduleDays,
  isEmptyInternalSchedule,
} from "../components/edit/ProvidedService";
import type {
  InternalSchedule,
  InternalScheduleDay,
} from "../components/edit/ProvidedService";
import type {
  State as EditNotesState,
  InternalNoteChanges,
} from "../components/edit/EditNotes";
import type { PopupMessageProp } from "../components/ui/PopUpMessage";
import type {
  Address,
  Instruction,
  Note,
  Organization,
  PhoneNumber,
  Schedule,
  ScheduleDay,
  Service,
} from "../models";
import * as dataService from "../utils/DataService";
import "./OrganizationEditPage.scss";

/** Assert that the argument is not `undefined`.
 *
 * This is a type checking helper that allows us to create a runtime type check
 * that removes `undefined` from the possible types that x can be.
 */
function assertDefined<T>(x: T | undefined, msg: string): asserts x is T {
  if (x === undefined) throw new Error(msg);
}

const ACTION_INSERT = "insert";
const ACTION_EDIT = "edit";
const ACTION_REMOVE = "remove";

interface UriObj {
  id: number | undefined;
  path: string;
}

/**
 * Apply a set of changes to a base array of Services.
 *
 * This function makes assumptions that are only safe for how Services are
 * represented on the Edit page.
 *
 * Constraints:
 * - Original ordering of base array should be preserved
 * - New items should be pushed to the end ordered by ID in descending order.
 *   This assumes that the IDs for new items start with -1 and decrement for
 *   each new item
 *
 * @param baseItems - An array of items, each with an `id` field
 * @param changesById - An object mapping IDs to changes
 * @param deletedIds - Optional. A set of IDs of items to delete
 *
 * @return An array of items with the changes applied
 */
const applyChanges = (
  baseItems: InternalOrganizationService[],
  changesById: Record<number, InternalTopLevelService>,
  deletedIds?: Set<number>
): InternalFlattenedService[] => {
  const baseItemIds = new Set(baseItems.map((i) => i.id));
  // Order the new IDs in decreasing order, since that's the order they should
  // appear on the page.
  // We use lodash's sortBy because JavaScript's sort does a lexicographic sort,
  // even on numbers.
  const newIds = _.sortBy(
    Object.keys(changesById)
      .map((idStr) => parseInt(idStr, 10))
      .filter((id) => !baseItemIds.has(id))
  ).reverse();
  // Prepopulate an array with all the items, including the new ones in the
  // right position.
  const prechangedItems = [...baseItems, ...newIds.map((id) => ({ id }))];
  let transformedItems = prechangedItems.map((item) => {
    if (item.id in changesById) {
      return { ...item, ...changesById[item.id] };
    }
    // This case should not be reachable because changesById comes from
    // this.state.services, and upon fetching the resource from the API for the
    // first time, we prepopulate this.state.services with an item for each
    // service that was already on the resource.
    throw new Error(
      `Expected changesById to contain an entry for every ID in baseItems. Item with id ${item.id} was not found in changesById`
    );
  });
  if (deletedIds) {
    transformedItems = transformedItems.filter(
      (item) => !deletedIds.has(item.id)
    );
  }

  // This block of code allows us to assert that `schedule` is always defined on
  // the flattened service while preserving the type information for TypeScript.
  const newTransformedItems: InternalFlattenedService[] = [];
  transformedItems.forEach((flattenedService) => {
    const { schedule } = flattenedService;
    if (schedule === undefined)
      throw new Error("Expected flattened service to have a schedule");
    newTransformedItems.push({
      addressHandles: [],
      ...flattenedService,
      schedule,
    });
  });

  return newTransformedItems;
};

/** Return an object that contains only the key-value pairs in `curr` that are different than `orig`.
 */
function getDiffObject<T extends {}>(curr: T, orig: T): Partial<T> {
  return Object.entries(curr).reduce((acc, [key, value]) => {
    if (!_.isEqual(orig[key], value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function updateCollectionObject(object, id, path, promises) {
  promises.push(
    dataService.post(`/api/${path}/${id}/change_requests`, {
      change_request: { action: ACTION_EDIT, field_changes: object },
    })
  );
}

/**
 * Create a change request for a new object.
 */
function createCollectionObject(object, path, promises, resourceID) {
  promises.push(
    dataService.post("/api/change_requests", {
      change_request: object,
      type: path,
      parent_resource_id: resourceID,
    })
  );
}

function createNewPhoneNumber(item, resourceID, promises) {
  promises.push(
    dataService.post("/api/change_requests", {
      change_request: {
        action: ACTION_INSERT,
        field_changes: item,
      },
      parent_resource_id: resourceID,
      type: "phones",
    })
  );
}

function deletCollectionObject(item, path, promises) {
  if (path === "phones") {
    promises.push(dataService.APIDelete(`/api/phones/${item.id}`));
  }
}

function postCollection(
  collection,
  originalCollection,
  path,
  promises,
  resourceID
) {
  for (let i = 0; i < collection.length; i += 1) {
    const item = collection[i];
    if (item.isRemoved) {
      deletCollectionObject(item, path, promises);
    } else if (i < originalCollection.length && item.dirty) {
      const diffObj: any = getDiffObject(item, originalCollection[i]);
      if (!_.isEmpty(diffObj)) {
        delete diffObj.dirty;
        updateCollectionObject(diffObj, item.id, path, promises);
      }
    } else if (item.dirty) {
      delete item.dirty;
      if (path === "phones") {
        createNewPhoneNumber(item, resourceID, promises);
      } else {
        createCollectionObject(item, path, promises, resourceID);
      }
    }
  }
}

function postSchedule(scheduleObj, promises) {
  if (!scheduleObj) {
    return;
  }
  let currDay: any[] = [];
  let value: any = {};
  Object.keys(scheduleObj).forEach((day) => {
    currDay = scheduleObj[day];
    currDay.forEach((curr) => {
      value = {};
      if (curr.id) {
        if (!curr.openChanged && !curr.closeChanged) {
          return;
        }
        if (curr.openChanged) {
          value.opens_at = curr.opens_at;
        }
        if (curr.closeChanged) {
          value.closes_at = curr.closes_at;
        }

        promises.push(
          dataService.post(`/api/schedule_days/${curr.id}/change_requests`, {
            change_request: value,
          })
        );
      } else {
        value = {
          change_request: {
            day,
          },
          type: "schedule_days",
          schedule_id: curr.scheduleId,
        };
        if (curr.openChanged) {
          value.change_request.opens_at = curr.opens_at;
        }
        if (curr.closeChanged) {
          value.change_request.closes_at = curr.closes_at;
        }
        if (!curr.openChanged && !curr.closeChanged) {
          return;
        }
        promises.push(dataService.post("/api/change_requests", { ...value }));
      }
    });
  });
}

function postNotes(
  notesObj: Partial<EditNotesState>,
  promises: Promise<unknown>[],
  uriObj: UriObj
) {
  if (notesObj && notesObj.notes) {
    const { notes } = notesObj;
    Object.entries(notes).forEach(([key, currentNote]: any) => {
      if (key < 0) {
        const uri = `/api/${uriObj.path}/${uriObj.id}/notes`;
        promises.push(dataService.post(uri, { note: currentNote }));
      } else if (currentNote.isRemoved) {
        const uri = `/api/notes/${key}`;
        promises.push(dataService.APIDelete(uri));
      } else {
        const uri = `/api/notes/${key}/change_requests`;
        promises.push(dataService.post(uri, { change_request: currentNote }));
      }
    });
  }
}

function postInstructions(instructions, promises) {
  if (instructions?.length > 0) {
    // Todo: The API is returning instructions as an array of objects whereas we really
    // only need one instructions object. When the API returns the instructions as an
    // object rather than an array, we can remove this loop.
    instructions.forEach((currentInstruction) => {
      if (currentInstruction.id < 0) {
        const uri = "/api/instructions";
        promises.push(
          dataService.post(uri, { instruction: currentInstruction })
        );
      } else {
        const uri = `/api/instructions/${currentInstruction.id}`;
        promises.push(
          dataService.put(uri, { instruction: currentInstruction })
        );
      }
    });
  }
}

function postDocuments(documents, promises) {
  if (documents?.length > 0) {
    documents.forEach((currentDocument) => {
      if (currentDocument.isRemoved) {
        const uri = `/api/documents/${currentDocument.id}`;
        promises.push(dataService.APIDelete(uri));
      } else if (currentDocument.id) {
        const uri = `/api/documents/${currentDocument.id}`;
        promises.push(dataService.put(uri, { document: currentDocument }));
      } else {
        const uri = "/api/documents";
        promises.push(dataService.post(uri, { document: currentDocument }));
      }
    });
  }
}

/** Return an array of Promises performing the correct update operation.
 *
 * Note that this will return a promise that resolves to null for addresses that
 * do not need to be updated, created, or deleted so that we maintain a 1-1
 * mapping from input addresses and output promises.
 *
 * Note that all of these operations will create change requests reflecting the
 * operation.
 *
 * If the `id` field is not present, then we assume that this is a new address
 * that must be created.
 *
 * If the `isRemoved` field is true, then delete the address.
 *
 * If the `dirty` field is true, then submit a change request to update the
 * address.
 *
 * Otherwise, assume that the address is unmodified and don't do anything.
 */
const postAddresses = (
  addresses: InternalAddress[],
  uriObj: { path: string; id: number | undefined }
): Promise<unknown>[] =>
  addresses.map((address) => {
    const { isRemoved, dirty } = address;
    const id = "id" in address ? address.id : undefined;
    const { id: parent_resource_id } = uriObj;
    const postableAddress = { ..._.omit(address, ["dirty", "isRemoved"]) };

    if (!id) {
      // Create new address

      // Skip any addresses that only have blank fields
      if (_.every(Object.values(postableAddress), _.isEmpty)) {
        return Promise.resolve(null);
      }

      return dataService.post("/api/change_requests", {
        change_request: {
          action: ACTION_INSERT,
          field_changes: postableAddress,
        },
        parent_resource_id,
        type: "addresses",
      });
    }
    if (isRemoved) {
      // Delete existing address
      return dataService.post(`/api/addresses/${id}/change_requests`, {
        change_request: { action: ACTION_REMOVE },
      });
    }
    if (dirty) {
      // Update existing address
      return dataService.post(`/api/addresses/${id}/change_requests`, {
        change_request: postableAddress,
      });
    }

    // Skip any unmodified addresses.
    return Promise.resolve(null);
  });

// THis is only called for schedules for new services, not for resources nor for
// existing services.
function createFullSchedule(scheduleObj) {
  if (scheduleObj) {
    const newSchedule: any[] = [];
    let tempDay = {};
    Object.keys(scheduleObj).forEach((day) => {
      scheduleObj[day].forEach((curr) => {
        if (curr.opens_at === null || curr.closes_at === null) {
          return;
        }
        tempDay = {
          day,
          opens_at: curr.opens_at,
          closes_at: curr.closes_at,
        };
        newSchedule.push(tempDay);
      });
    });

    return { schedule_days: newSchedule };
  }
  return { schedule_days: [] };
}

/** A new Note object that is about to be POSTed to the API. */
type NewNote = Omit<Note, "id">;

/** Prepare new notes to be created along with a new Resource.
 *
 * This function may look more complicated than it needs to be, but it's due to
 * technical debt in the EditNotes component, which prevents us from precisely
 * describing the type of the InternalNoteChanges. InternalNoteChanges.note is
 * only only undefined in the case where we are removing an existing note, but
 * on the New Resource page, we cannot remove any notes because none of them
 * have been created on the API side in the first place. Therefore, we know that
 * the `note` field on all `InternalNoteChanges` should be defined. We add a
 * runtime type assertion here to ensure this invariant is held even if we
 * refactor the EditNotes component.
 */
const prepNotesData = (
  notes: Record<number, InternalNoteChanges>
): { note: NewNote }[] =>
  Object.values(notes).map((note) => {
    const noteValue = note.note;
    assertDefined(
      noteValue,
      "Expected all notes to have a defined `note` field"
    );
    return { note: { note: noteValue } };
  });

/** A new ScheduleDay object that is about to be POSTed to the API. */
type NewScheduleDay = Omit<ScheduleDay, "id">;

const prepSchedule = (
  scheduleObj: Record<string, never> | InternalSchedule
): NewScheduleDay[] => {
  const newSchedule: NewScheduleDay[] = [];
  Object.keys(scheduleObj).forEach((untypedDay) => {
    // Object.keys() always returns strings, even when we know(?) that the keys
    // are a more precise type, since object types in TypeScript only desrcibe
    // the minimum set of keys required, and there could always be more keys
    // present than we are aware of. We explicitly perform this type assertion
    // to constrain `day` to just the days of the week. In the future, we should
    // avoid using Object.keys() and Object.entries().
    const day = untypedDay as keyof InternalSchedule;
    const scheduleDays: InternalScheduleDay[] = scheduleObj[day];
    scheduleDays.forEach((curr) => {
      if (curr.opens_at === null || curr.closes_at === null) {
        return;
      }
      const tempDay = {
        day,
        opens_at: curr.opens_at,
        closes_at: curr.closes_at,
      };
      newSchedule.push(tempDay);
    });
  });
  return newSchedule;
};

const deepClone = <T extends unknown>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

type AddressChangeType =
  | { type: "markedForRemoval"; handle: number }
  | { type: "removed"; handle: number }
  | { type: "modified"; handle: number }
  | { type: "added" };

/** Determine the type of change between oldAddresses and newAddresses.
 *
 * Given the complete arrays of both the old and new addresses, attempt to
 * compute the exact difference between them, identifying exactly which address
 * was changed. Note that this function assumes that only a single address has
 * been changed, and it cannot succeed if more than one address has been
 * changed.
 *
 * This specifically differentiates between two types of removals:
 * - Marking an address for removal, which is only performed on addresses that
 *   already existed in the DB prior to this page initially being loaded
 * - Completely deleting an address, which is only performed on addresses that
 *   were created in the UI of this page, but before saving the changes. E.g.
 *   creating an address and then immediately deleting it.
 *
 * This returns one of four possibily shapes, where `handle` is always the index
 * of the address in the oldAddresses array:
 *
 * - { type: "markedForRemoval", handle: number }
 * - { type: "removed", handle: number }
 * - { type: "modified", handle: number }
 * - { type: "added" } (no handle, because it doesn't exist in oldAddresses)
 */
const computeTypeOfChangeToAddresses = (
  oldAddresses: InternalAddress[],
  newAddresses: InternalAddress[]
): AddressChangeType => {
  if (oldAddresses.length > newAddresses.length) {
    // In this case, we assume that an address was deleted, so we attempt to
    // identify which index was removed so that we can adjust the address
    // handles on the services to reflect the new indexes.
    if (oldAddresses.length !== newAddresses.length + 1) {
      throw new Error(
        "Cannot handle case where multiple updates are processed at the same time"
      );
    }
    for (let i = 0; i < oldAddresses.length; i += 1) {
      if (!_.isEqual(oldAddresses[i], newAddresses[i])) {
        return { type: "removed", handle: i };
      }
    }
    throw new Error("Error detecting index of removed address");
  } else if (oldAddresses.length === newAddresses.length) {
    for (let i = 0; i < oldAddresses.length; i += 1) {
      if (!oldAddresses[i].isRemoved && newAddresses[i].isRemoved) {
        return { type: "markedForRemoval", handle: i };
      }
    }
    for (let i = 0; i < oldAddresses.length; i += 1) {
      if (!_.isEqual(oldAddresses[i], newAddresses[i])) {
        return { type: "modified", handle: i };
      }
    }
    throw new Error("Error detecting index of edited or removed address");
  } else {
    // oldAddresses.length < newAddresses.length
    return { type: "added" };
  }
};

/** Return items in set1 that are not in set2.
 *
 * This recipe was copied from
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
const setDifference = <T extends unknown>(set1: Set<T>, set2: Set<T>): Set<T> =>
  new Set([...set1].filter((x) => !set2.has(x)));

// Helper functions for computing views on state.
//
// Because the state of this page has gotten so complex, it is very easy to make
// mistakes when attempting to directly access information from the `this.state`
// object, especially since you may often need to consult multiple different
// locations in order to build the complete picture.

/** Get latest list of addresses. */
const getAddresses = (state: State): InternalAddress[] => {
  const { addresses } = state;
  // addresses could be empty if we haven't added, removed, or modified an
  // address. In this case, we want to use the addresses on
  // state.resource.addresses, since that will actually contain the current set
  // of addresses associated with the resource.
  //
  // The one case where this could be false is where the resource never had an
  // address in the first place, but in that case, using either state.addresses
  // or state.resources.addresses should both give the same result.
  if (addresses.length === 0) {
    return state.resource?.addresses || [];
  }
  return addresses;
};

// Types for objects internal to the Edit page.
//
// Several of the objects coming from the API are transformed on the Edit page
// in order to keep track of internal UI state. The following are type
// definitions that extend but override fields on the API type definitions in
// the models/ directory.

/** Internal shape of an Organization (a.k.a. Resource).
 *
 * This has the following differences from the Organization coming from the API:
 *
 * - All fields except for `schedule` are optional, since on the Create New
 *   Resource page, we initialize the main React Component's `resource` state
 *   variable with an almost empty object.
 * - `schedule` can either be an API Schedule or a Record<string, never>, which
 *   is a fancy way of saying an object with no fields. Note that `schedule` is
 *   a real API schedule, unlike the main React Component's `scheduleObj` state
 *   variable, which is an `InternalSchedule`.
 * - `services` is an array of `InternalService`s. See `InternalService`'s
 *   comments for more details.
 */
export interface InternalOrganization
  extends Partial<Omit<Organization, "schedule" | "services">> {
  schedule: Record<string, never> | Schedule;
  services?: InternalOrganizationService[];
}

/** Internal version of an Instruction.
 *
 * This differs from the Instruction that comes from the API in that the
 * `service_id` exists.
 */
interface InternalInstruction extends Instruction {
  /** The ID of the service this instruction is attached to.
   *
   * TODO: Why is this needed? Shouldn't the InternalTopLevelService that this
   * is attached to know its ID?
   */
  service_id: number;
}

/** Internal shape of a Service stored at the top-level of the component state.
 *
 * This differs from the Service coming from the API in that the `addresses`
 * field has been replaced with an `addressHandles` field. This also makes most
 * of the original properties from the API Service optional, and it also adds a
 * few new properties. See documentation on the individual fields for more
 * information.
 */
export interface InternalTopLevelService
  extends Partial<Omit<Service, "addresses" | "schedule">> {
  /** References to addresses in the parent Organization.
   *
   * These are the numeric indexes into the Organization's `addresses` array.
   */
  addressHandles?: number[];

  /** Changes to the instructions attached to the service.
   *
   * This differs from the `instructions` field on the API Service type in that
   * this one also has a `service_id` field.
   */
  instructions?: InternalInstruction[];

  /** Changes to the notes attached to this service. */
  notesObj?: EditNotesState;

  /** A Schedule attached to the service.
   *
   * Mostly matches the shape of the API schedule, but can also omit all fields
   * except for a 0-length schedule_days array.
   */
  schedule?: Schedule | { schedule_days: never[] };

  /** A Schedule attached to the service in the form of an InternalSchedule. */
  scheduleObj: InternalSchedule;

  /** Whether the Service should inherit its schedule from its parent Organization. */
  shouldInheritScheduleFromParent: boolean;
}

/** Internal shape of a Service as nested under the Organization object.
 *
 * This differs from the Service coming from the API in that the `addresses`
 * field has been replaced with an `addressHandles` field. This is generally not
 * changed after the initial API GET request that returns the Organization and
 * everything nested underneath it. All edits on the Edit Page actually change
 * the top-level services objects.
 */
interface InternalOrganizationService extends Omit<Service, "addresses"> {
  /** References to addresses in the parent Organization.
   *
   * These are the numeric indexes into the Organization's `addresses` array.
   */
  addressHandles: number[];
}

/** The result of flattening the InternalOrganizationService into
 * InternalTopLevelService.
 *
 * The `applyChanges()` function takes the InternalTopLevelServices and applies
 * them like diffs on top of the InternalOrganizationServices. The result is a
 * type that is mostly like InternalOrganizationServices except that the `id`
 * field is required.
 *
 * In addition, the `schedule` field is assumed to always be defined, since
 * either the Schedule came from the original API response or it should have
 * been initialized on the InternalFlattenedService when adding a new Service.
 *
 * The `addressHandles` field is also assumed to be defined, since in the case
 * where the Service already existed on a Resource, the `handleAPIGetResource()`
 * method will define that field on all Services, and in the case where we
 * create a new Service, the `addService()` method will initialize it to the
 * empty array.
 */
export interface InternalFlattenedService extends InternalTopLevelService {
  id: number;
  schedule: Schedule | { schedule_days: never[] };
  addressHandles: number[];
}

/** Internal shape of a Phone number on the top-level state.
 *
 * Differs from a real PhoneNumber in that the `extension` and `country_code`
 * fields are omitted. Also differs in that all the fields are possibly
 * undefined, in the case when the form fields for a new phone number are first
 * added, but before the user fills them out.
 */
export type InternalPhoneNumber = Partial<
  Pick<PhoneNumber, "id" | "number" | "service_type">
>;

/** Shape of a new address that is being created.
 *
 * Note that optional fields are still guaranteed to be set, but will have the
 * empty string as their value.
 */
interface NewAddress {
  name: string;
  address_1: string;
  address_2: string;
  city: string;
  state_province: string;
  postal_code: string;
}

/** Shape of the `addresses` State variable, which can either come from an
 * existing address or a new address. */
export type InternalAddress = (Address | NewAddress) & {
  isRemoved?: boolean;
  dirty?: boolean;
};

/** The type of route parameters coming from react-router, based on our routes.
 *
 * The `id` property comes from the `:id` in our edit route, where it is
 * mandatory, but is optional in this type because it is not present in the new
 * route.
 */
type RouteParams = { id?: string };

type Props = RouteComponentProps<RouteParams> & {
  showPopUpMessage: (p: PopupMessageProp) => void;
};

type State = {
  // Properties that are set at initialization time.
  scheduleObj: Record<string, never> | InternalSchedule;
  addresses: InternalAddress[];
  /** Mapping from service ID to service. */
  services: Record<number, InternalTopLevelService>;
  deactivatedServiceIds: Set<number>;
  notes: Partial<EditNotesState>;
  phones: InternalPhoneNumber[];
  submitting: boolean;
  newResource: boolean;
  inputsDirty: boolean;
  latestServiceId: number;

  // Properties that are added after initialization.
  alternate_name?: string;
  email?: string;
  internal_note?: string;
  legal_status?: string;
  long_description?: string;
  name?: string;
  resource?: InternalOrganization;
  short_description?: string;
  website?: string;
};

class OrganizationEditPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      scheduleObj: {},
      addresses: [],
      services: {},
      deactivatedServiceIds: new Set(),
      notes: {},
      phones: [],
      submitting: false,
      newResource: false,
      inputsDirty: false,
      latestServiceId: -1,
    };

    this.certifyHAP = this.certifyHAP.bind(this);
    this.keepOnPage = this.keepOnPage.bind(this);
    this.handleResourceFieldChange = this.handleResourceFieldChange.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeactivation = this.handleDeactivation.bind(this);
    this.createResource = this.createResource.bind(this);
    this.sidebarAddService = this.sidebarAddService.bind(this);
  }

  componentDidMount(): void {
    const {
      location: { pathname },
      match: { params },
    } = this.props;
    const splitPath = pathname.split("/");
    window.addEventListener("beforeunload", this.keepOnPage);
    if (splitPath[splitPath.length - 1] === "new") {
      this.setState({
        newResource: true,
        resource: { schedule: {} },
        scheduleObj: buildScheduleDays(undefined),
      });
    }
    const resourceID = params.id;
    if (resourceID) {
      const url = `/api/resources/${resourceID}`;
      fetch(url)
        .then((r) => r.json())
        .then((data) => this.handleAPIGetResource(data.resource));
    }
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.keepOnPage);
  }

  handleAPIGetResource = (resource: Organization): void => {
    // Transform the original API response such that all addresses on services
    // are replaced with handles to the corresponding address on the resource.
    // This ensures that there is only one canonical copy of an address, which
    // guarantees that changes to an address are reflected everywhere it is
    // referenced. Retrieving info about a service's address requires going
    // through the resource first. You can think of this as being similar to
    // database normalization, where the original API response returned
    // denormalized data (same address duplicated in multiple places).
    //
    // The handle is always represented as the index of the address within the
    // canonical array of addresses. Normally, the canonical array is
    // this.state.addresses, but if this.state.addresses is empty, then
    // this.state.resource.addresses is the canonical one. This is because when
    // a resource address is edited, this.state.addresses always contains the
    // most up-to-date information, but this.state.addresses is empty until the
    // first edit to the resource's addresses.

    const resourceAddresses = resource.addresses || [];
    const rawServices = resource.services || [];

    // Transformed version of services where the `addresses` property has been
    // replaced with an `addressHandles` property, which only contains the index
    // of an address within the resourceAddresses array.
    const transformedServices: InternalOrganizationService[] = rawServices.map(
      (service) => {
        const { addresses = [], ...serviceWithoutAddresses } = service;
        // It is safe to compare addresses using the  `id` here because at this
        // point, all addresses came from the API response and therefore have
        // database primary key IDs assigned. Addresses that are added in the Edit
        // page are not assigned IDs until after saving the page, so this
        // assumption is not safe to make after this point in time.
        const addressHandles = addresses.map((a) =>
          resourceAddresses.findIndex((ra) => ra.id === a.id)
        );
        return { ...serviceWithoutAddresses, addressHandles };
      }
    );
    // Build new version of the resource that has the services replaced with the
    // transformed services.
    const transformedResource = { ...resource, services: transformedServices };

    // Prebuild some data to get saved to this.state.services, which otherwise
    // only contains edits to the original data from the API response.
    const services = transformedServices.reduce<
      Record<number, InternalTopLevelService>
    >(
      (acc, service) => ({
        ...acc,
        [service.id]: {
          scheduleObj: buildScheduleDays(service.schedule),
          // If the service doesn't have a schedule associated with it, and can
          // inherit its schedule from its parent, inherit the parent resource's
          // schedule.
          shouldInheritScheduleFromParent: !_.get(
            service.schedule,
            "schedule_days.length",
            false
          ),
        },
      }),
      {}
    );

    this.setState({
      resource: transformedResource,
      services,
      scheduleObj: buildScheduleDays(resource.schedule),
    });
  };

  /** Post new and modified services to API.
   *
   * WARNING: This function makes a lot of brittle assumptions about many other
   * parts of the code. Please be very careful when modifying anything.
   *
   * This function is much more complex than one may realize because it needs to
   * handle many different scenarios, each of which has unique ways of sourcing
   * data from different sources.
   *
   * In the specific scenario where new addresses were created on the
   * organization _and_ these addresses were added to the service, we must POST
   * the addresses to the API _first_ before we can obtain their IDs, since they
   * do not have IDs until the backend saves them to the database. Only after
   * the addresses are created can we associate services with them.
   *
   * This needs to be handled correctly in the scenario where we must also
   * create a new service, since neither the service nor the addresses will have
   * IDs until we create them, so we cannot associate the two until we have
   * both.
   *
   * A graphical illustration of the dependency of promises follows:
   *
   * [created addresses] --->
   *                          [service-address relationships]
   * [create services] ----->
   *
   * This code attempts to handle the following scenarios:
   *
   * 1. No services have been touched. In this scenario, we just return
   *    immediately.
   *
   *    [created addresses]
   *
   * 2. Services are edited, but no changes were made to the addresses
   *    associated with the services. In this scenario, we have no chains, but
   *    we ignore the address promises and we push the service promises to
   *    the promises array.
   *
   *    [created addresses] (ignored)
   *
   *    [edit services] (pushed)
   *
   * 3. Services are edited, and they depend on newly-created addresses. In this
   *    scenario, we have a true dependency chain, and we must resolve the
   *    address promises first, retrieve their IDs, and then construct a new
   *    promise to associate the services with the addresses.
   *
   *    [created addresses] -> [associate services with addresses]
   *
   * 4. New services are created, and they depend on newly-created addresses. In
   *    this scenario, we have a chain three items deep, where we must create
   *    the addresses, create the services, and then associate the services with
   *    the addresses. Note that we could have chained them the other way
   *    around, but chaining them this way allows us to handle this in a similar
   *    way to the case where new services are created but do not depend on
   *    newly created addresses.
   *
   *    [created addresses] -> [create services] -> [associate services with addresses]
   *
   * HACK: WE CANNOT ACTUALLY IMPLEMENT SCENARIOS 3 AND 4 BECAUSE THE API DOES
   * NOT RESPOND WITH THE NEWLY CREATED ADDRESSES' IDS.
   */
  postServices = (servicesObj, promises, postAddressPromises) => {
    if (!servicesObj) return;
    const { resource, addresses } = this.state;
    assertDefined(resource, "Tried to access resource before it was defined");
    const newServices: any[] = [];
    const newServicesAddressHandles: any[] = [];
    const unsavedAddresses =
      addresses.length > 0 ? addresses : resource.addresses;

    const getAddressIDFromHandle = (handle: number) => {
      // The only case where unsavedAddresses can be undefined is if
      // resource.addresses is undefined, and that can only happen when creating a
      // new Organization. However, if we're calling this
      // getAddressIDFromHandle() function, then that means that we have an
      // address handle in the service we're about to save. That either means
      // that we're pointing to an address in the top-level addresses state
      // variable, which must be defined, or we're pointing to an address in the
      // original GET API response's Resource (Organization) object.
      assertDefined(
        unsavedAddresses,
        "unsavedAddresses should not be undefined"
      );

      const unsavedAddress = unsavedAddresses[handle];
      if (unsavedAddress && "id" in unsavedAddress && unsavedAddress.id) {
        // Associating with an address that already existed, which means
        // we can simply grab its ID.
        return Promise.resolve(unsavedAddress.id);
      }
      if (postAddressPromises[handle]) {
        // Associating with an address that was just created, which means
        // we have to index into postAddressPromises in order to obtain
        // its ID from the API response.
        return postAddressPromises[handle].then(() => {
          // FIXEME: The API does not respond with the address's ID
          throw new Error("NOT IMPLEMENTED");
        });
      }
      return Promise.reject(
        new Error("Received a handle to an address that doesn't exist.")
      );
    };

    Object.entries(servicesObj).forEach(([key, value]: any) => {
      const currentService = deepClone(value);
      if (key < 0) {
        // Create new service
        if (currentService.notesObj) {
          const notes = Object.values(currentService.notesObj.notes);
          delete currentService.notesObj;
          currentService.notes = notes;
        }

        currentService.schedule = createFullSchedule(
          currentService.scheduleObj
        );
        delete currentService.scheduleObj;

        const { addressHandles } = currentService;
        delete currentService.addressHandles;

        if (!_.isEmpty(currentService)) {
          newServices.push(currentService);
          newServicesAddressHandles.push(addressHandles);
        }
      } else {
        // Edit an existing service
        const uri = `/api/services/${key}/change_requests`;
        postNotes(currentService.notesObj, promises, {
          path: "services",
          id: key,
        });
        delete currentService.notesObj;
        postSchedule(currentService.scheduleObj, promises);
        delete currentService.scheduleObj;
        postInstructions(currentService.instructions, promises);
        delete currentService.instructions;
        postDocuments(currentService.documents, promises);
        delete currentService.documents;
        delete currentService.shouldInheritScheduleFromParent;
        const { addressHandles }: { addressHandles: number[] } = currentService;
        delete currentService.addressHandles;
        if (!_.isEmpty(currentService)) {
          promises.push(
            dataService.post(uri, { change_request: currentService })
          );

          // Compute the added and removed addresses by comparing the original
          // address handles to the new address handles, and submit API requests
          // that add/remove addresses from the service.

          // Special case: if addressHandles is undefined, then skip all the
          // remaining logic, since the addresses on the service were not
          // touched. This is important because without this early exit, the
          // rest of this code will think that we are trying to remove all
          // addresses from the service.
          if (addressHandles === undefined) return;

          // resource.services should not be undefined if we are editing an
          // existing service, since that implies that there should have been
          // services that came on the original resource.
          assertDefined(
            resource.services,
            "Did not expect resource.services to be undefined"
          );
          const originalService = resource.services.find(
            (s) => s.id === currentService.id
          );
          assertDefined(
            originalService,
            `Could not find the original service corresponding to edited service with ID ${currentService.id}`
          );
          const oldAddressHandleSet = new Set(originalService.addressHandles);
          const newAddressHandleSet = new Set(addressHandles);
          const removedAddressHandles = [
            ...setDifference(oldAddressHandleSet, newAddressHandleSet),
          ];
          const addedAddressHandles = [
            ...setDifference(newAddressHandleSet, oldAddressHandleSet),
          ];

          promises.push(
            ...removedAddressHandles.map((handle) =>
              getAddressIDFromHandle(handle).then((addressID) =>
                dataService.APIDelete(
                  `/api/services/${key}/addresses/${addressID}`
                )
              )
            )
          );
          promises.push(
            ...addedAddressHandles.map((handle) =>
              getAddressIDFromHandle(handle).then((addressID) =>
                dataService.put(
                  `/api/services/${key}/addresses/${addressID}`,
                  ""
                )
              )
            )
          );
        }
      }
    });

    if (newServices.length > 0) {
      const uri = `/api/resources/${resource.id}/services`;
      const newServicePromises = dataService
        .post(uri, { services: newServices })
        .then((resp) => resp.json())
        // After new services are created, grab their IDs and associate them
        // with addresses.
        .then((resp) =>
          Promise.all(
            resp.services.map(({ service }, i) => {
              const serviceAddressPromises = newServicesAddressHandles[i].map(
                (handle) =>
                  getAddressIDFromHandle(handle).then((addressID) =>
                    dataService.put(
                      `/api/services/${service.id}/addresses/${addressID}`,
                      ""
                    )
                  )
              );
              return Promise.all(serviceAddressPromises);
            })
          )
        );
      promises.push(newServicePromises);
    }
  };

  /** @method editServiceById
   * @description Updates the service with any changes made
   * @param id a unique identifier to find a service
   * @param service the service to be updated
   * @returns
   */
  editServiceById = (
    id: number,
    changes: Partial<InternalTopLevelService>
  ): void => {
    this.setState(({ services }) => {
      const oldService = services[id] || {};
      const newService = { ...oldService, ...changes };
      return {
        services: { ...services, [id]: newService },
        inputsDirty: true,
      };
    });
  };

  /** @method addService
   * @description Creates a brand new service
   */
  addService = (): void => {
    const { services, latestServiceId } = this.state;
    const nextServiceId = latestServiceId - 1;

    const newService = {
      id: nextServiceId,
      addressHandles: [],
      notes: [],
      schedule: {
        schedule_days: [],
      },
      scheduleObj: buildScheduleDays(undefined),
      shouldInheritScheduleFromParent: true,
    };
    this.setState({
      services: { ...services, [nextServiceId]: newService },
      latestServiceId: nextServiceId,
    });
  };

  // Combine several sources of data to provide a view of an address appropriate
  // both for the UI and for sending API requests.
  //
  // this.state.resource.addresses always contains the original, unmodified
  // addresses that came from the initial API load. (Note, it might be the case
  // that this field is being modified without going through this.setState().
  // Whoops!)
  //
  // this.state.addresses only contains modifications to the addresses
  getFlattenedAddresses = (): InternalAddress[] => {
    const { resource, addresses } = this.state;
    assertDefined(resource, "Tried to access resource before it was defined");
    const { addresses: resourceAddresses = [] } = resource;
    if (!_.isEmpty(addresses)) {
      return addresses;
    }
    if (!_.isEmpty(resourceAddresses)) {
      return resourceAddresses;
    }
    return [];
  };

  setAddresses = (addresses: InternalAddress[]) => {
    this.setState((state) => {
      // Update addresses, and possibly update services as well due to addresses
      // being removed.
      //
      // NOTE! This is very fragile, and if React does not schedule this state
      // update fast enough, then we could end up in a situation where we do not
      // have enough information to reconstruct what happened. Specifically,
      // this update function can only work if each add, edit and removal update
      // runs in isolation so that we can properly "diff" against the previous
      // state. If an edit and removal are scheduled at the same time will make it
      // impossible to perform the diff because we have no way of
      // differentiating between a removed address and an edited one. This
      // specifically affects addresses that were added in the edit page, not
      // ones that were originally from the database, since new addresses lack
      // an `id` property.
      //
      // This page _really_ needs to be completely rewritten.
      const { resource, services: oldServices } = state;
      assertDefined(resource, "Tried to access resource before it was defined");
      const oldAddresses = getAddresses(state);
      const changeType = computeTypeOfChangeToAddresses(
        oldAddresses,
        addresses
      );

      // A mapping from service ID to service. The key is a string and not a
      // number because putting a number in an object causes it to be converted
      // to a string. We should probably be using Maps and not Objects when
      // using non-string keys to avoid that conversion.
      let newServices: Record<string, InternalTopLevelService> | null = null;
      if (changeType.type === "removed") {
        const removedAddressHandle = changeType.handle;
        // Adjust the address handles on the services to reflect the new
        // indexes.
        newServices = Object.fromEntries(
          Object.entries(oldServices).map(([key, service]) => {
            let oldServiceAddressHandles: number[];
            if (service.addressHandles) {
              // If we had previously made a change to the service's addresses,
              // then they should be on this.state.services[x].addressHandles, and
              // we should use that list.
              oldServiceAddressHandles = service.addressHandles;
            } else {
              // TODO: This could possibly break on the Create New Resource
              // page.
              assertDefined(
                resource.services,
                "Did not expect resource.services to be undefined"
              );
              const serviceOnResource = resource.services.find(
                (s) => s.id === service.id
              );
              if (serviceOnResource && serviceOnResource.addressHandles) {
                // If we hadn't modified the service yet, but the service existed
                // on this.resource.services and had addressHandles, then use that
                // list.
                oldServiceAddressHandles = serviceOnResource.addressHandles;
              } else {
                // If neither of the above two cases apply, then return from the
                // .map() early by returning the original key-value pair
                // unmodified.
                return [key, service];
              }
            }
            const newAddressHandles = oldServiceAddressHandles.reduce<number[]>(
              (handles, handle) => {
                if (handle < removedAddressHandle) {
                  // Address unchanged
                  return [...handles, handle];
                }
                if (handle === removedAddressHandle) {
                  // Removed address; skip pushing this handle.
                  return handles;
                }
                // Handle is outdated; subtract 1 from the handle to get the new
                // index.
                return [...handles, handle - 1];
              },
              []
            );
            return [key, { ...service, addressHandles: newAddressHandles }];
          })
        );
      } else if (changeType.type === "markedForRemoval") {
        // No addresses were added or removed, but we still need to check to see
        // if any addresses had `isRemoved` set to true. If so, if any service
        // has a handle to that address, remove it from the service.
        const removedAddressHandle = changeType.handle;
        const someServiceHasStaleHandle = Object.values(oldServices).some(
          (service) => {
            let addressHandles: number[];
            if (service.addressHandles) {
              ({ addressHandles } = service);
            } else {
              // It shouldn't be possible for resource.services to be undefined.
              // This is always at least set to the empty array when we are
              // editing an Organization that was previously saved to the DB, so
              // this could only happen on the Create New Organization page.
              // However, this change type corresponds to marking an address for
              // removal on the DB, which cannot be the case for a new
              // Organization that hasn't been saved yet.
              assertDefined(
                resource.services,
                "Did not expect resource.services to be undefined"
              );
              const serviceOnResource = resource.services.find(
                (s) => s.id === service.id
              );
              if (serviceOnResource && serviceOnResource.addressHandles) {
                ({ addressHandles } = serviceOnResource);
              } else {
                // exit early
                return false;
              }
            }
            return addressHandles.some(
              (handle) => handle === removedAddressHandle
            );
          }
        );
        if (someServiceHasStaleHandle) {
          newServices = Object.fromEntries(
            Object.entries(oldServices).map(([key, service]) => {
              if (service.addressHandles === undefined) {
                return [key, service];
              }
              const filteredHandles = service.addressHandles.filter(
                (handle) => handle !== removedAddressHandle
              );
              return [key, { ...service, addressHandles: filteredHandles }];
            })
          );
        }
      }

      type StateUpdate = {
        addresses: InternalAddress[];
        inputsDirty: boolean;
        services?: Record<number, InternalTopLevelService>;
      };
      const updates: StateUpdate = { addresses, inputsDirty: true };
      if (newServices !== null) {
        updates.services = newServices;
      }
      // There's a bug in the TypeScript types for setState() where it doesn't
      // correctly infer the right types if the return type of this function has
      // more than one shape and/or has an optional key. We explicitly cast up
      // to make the `services` key required, helping setState() infer something
      // reasonable for the case where the `services` key is present.
      return updates as Required<StateUpdate>;
    });
  };

  keepOnPage(e: BeforeUnloadEvent): void {
    const { inputsDirty } = this.state;
    if (inputsDirty) {
      const message =
        "Are you sure you want to leave? Any changes you have made will be lost.";
      e.returnValue = message;
    }
  }

  /** Submit a POST request to create a new Resource with the current state.
   *
   * For editing an existing Resource, see `handleSubmit()`.
   */
  createResource() {
    const {
      scheduleObj,
      notes,
      phones,
      name,
      long_description,
      website,
      email,
      addresses,
      legal_status,
    } = this.state;
    const { history } = this.props;
    const schedule = prepSchedule(scheduleObj);
    const newResource = {
      name,
      addresses,
      long_description,
      email,
      website,
      notes: notes.notes ? prepNotesData(notes.notes) : [],
      schedule: { schedule_days: schedule },
      phones,
      legal_status,
    };
    const requestString = "/api/resources";

    this.setState({ submitting: true });
    const setNotSubmitting = () => {
      this.setState({ submitting: false });
    };
    dataService
      .post(requestString, { resources: [newResource] })
      .then((response) => {
        if (response.ok) {
          alert("Resource successfuly created. Thanks!"); // eslint-disable-line no-alert
          response
            .json()
            .then((res) =>
              history.push(`/organizations/${res.resources[0].resource.id}`)
            );
        } else {
          Promise.reject(response);
        }
      })
      .catch((error) => {
        alert("Issue creating resource, please try again."); // eslint-disable-line no-alert
        console.log(error); // eslint-disable-line no-console
        setNotSubmitting();
      });
  }

  handleSubmit() {
    const { history, showPopUpMessage } = this.props;
    this.setState({ submitting: true });
    const {
      addresses,
      alternate_name,
      email,
      internal_note,
      legal_status,
      long_description,
      name,
      notes,
      phones,
      resource,
      scheduleObj,
      services,
      short_description,
      website,
    } = this.state;
    assertDefined(resource, "Tried to access resource before it was defined");
    const promises: any[] = [];

    // Resource
    const resourceChangeRequest: any = {};
    let resourceModified = false;
    if (name !== resource.name) {
      resourceChangeRequest.name = name;
      resourceModified = true;
    }
    if (long_description !== resource.long_description) {
      resourceChangeRequest.long_description = long_description;
      resourceModified = true;
    }
    if (short_description !== resource.short_description) {
      resourceChangeRequest.short_description = short_description;
      resourceModified = true;
    }
    if (website !== resource.website) {
      resourceChangeRequest.website = website;
      resourceModified = true;
    }
    if (email !== resource.email) {
      resourceChangeRequest.email = email;
      resourceModified = true;
    }
    if (alternate_name !== resource.alternate_name) {
      resourceChangeRequest.alternate_name = alternate_name;
      resourceModified = true;
    }
    if (legal_status !== resource.legal_status) {
      resourceChangeRequest.legal_status = legal_status;
      resourceModified = true;
    }
    if (internal_note !== resource.internal_note) {
      resourceChangeRequest.internal_note = internal_note;
      resourceModified = true;
    }
    // fire off resource request
    if (resourceModified) {
      promises.push(
        dataService.post(`/api/resources/${resource.id}/change_requests`, {
          change_request: resourceChangeRequest,
        })
      );
    }

    // Fire off phone requests
    postCollection(phones, resource.phones, "phones", promises, resource.id);

    // schedule
    postSchedule(scheduleObj, promises);

    // Addresses
    const postAddressPromises = postAddresses(addresses, {
      path: "resources",
      id: resource.id,
    });
    promises.push(...postAddressPromises);

    // Services
    this.postServices(services, promises, postAddressPromises);

    // Notes
    postNotes(notes, promises, { path: "resources", id: resource.id });

    const that = this;
    Promise.all(promises)
      .then(() => {
        history.push(`/organizations/${resource.id}`);
        showPopUpMessage({
          type: "success",
          message: "Successfully saved your changes.",
        });
      })
      .catch((err) => {
        this.setState({ submitting: false });
        console.log(err); // eslint-disable-line no-console
        showPopUpMessage({
          type: "error",
          message: "Sorry! An error occurred.",
        });
      });
  }

  handleDeactivation(type: "resource" | "service", id: number): void {
    const { history } = this.props;
    let confirmMessage: string;
    let path: string;
    if (type === "resource") {
      confirmMessage = "Are you sure you want to deactivate this resource?";
      path = `/api/resources/${id}`;
    } else if (type === "service") {
      confirmMessage = "Are you sure you want to remove this service?";
      path = `/api/services/${id}`;
    } else {
      throw new Error(`Unexpected type: ${type}`);
    }

    // eslint-disable-next-line no-alert
    if (window.confirm(confirmMessage)) {
      if (id < 0) {
        this.setState(({ deactivatedServiceIds }) => {
          const newDeactivatedServiceIds = new Set(deactivatedServiceIds);
          newDeactivatedServiceIds.add(id);
          return { deactivatedServiceIds: newDeactivatedServiceIds };
        });
      } else {
        dataService
          .APIDelete(path, { change_request: { status: "2" } } as any)
          .then(() => {
            // eslint-disable-next-line no-alert
            alert(
              "Successful! \n \nIf this was a mistake, please let someone from the ShelterTech team know."
            );
            if (type === "resource") {
              // Resource successfully deactivated. Redirect to home.
              history.push({ pathname: "/" });
            } else {
              // Service successfully deactivated. Mark deactivated in local state.
              this.setState((state) => {
                state.deactivatedServiceIds.add(id);
                return state;
              });
            }
          });
      }
    }
  }

  handlePhoneChange(phoneCollection: InternalPhoneNumber[]) {
    this.setState({ phones: phoneCollection, inputsDirty: true });
  }

  handleResourceFieldChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { field } = e.target.dataset;
    assertDefined(
      field,
      "Called handleResourceFieldChange() on a form element missing the data-field attribute."
    );
    const { value } = e.target;
    const object = {
      [field]: value,
      inputsDirty: true,
    } as any;
    this.setState(object);
  }

  handleScheduleChange(scheduleObj: InternalSchedule) {
    this.setState({ scheduleObj, inputsDirty: true });
  }

  handleNotesChange(notesObj: EditNotesState) {
    this.setState({ notes: notesObj, inputsDirty: true });
  }

  certifyHAP() {
    const { resource } = this.state;
    assertDefined(resource, "Tried to access resource before it was defined");
    const { id: resourceId } = resource;
    dataService
      .post(`/api/resources/${resourceId}/certify`)
      .then((response) => {
        // TODO: Do not use alert() for user notifications.
        if (response.ok) {
          alert("HAP Certified. Thanks!"); // eslint-disable-line no-alert
          const { resource: prevResource } = this.state;
          assertDefined(
            prevResource,
            "Tried to access resource before it was defined"
          );
          prevResource.certified = response.ok;
          this.setState({ resource: prevResource });
        } else {
          alert("Issue verifying resource. Please try again."); // eslint-disable-line no-alert
        }
      });
  }

  sidebarAddService() {
    this.addService();
    const newService = document.getElementById("new-service-button");
    // eslint-disable-next-line react/no-find-dom-node
    const domNode = ReactDOM.findDOMNode(newService) as any;
    domNode.scrollIntoView({ behavior: "smooth" });
  }

  renderSectionFields() {
    const { resource, scheduleObj } = this.state;
    assertDefined(resource, "Tried to access resource before it was defined");
    if (isEmptyInternalSchedule(scheduleObj))
      throw new Error("Expected scheduleObj to not be empty");
    return (
      <section id="info" className="edit--section">
        <ul className="edit--section--list">
          <li key="internal_note" className="edit--section--list--item">
            <label htmlFor="edit-internal-note-input">
              <p className="internal-note-label-text">
                Internal Notes about Editing this Organization
              </p>
              <p className="internal-note-label-subtext">
                (These notes will NOT be displayed to users. They are for
                internal use only, to help with content editing.)
              </p>
            </label>
            <textarea
              id="edit-internal-note-input"
              className="input edit-section-internal-note"
              placeholder="Add any info that future content editors should be aware of updating this resource. Adding dates to your notes will help with tracking changes."
              defaultValue={resource.internal_note ?? ""}
              data-field="internal_note"
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <li key="name" className="edit--section--list--item">
            <label htmlFor="edit-name-input">Name of the Organization</label>
            <input
              id="edit-name-input"
              type="text"
              className="input"
              placeholder="Organization Name"
              data-field="name"
              defaultValue={resource.name}
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <li key="alternate_name" className="edit--section--list--item">
            <label htmlFor="edit-alternate-name-input">Nickname</label>
            <input
              id="edit-alternate-name-input"
              type="text"
              className="input"
              placeholder="What it's known as in the community"
              data-field="alternate_name"
              defaultValue={resource.alternate_name ?? ""}
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <EditAddresses
            addresses={this.getFlattenedAddresses()}
            setAddresses={this.setAddresses}
          />

          <EditPhones
            collection={resource.phones}
            handleChange={this.handlePhoneChange}
          />

          <li key="website" className="edit--section--list--item email">
            <label htmlFor="edit-website-input">Website</label>
            <input
              id="edit-website-input"
              type="url"
              className="input"
              placeholder="http://"
              defaultValue={resource.website ?? ""}
              data-field="website"
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <li key="email" className="edit--section--list--item email">
            <label htmlFor="edit-email-input">E-Mail</label>
            <input
              id="edit-email-input"
              type="email"
              className="input"
              defaultValue={resource.email ?? ""}
              data-field="email"
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <li key="long_description" className="edit--section--list--item">
            <label htmlFor="edit-description-input">Description</label>
            <textarea
              id="edit-description-input"
              className="input"
              placeholder="Describe the organization in 1-2 sentences. Avoid listing the services it provides and instead explaint the organization's mission."
              defaultValue={resource.long_description ?? ""}
              data-field="long_description"
              onChange={this.handleResourceFieldChange}
            />
            <p>
              If you&#39;d like to add formatting to descriptions, we
              support&nbsp;
              <a
                href="https://github.github.com/gfm/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github Flavored Markdown
              </a>
              .
            </p>
          </li>

          <li key="legal_status" className="edit--section--list--item email">
            <label htmlFor="edit-legal-status-input">Legal Status</label>
            <input
              id="edit-legal-status-input"
              type="text"
              className="input"
              placeholder="ex. non-profit, government, business"
              defaultValue={resource.legal_status ?? ""}
              data-field="legal_status"
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <EditSchedule
            scheduleDaysByDay={scheduleObj}
            scheduleId={resource.schedule.id}
            canInheritFromParent={false}
            shouldInheritFromParent={false}
            handleScheduleChange={this.handleScheduleChange}
          />

          <EditNotes
            notes={resource.notes}
            handleNotesChange={this.handleNotesChange}
          />
        </ul>
      </section>
    );
  }

  renderServices() {
    const {
      resource,
      services: serviceChanges,
      deactivatedServiceIds: serviceDeletions,
    } = this.state;
    assertDefined(resource, "Tried to access resource before it was defined");
    const { services } = resource;
    assertDefined(services, "Expected resource.services to be defined");
    const flattenedServices = applyChanges(
      services,
      serviceChanges,
      serviceDeletions
    );
    return (
      <ul className="edit--section--list">
        <EditServices
          services={flattenedServices}
          editServiceById={this.editServiceById}
          addService={this.addService}
          handleDeactivation={this.handleDeactivation}
          resourceAddresses={this.getFlattenedAddresses()}
        />
      </ul>
    );
  }

  render() {
    const { inputsDirty, newResource, resource, services, submitting } =
      this.state;
    const { history } = this.props;

    const showPrompt = inputsDirty && !submitting;

    return !resource ? (
      <Loader />
    ) : (
      <div className="edit">
        <EditSidebar
          createResource={this.createResource}
          handleSubmit={this.handleSubmit}
          handleCancel={() => history.goBack()}
          handleDeactivation={this.handleDeactivation}
          resource={resource}
          submitting={submitting}
          certifyHAP={this.certifyHAP}
          newServices={services}
          newResource={newResource}
          addService={this.sidebarAddService}
        />
        <div className="edit--main">
          <header className="edit--main--header">
            <h1 className="edit--main--header--title">
              Let&apos;s start with the basics
            </h1>
          </header>
          <div className="edit--sections">{this.renderSectionFields()}</div>
          {!newResource && (
            <div className="edit--services">
              <header className="edit--main--header">
                <h1 className="edit--main--header--title">Services</h1>
              </header>
              <div className="edit--sections">{this.renderServices()}</div>
            </div>
          )}
        </div>
        <Prompt
          message="Are you sure you want to leave? Any changes you have made will be lost."
          when={showPrompt}
        />
      </div>
    );
  }
}

export default withRouter(OrganizationEditPage);
