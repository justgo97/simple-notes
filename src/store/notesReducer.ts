import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INote, NotesList } from "../types";
import { dbFuncs } from "../util/db";

const initialState: NotesList = {};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    createNote: (state, action: PayloadAction<INote>) => {
      const newNote = action.payload;
      newNote.date_created = newNote.date_modified = Date.now();
      state[newNote.id] = { ...newNote };
      dbFuncs.createNote(newNote);
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      const noteID = action.payload;
      delete state[noteID];
    },
    changeNote: (state, action: PayloadAction<INote>) => {
      const { id, title, content } = action.payload;

      if (title !== undefined) {
        state[id].title = title;
      }

      if (content !== undefined) {
        state[id].content = content;
      }

      state[id].date_modified = Date.now();
    },
    notesLoaded: (_state, action: PayloadAction<NotesList>) => {
      return action.payload;
    },
  },
});

export const notesActions = notesSlice.actions;

export default notesSlice.reducer;
