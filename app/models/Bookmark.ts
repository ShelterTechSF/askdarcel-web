import { get, post } from "utils/DataService";

export interface Bookmark {
  id: number;
  order: number;
  folder_id: number | null;
  service_id: number | null;
  resource_id: number | null;
  user_id: number;
  name: string | null;
}

type PostBookmark = Omit<Bookmark, "id">;

export interface Folder {
  id: number;
  name: string;
  order: number;
  user_id: number;
}

type PostFolder = Omit<Folder, "id">;

export interface Folders {
  folders: Folder[];
}

export interface Bookmarks {
  bookmarks: Bookmark[];
}

export function getBookmarksForUser(
  userId: number,
  authToken: string
): Promise<Bookmarks> {
  return get(`/api/v2/bookmarks?user_id=${userId}`, {
    Authorization: `bearer ${authToken}`,
  }).then((resp: Bookmarks) => {
    resp.bookmarks.sort((a, b) => a.order - b.order);
    return resp;
  });
}

// TODO: API currently doesn't return the bookmark on successful post, so we
// mark the return type as unknown.
export function createBookmark(
  bookmark: PostBookmark,
  authToken: string
): Promise<unknown> {
  return post(`/api/v2/bookmarks`, bookmark, {
    Authorization: `bearer ${authToken}`,
  });
}

export function getFoldersForUser(
  userId: number,
  authToken: string
): Promise<Folders> {
  return get(`/api/v2/folders?user_id=${userId}`, {
    Authorization: `bearer ${authToken}`,
  }).then((resp: Folders) => {
    resp.folders.sort((a, b) => a.order - b.order);
    return resp;
  });
}

export function createFolder(
  folder: PostFolder,
  authToken: string
): Promise<Folder> {
  return post(`/api/v2/folders`, folder, {
    Authorization: `bearer ${authToken}`,
  }).then((resp) => resp.json());
}
