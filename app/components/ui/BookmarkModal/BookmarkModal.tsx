import React, { useEffect, useRef, useState } from "react";

import { useAppContext } from "utils";
import whitelabel from "utils/whitelabel";
import type { SearchHit } from "models/SearchHits";
import { Modal } from "components/ui/Modal/Modal";
import { Button } from "components/ui/inline/Button/Button";

import { getCurrentUser } from "models/User";
import * as BookmarkApi from "models/Bookmark";
import styles from "./BookmarkModal.module.scss";

const { siteUrl } = whitelabel;

export const BookmarkModal = ({
  isOpen,
  setIsOpen,
  setBookmarkAdded,
  hit,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  setBookmarkAdded: (val: boolean) => void;
  hit: SearchHit;
}) => {
  // Note, this differs from the actual API model because 1) we don't bother
  // with sticking the user_id in this structure until just before we POST the
  // object, and 2) we allow id to be missing in the case we are creating a new
  // folder.
  interface Folder {
    id?: number;
    name: string;
    order: number;
  }

  // TODO: If bookmark already exists, use bookmark name; otherwise,
  // default to service/resource name. This should be updated with the correct
  // bookmark name prop when the API is operational
  const initialName = hit.name;
  // TODO: Once the service/resource can have an associated bookmark model, we can check
  // if the bookmark already exists and update various UI on the modal accordingly
  const newBookmark = true;

  const { authState } = useAppContext();

  const [folderOptions, setFolderOptions] = useState<Folder[]>([]);
  // TODO: This should probably be an index representing the selected element in the folderOptions array
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [newFolder, setNewFolder] = useState("");
  const [expandFolders, setExpandFolders] = useState(false);
  const [bookmarkName, setBookmarkName] = useState(initialName);
  const foldersContainerRef = useRef(null);

  useEffect(() => {
    // Only fire this effect when the modal is open; otherwise, it causes all
    // instances of the unopened modal to fire simultaneously.
    if (authState && isOpen) {
      // It is silly to always on-the-fly query for the user ID, but we don't
      // have a great way of storing this more globally in the app at the
      // moment.
      const authToken = authState.accessTokenObject.token;
      getCurrentUser(authToken)
        .then((user) => BookmarkApi.getFoldersForUser(user.id, authToken))
        .then((resp) => setFolderOptions(resp.folders));
    }
  }, [authState, isOpen]);

  const handleDropdownBlur = (
    event: React.FocusEvent<HTMLDivElement, Element>
  ) => {
    // Closes the dropdown unless the newly focused element is a child of the dropdown
    const newFocus = event.relatedTarget;
    const folderElement = foldersContainerRef.current as unknown as Element;
    if (newFocus && !folderElement.contains(newFocus)) {
      setExpandFolders(false);
    }
  };

  const createBookmark = () => {
    if (!authState)
      throw new Error(
        "Expected authState to not be null when creating bookmark"
      );
    const authToken = authState.accessTokenObject.token;

    // TODO: when bookmarks/folder API is done, fix this up
    if (!selectedFolder || !bookmarkName) return;

    getCurrentUser(authState.accessTokenObject.token)
      .then((user) => {
        let folderIdPromise: Promise<number>;
        if (selectedFolder.id === undefined) {
          // Create new folder then create new bookmark
          folderIdPromise = BookmarkApi.createFolder(
            { ...selectedFolder, user_id: user.id },
            authToken
          ).then((folder) => folder.id);
        } else {
          folderIdPromise = Promise.resolve(selectedFolder.id);
        }

        // TODO: We don't have a simpler way of getting the maximum bookmark
        // order for the specific folder in question, so the best we can do is
        // pick an order position that is larger than all other bookmarks by the
        // user.
        const maxBookmarkOrderPromise: Promise<number> =
          BookmarkApi.getBookmarksForUser(user.id, authToken).then(
            (bookmarks) =>
              bookmarks.bookmarks.length === 0
                ? 0
                : Math.max(...bookmarks.bookmarks.map((b) => b.order))
          );

        Promise.all([folderIdPromise, maxBookmarkOrderPromise]).then(
          ([folderId, maxOrder]) =>
            BookmarkApi.createBookmark(
              {
                order: maxOrder + 1,
                folder_id: folderId,
                service_id: hit.type === "service" ? hit.id : null,
                resource_id: hit.type === "resource" ? hit.id : null,
                user_id: user.id,
              },
              authToken
            )
        );
      })
      .then(() => {
        setIsOpen(false);
        setBookmarkAdded(true);
      })
      .catch(() => alert("An error occurred"));
  };

  const setNewFolderName = (name: string) => {
    setNewFolder(name);
    if (name.length) {
      const maxOrder =
        folderOptions.length === 0
          ? 0
          : Math.max(...folderOptions.map((f) => f.order));
      setSelectedFolder({ name, order: maxOrder + 1 });
    } else {
      setSelectedFolder(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      addModalClass={styles.bookmarkModal}
      closeModal={() => setIsOpen(false)}
    >
      <h2 className={styles.title}>{`${
        newBookmark ? "Add Bookmark" : "Edit Bookmark"
      }`}</h2>
      <div className={styles.modalContent}>
        <div>
          <div className={styles.bookmarkDescription}>
            <i className={`material-icons ${styles.bookmarkIcon}`}>star</i>
            <div className={styles.bookmarkNameContainer}>
              <input
                value={bookmarkName}
                onChange={(evt) => setBookmarkName(evt.target.value)}
                className={styles.bookmarkName}
                disabled // The API doesn't support setting a name for the bookmark yet.
                type="text"
                placeholder="Bookmark Name"
              />
              {/* The API doesn't support setting a name for the bookmark yet.
              <button
                onClick={() => setBookmarkName("")}
                type="button"
                className={styles.clearBookmarkButton}
              >
                <i className={`material-icons ${styles.clearBookmarkText}`}>
                  cancel
                </i>
              </button>
              */}
            </div>
            <p className={styles.bookmarkUrl}>{`${siteUrl}/${
              hit.type === "service" ? `services` : `organizations`
            }/${hit.id}`}</p>
          </div>
          <p className={styles.label}>Location</p>
          <div
            className={styles.selectFolderContainer}
            onBlur={(evt) => {
              handleDropdownBlur(evt);
            }}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            ref={foldersContainerRef}
          >
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <p
              className={styles.selectFolder}
              onClick={() => setExpandFolders(!expandFolders)}
            >
              <span className={selectedFolder?.name ? "" : styles.placeholder}>
                {selectedFolder?.name ?? "Select Folder"}
              </span>
              <i className="material-icons">arrow_drop_down</i>
            </p>
            {expandFolders && (
              <ul className={styles.bookmarkFoldersList}>
                {folderOptions.map((folder) => {
                  return (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <li
                      key={folder.id}
                      className={styles.folderListItem}
                      onClick={() => {
                        setSelectedFolder(folder);
                        setExpandFolders(false);
                      }}
                    >
                      <i className={`material-icons ${styles.folderIcon}`}>
                        folder
                      </i>
                      {folder.name}
                    </li>
                  );
                })}
                <li
                  className={`${styles.folderListItem} ${styles.addFolderItem}`}
                >
                  <label
                    className={styles.addFolderLabel}
                    htmlFor="setNewFolderName"
                  >
                    +
                  </label>
                  <input
                    id="setNewFolderName"
                    className={styles.addFolderInput}
                    type="text"
                    placeholder="Create new folder"
                    value={newFolder}
                    onChange={(evt) => setNewFolderName(evt.target.value)}
                    onFocus={(evt) => {
                      if (evt.target.value) {
                        setNewFolderName(evt.target.value);
                      }
                    }}
                    onKeyDown={(evt) => {
                      if (evt.key === "Enter") {
                        setExpandFolders(false);
                      }
                    }}
                  />
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className={styles.buttonBar}>
          <Button
            disabled={!bookmarkName || !selectedFolder}
            addClass={styles.addBookmarkBtn}
            onClick={createBookmark}
          >
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BookmarkModal;
