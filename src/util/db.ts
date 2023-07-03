import Dexie from "dexie";
import { INote } from "../types";

class simpleNotesDatabase extends Dexie {
  notes!: Dexie.Table<INote, string>;

  constructor() {
    super("simpleNotesDatabase");

    this.version(2).stores({
      notes: "id, title, content, date_created, date_modified",
    });
  }
}

const db = new simpleNotesDatabase();

export const dbFuncs = {
  createNote: (data: INote) => {
    const oldCount = localStorage.getItem("notesCount");

    const newCount = oldCount ? (Number(oldCount) + 1).toString() : "2";

    localStorage.setItem("notesCount", newCount);

    return db.notes.add(data);
  },
  saveNote: (data: INote) => {
    const key = data.id;

    return db.notes.update(key, data);
  },
  loadNotes: () => {
    return db.notes.toArray();
  },
  deleteNote: (id: string) => {
    return db.notes.delete(id);
  },
};
