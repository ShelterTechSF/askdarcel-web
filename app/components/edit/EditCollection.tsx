import React, { Component } from "react";

/** Base properties expected on an item. */
interface BaseItem {
  id?: number;
  isRemoved?: boolean;
  dirty?: boolean;
}

/** The props of the single EditItem component that gets passed to editCollectionHOC. */
type EditSingleItemProps<T> = {
  index: number;
  item: T;
  handleChange: (index: number, newItem: T) => void;
};

/**
 *
 * @param {Component} ResourceObjectItem individual component to have a collection for
 * @param {string} label title field for items
 * @param {Object} blankTemplateObj blank template to fill new items in the collection with
 */
export default function editCollectionHOC<T extends BaseItem>(
  ResourceObjectItem: typeof Component<EditSingleItemProps<T>>,
  label: string,
  blankTemplateObj: T,
  buttonText: string
) {
  type Props = {
    collection?: T[];
    handleChange: (newCollection: T[]) => void;
  };
  // WARNING: The way we are calling setState() on this component is extremely
  // weird, since we pass the `collection` array as the first argument, rather
  // than an object that looks like `{ collection }`. What this actually means
  // is that the `collection` array gets interpreted as an object, where the
  // keys are the numeric indices (converted to strings), and the values are the
  // item at that index. This means that after a single call to `setState()`,
  // the state actually looks something like this:
  //
  // {
  //    collection: [item0, item1, ...],
  //    0: item0,
  //    1: item1,
  //    ...
  // }
  //
  // This was probably unintentional, and the only reason why this higher order
  // component works at all is because we are directly mutating the objects
  // within the state before calling `setState()`, which is also bad because you
  // are not supposed to directly mutate state on React components.
  //
  // To appease TypeScript, we cast the arguments to `setState()` to `any`, but
  // we should really fix this by not directly mutating state and by not trying
  // to set the state to an array.
  type State = {
    collection: T[];
  };
  return class EditCollection extends Component<Props, State> {
    // ESLint Airbnb rules conflict with TypeScript here, since we have no other
    // way to declare a static property that is assigned outside of the class
    // declaration.
    // eslint-disable-next-line react/static-property-placement
    static displayName: string;

    constructor(props: Props) {
      super(props);

      const { collection = [] } = this.props;

      this.state = {
        collection: collection.slice(),
      };

      this.addItem = this.addItem.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.createItemComponents = this.createItemComponents.bind(this);
      this.removeItem = this.removeItem.bind(this);
    }

    handleChange(index: number, item: T) {
      const { handleChange } = this.props;
      const { collection } = this.state;
      /* eslint-disable no-param-reassign */
      item.dirty = true;
      collection[index] = item;
      // HACK: see comment on State.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.setState(collection as any, () => handleChange(collection));
    }

    addItem() {
      const { collection } = this.state;
      collection.push(blankTemplateObj);
      // HACK: see comment on State.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.setState(collection as any);
    }

    removeItem(index: number, item: T) {
      const { handleChange } = this.props;
      const { collection } = this.state;
      if (collection[index].id) {
        collection[index] = { ...item, isRemoved: true };
      } else {
        collection.splice(index, 1);
      }

      // HACK: see comment on State.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.setState(collection as any, () => handleChange(collection));
    }

    createItemComponents() {
      const { collection } = this.state;
      return collection
        .map((item, index) => [item, index] as const)
        .filter(([item]) => !item.isRemoved)
        .map(([item, index]) => (
          <div
            key={index}
            className="edit--section--list--item--collection-container"
          >
            <ResourceObjectItem
              index={index}
              item={item}
              handleChange={this.handleChange}
            />
            <button
              type="button"
              className="trash-button icon-button"
              onClick={() => this.removeItem(index, item)}
            >
              <i className="material-symbols-outlined">&#xE872;</i>
            </button>
          </div>
        ));
    }

    render() {
      return (
        <li className="edit--section--list--item edit--notes">
          <label htmlFor="edit-item">{label}</label>
          <ul className="edit--section--list--item--sublist">
            {this.createItemComponents()}
          </ul>
          <button
            type="button"
            className="edit--section--list--item--button solid-brand"
            onClick={this.addItem}
          >
            {buttonText}
          </button>
        </li>
      );
    }
  };
}
