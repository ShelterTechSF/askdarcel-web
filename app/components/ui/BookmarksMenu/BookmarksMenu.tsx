import React, { useState } from "react";
import { slide as Menu, State } from "react-burger-menu";
import { Link } from "react-router-dom";
import { icon } from "assets";
import styles from "./BookmarksMenu.module.scss";

// TODO: These will be passed in to this component and fetched from the API
// when the API is ready
const bookmarkFolderData: any[] = [
  // {
  //   id: 1,
  //   name: "Food Kitchen List",
  //   updatedAt: new Date().toISOString(),
  //   bookmarks: [
  //     { id: 1, name: "TL Food Kitchen", url: "search?query=food" },
  //     { id: 2, name: "Mission Food Kitchen", url: "search?query=food" },
  //   ],
  // },
  // {
  //   id: 2,
  //   name: "Dave's Service List",
  //   updatedAt: "2024-05-16T19:28:48.561Z",
  //   bookmarks: [
  //     { id: 11, name: "Dave's Favorite", url: "search?query=shelter" },
  //     { id: 12, name: "Dave's TL Service", url: "search?query=food" },
  //   ],
  // },
  // {
  //   id: 3,
  //   name: "24 Hour Shelters",
  //   updatedAt: "2024-05-15T21:42:48.561Z",
  //   bookmarks: [
  //     { id: 111, name: "24hr SOMA shelter", url: "search?query=shelter" },
  //     { id: 112, name: "24hr shelter", url: "search?query=food" },
  //   ],
  // },
];

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
    <BookmarksInnerMenu toggleMenu={toggleBookmarksMenu} />
  </Menu>
);

const BookmarksInnerMenu = ({
  toggleMenu,
}: {
  toggleMenu: (open: boolean) => void;
}) => {
  const [activeFolder, setActiveFolder] = useState<number | null>(null);
  const [bookmarkFolders] = useState(bookmarkFolderData);
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
          <i className="material-icons">arrow_left</i>
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
          <BookmarksList bookmarks={bookmarkFolders[activeFolder].bookmarks} />
        )}
      </ul>
    </div>
  );
};

// TODO fix TS defs once we have data from API
const FolderItem = ({ folder }: { folder: any }) => (
  <>
    <div className={styles.itemIconBox}>
      <i className={`material-icons ${styles.folderIcon}`}>folder</i>
      <p className={styles.folderCount}>{folder.bookmarks.length}</p>
    </div>
    <p className={styles.folderName}>{folder.name}</p>
  </>
);

// TODO fix TS defs once we have data from API
const FoldersList = ({
  folderList,
  setActiveFolder,
}: {
  folderList: any[];
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

const BookmarkItem = ({ bookmark }: { bookmark: any }) => (
  <>
    <div className={`${styles.itemIconBox} ${styles.bookmarkIconBox}`}>
      <i className={`material-icons ${styles.bookmarkIcon}`}>star</i>
    </div>
    <p className={styles.folderName}>{bookmark.name}</p>
  </>
);

// TODO fix TS defs once we have data from API
const BookmarksList = ({ bookmarks }: { bookmarks: any[] }) => (
  <>
    {bookmarks.map((bookmark) => (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <li key={bookmark.id}>
        <Link className={styles.bookmarkItem} to={bookmark.url}>
          <BookmarkItem bookmark={bookmark} />
        </Link>
      </li>
    ))}
  </>
);
