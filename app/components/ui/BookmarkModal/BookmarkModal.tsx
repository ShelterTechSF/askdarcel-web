import React, { useEffect, useRef, useState } from "react";

import whitelabel from "utils/whitelabel";
import type { SearchHit } from "models/SearchHits";
import { Modal } from "components/ui/Modal/Modal";
import { Button } from "components/ui/inline/Button/Button";

import styles from "./BookmarkModal.module.scss";

const { siteUrl } = whitelabel;

export const BookmarkModal = ({
  isOpen,
  setIsOpen,
  hit,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  hit: SearchHit;
}) => {
  // TODO update any types as needed when API work is done
  interface Folder {
    id: number;
    name: string;
  }

  // TODO: If bookmark already exists, use bookmark name; otherwise,
  // default to service/resource name. This should be updated with the correct
  // bookmark name prop when the API is operational
  // const initialName = hit.bookmarkName ?? hit.name;
  const initialName = hit.name;
  // TODO: Once the service/resource can have an associated bookmark model, we can check
  // if the bookmark already exists and update various props on the modal accordingly
  const newBookmark = false;

  const [folderOptions, setFolderOptions] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [newFolder, setNewFolder] = useState("");
  const [expandFolders, setExpandFolders] = useState(false);
  const [bookmarkName, setBookmarkName] = useState(initialName);
  const foldersContainerRef = useRef(null);

  useEffect(() => {
    // TODO: fetch bookmark folders when the API endpoint is ready. The setTimeout function
    // is a mock request for the purposes of development.
    const mockResponse = new Promise((resolve) => {
      setTimeout(() => {
        const mockFolders = [
          { id: 1, name: "Cory's Service List", bookmarks: [] },
          { id: 2, name: "Fred's Service List", bookmarks: [] },
          { id: 3, name: "Fredd's Service List", bookmarks: [] },
          { id: 4, name: "Frewwd's Service List", bookmarks: [] },
          { id: 5, name: "Frqed's Service List", bookmarks: [] },
          { id: 8, name: "Frrred's Service List", bookmarks: [] },
          { id: 9, name: "Fre333d's Service List", bookmarks: [] },
        ];
        resolve(mockFolders);
      }, 500);
    });

    mockResponse.then((value) => {
      // TODO: Update TS types when the API is working
      const response = value as Folder[];
      setFolderOptions(response);
    });
  }, []);

  const handleContainerBlur = (event: React.FocusEvent<HTMLDivElement, Element>) => {
    // relatedTarget is the element that is gaining focus
    const newFocus = event.relatedTarget;
    const folderElement = foldersContainerRef.current as unknown as Element;
    // Check if the new focus is outside the container
    if (newFocus && !folderElement.contains(newFocus)) {
      setExpandFolders(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const createBookmark = () => {
    // TODO: when bookmarks/folder API is done, fix this up
    if (!selectedFolder || !bookmarkName) return;
    const isNewFolder = selectedFolder.id > -1;
    if (isNewFolder) {
      // Create new folder then create new bookmark
    } else {
      // Just create new bookmark: pass service/resource ID and folder ID, etc.
    }
  };

  const createNewFolder = (name: string) => {
    setNewFolder(name);
    if (name.length) {
      setSelectedFolder({ id: -1, name });
    } else {
      setSelectedFolder(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      addModalClass={styles.bookmarkModal}
      closeModal={closeModal}
    >
      <h2 className={styles.title}>{`${newBookmark ? "Add Bookmark" : "Edit Bookmark"}`}</h2>
      <div className={styles.modalContent}>
        <div>
          <div className={styles.bookmarkDescription}>
            <i className={`material-icons ${styles.bookmarkIcon}`}>folder</i>
            <div className={styles.bookmarkNameContainer}>
              <input
                value={bookmarkName}
                onChange={(evt) => setBookmarkName(evt.target.value)}
                className={styles.bookmarkName}
                type="text"
                placeholder="Bookmark Name"
              />
              <button
                onClick={() => setBookmarkName("")}
                type="button"
                className={styles.clearBookmarkButton}
              >
                <i className={`material-icons ${styles.clearBookmarkText}`}>
                  cancel
                </i>
              </button>
            </div>
            <p className={styles.bookmarkUrl}>{`${siteUrl}/${
              hit.type === "service" ? `services` : `organizations`
            }/${hit.id}`}</p>
          </div>
          <p className={styles.label}>LOCATION</p>
          <div
            className={styles.selectFolderContainer}
            onBlur={(evt) => {
              handleContainerBlur(evt);
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
                    htmlFor="createNewFolder"
                  >
                    +
                  </label>
                  <input
                    id="createNewFolder"
                    className={styles.addFolderInput}
                    type="text"
                    placeholder="Create new folder"
                    value={newFolder}
                    onChange={(evt) => createNewFolder(evt.target.value)}
                    onFocus={(evt) => {
                      createNewFolder(evt.target.value);
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
