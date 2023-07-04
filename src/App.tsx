import "./styles/App.scss";

// Import all of Bootstrap's JS
import "bootstrap";

//
import NoteEditor from "./components/NoteEditor";
import { useEffect, useRef, useState } from "react";
import { dbFuncs } from "./util/db";

import { INote, NotesList } from "./types";
import { useAppDispatch } from "./store";
import { notesActions } from "./store/notesReducer";

import LoadingSpinner from "./components/LoadingSpinner";
import SidePanel from "./components/SidePanel";

function App() {
  const dispatch = useAppDispatch();
  const [currentNoteID, setCurrentNoteID] = useState("");
  const [loadingState, setLoadingState] = useState(true);
  const refFetching = useRef(false);

  useEffect(() => {
    if (refFetching.current) return;

    refFetching.current = true;

    //
    async function fetchData() {
      const userNotes = await dbFuncs.loadNotes();

      if (userNotes.length < 1) {
        const defaultNote: INote = {
          id: Date.now().toString(),
          title: "New Note",
          content: "New Note",
        };

        dispatch(notesActions.createNote(defaultNote));
        setCurrentNoteID(defaultNote.id);
      } else {
        const initialNotes: NotesList = {};
        userNotes.forEach((note) => (initialNotes[note.id] = note));

        dispatch(notesActions.notesLoaded(initialNotes));
        setCurrentNoteID(userNotes[0].id);
      }

      setLoadingState(false);
    }

    fetchData();
  }, [dispatch]);

  const handleCurrentNote = (noteID: string) => {
    setCurrentNoteID(noteID);
  };

  if (loadingState) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <SidePanel
        currentNoteID={currentNoteID}
        handleCurrentNote={handleCurrentNote}
      />
      {currentNoteID && (
        <div className="app-main">
          <NoteEditor noteID={currentNoteID} />
        </div>
      )}
    </div>
  );
}

export default App;
