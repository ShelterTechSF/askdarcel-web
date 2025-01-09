import React, { useEffect, useState } from "react";
import { slide as Menu, State } from "react-burger-menu";
import { Link } from "react-router-dom";
import { icon } from "assets";
import { getCurrentUser } from "models/User";
import { getBookmarksForUser, getFoldersForUser } from "models/Bookmark";
import type { Bookmark } from "models/Bookmark";
import { useAppContext } from "utils";
import { fetchOrganization, fetchService } from "models";
import styles from "./BookmarksMenu.module.scss";

// These are the file-local shapes of these data structures. The API returns
// non-nested variants, so it's this file's job to attach bookmarks to folders
// hierarchically.

interface Folder {
  id: number;
  name: string;
  updatedAt?: string;
  bookmarks: Bookmark[];
}

const menuStyles = {
  bmBurgerButton: {
    display: "none",
  },
  bmCrossButton: {
    display: "none",
  },
  bmMenu: {
    backgroundColor: "#fff",
  },
  bmMenuWrap: {
    maxWidth: "100vw",
  },
};

export const BookmarksMenu = ({
  isOpen,
  onStateChange,
  outerContainerId,
  pageWrapId,
  toggleBookmarksMenu,
}: {
  isOpen: boolean;
  onStateChange: (s: State) => void;
  outerContainerId: string;
  pageWrapId: string;
  toggleBookmarksMenu: (open: boolean) => void;
}) => (
  <Menu
    isOpen={isOpen}
    onStateChange={onStateChange}
    outerContainerId={outerContainerId}
    pageWrapId={pageWrapId}
    right
    styles={menuStyles}
    itemListElement="div"
    width={450}
  >
    <BookmarksInnerMenu toggleMenu={toggleBookmarksMenu} isOpen={isOpen} />
  </Menu>
);

const BookmarksInnerMenu = ({
  toggleMenu,
  isOpen,
}: {
  toggleMenu: (open: boolean) => void;
  isOpen: boolean;
}) => {
  const [activeFolder, setActiveFolder] = useState<number | null>(null);
  const [bookmarkFolders, setBookmarkFolders] = useState<Folder[]>([]);
  const { authState } = useAppContext();

  useEffect(() => {
    if (!authState) return;
    if (!isOpen) return;
    const authToken = authState.accessTokenObject.token;
    getCurrentUser(authToken).then((user) =>
      Promise.all([
        getFoldersForUser(user.id, authToken),
        getBookmarksForUser(user.id, authToken),
      ]).then(([folders, bookmarks]) => {
        const bookmarksByFolderId = new Map<number, Bookmark[]>();
        bookmarks.bookmarks.forEach((bookmark) => {
          const folderId = bookmark.folder_id;
          if (folderId === null)
            throw new Error("Cannot handle bookmark without folder");
          if (!bookmarksByFolderId.has(folderId)) {
            bookmarksByFolderId.set(folderId, []);
          }
          bookmarksByFolderId.get(folderId)!.push(bookmark);
        });

        const transformedFolders = folders.folders.map((f) => ({
          ...f,
          bookmarks: bookmarksByFolderId.get(f.id) ?? [],
        }));
        setBookmarkFolders(transformedFolders);
      })
    );
    // We capture isOpen because we want to refresh this menu every time this
    // modal is reopened. Otherwise, if you add a bookmark, navigate to the
    // dashboard, and then open this BookmarkMenu, it will not reflect the newly
    // added bookmarks.
  }, [authState, isOpen]);

  const showFolders = () => {
    if (activeFolder !== null) {
      setActiveFolder(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Bookmarks</h2>
        <button
          className={styles.closeButton}
          type="button"
          onClick={() => toggleMenu(false)}
        >
          <img src={icon("close")} alt="Close" />
        </button>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <p
        className={`${styles.activeFolderHeader} ${
          activeFolder !== null ? styles.folderSelected : ""
        }`}
        onClick={showFolders}
      >
        {activeFolder === null ? (
          ""
        ) : (
          <i className="material-symbols-outlined">arrow_left</i>
        )}
        {activeFolder === null
          ? "All Folders"
          : bookmarkFolders[activeFolder].name}
      </p>
      <ul className={styles.list}>
        {activeFolder === null ? (
          <FoldersList
            folderList={bookmarkFolders}
            setActiveFolder={setActiveFolder}
          />
        ) : (
          <BookmarksList
            bookmarks={bookmarkFolders[activeFolder].bookmarks}
            toggleMenu={toggleMenu}
          />
        )}
      </ul>
    </div>
  );
};

const FolderItem = ({ folder }: { folder: Folder }) => (
  <>
    <div className={styles.itemIconBox}>
      <i className={`material-symbols-outlined ${styles.folderIcon}`}>folder</i>
      <p className={styles.folderCount}>{folder.bookmarks.length}</p>
    </div>
    <p className={styles.folderName}>{folder.name}</p>
  </>
);

const FoldersList = ({
  folderList,
  setActiveFolder,
}: {
  folderList: Folder[];
  setActiveFolder: (index: number) => void;
}) => (
  <>
    {folderList.map((folder, index) => (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <li
        className={styles.folderItem}
        key={folder.id}
        onClick={() => setActiveFolder(index)}
      >
        <FolderItem folder={folder} />
      </li>
    ))}
  </>
);

const BookmarkItem = ({ name }: { name: string }) => (
  <>
    <div className={`${styles.itemIconBox} ${styles.bookmarkIconBox}`}>
      <i className={`material-symbols-outlined ${styles.bookmarkIcon}`}>star</i>
    </div>
    <p className={styles.folderName}>{name}</p>
  </>
);

const BookmarksList = ({
  bookmarks,
  toggleMenu,
}: {
  bookmarks: Bookmark[];
  toggleMenu: (open: boolean) => void;
}) => {
  const [bookmarkNames, setBookmarkNames] = useState<string[]>([]);

  // We don't have an easy way of getting the name of a bookmark, so instead we
  // dynamically fetch the bookmarked resource or service to grab its name.
  useEffect(() => {
    Promise.all(
      bookmarks.map((bookmark) => {
        if (bookmark.resource_id) {
          return fetchOrganization(`${bookmark.resource_id}`).then(
            (org) => org.name
          );
        }
        return fetchService(`${bookmark.service_id}`).then(
          (service) => service.name
        );
      })
    ).then((names) => setBookmarkNames(names));
  }, [bookmarks]);

  if (bookmarkNames.length === 0 && bookmarks.length !== 0) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {bookmarks.map((bookmark, i) => {
        const url =
          bookmark.resource_id === null
            ? `/services/${bookmark.service_id}`
            : `/organizations/${bookmark.resource_id}`;
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        return (
          <li key={bookmark.id}>
            <Link
              className={styles.bookmarkItem}
              to={url}
              onClick={() => toggleMenu(false)}
            >
              <BookmarkItem name={bookmarkNames[i]} />
            </Link>
          </li>
        );
      })}
    </>
  );
};
