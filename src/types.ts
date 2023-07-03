export interface INote {
  id: string;
  title?: string;
  content?: string;
  date_created?: number;
  date_modified?: number;
}

export interface NotesList {
  [key: string]: INote;
}
