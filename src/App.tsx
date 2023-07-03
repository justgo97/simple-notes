import "./styles/App.scss";

// Import all of Bootstrap's JS
import "bootstrap";

//
import NoteEditor from "./components/NoteEditor";
import { useEffect, useRef, useState } from "react";
import { dbFuncs } from "./util/db";
import LoadingSpinner from "./components/LoadingSpinner";
import { INote, NotesList } from "./types";
import { getAllNotes, useAppDispatch, useAppSelector } from "./store";
import { notesActions } from "./store/notesReducer";

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
      <AppSide
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

interface AppSide {
  currentNoteID: string;
  handleCurrentNote: (noteID: string) => void;
}

const AppSide = ({ currentNoteID, handleCurrentNote }: AppSide) => {
  const dispatch = useAppDispatch();
  const notesList = useAppSelector(getAllNotes());

  const onClickItem = (noteID: string) => {
    handleCurrentNote(noteID);
  };

  const onClickCreate = () => {
    const notesCount = localStorage.getItem("notesCount") || "2";

    const newNote: INote = {
      id: Date.now().toString(),
      title: `New Note (${notesCount})`,
      content: "New Note",
    };

    dispatch(notesActions.createNote(newNote));
    handleCurrentNote(newNote.id);
  };

  const onClickDelete = (noteID: string) => {
    if (currentNoteID === noteID) {
      handleCurrentNote("");
    }

    dispatch(notesActions.deleteNote(noteID));
  };

  return (
    <div className="app-side">
      <h5 className="app-side-title">Notes list:</h5>
      {Object.keys(notesList).map((noteID) => (
        <div
          className={`app-side-item border rounded p-1 ${
            noteID === currentNoteID ? "app-side-item-selected" : ""
          }`}
          key={noteID}
        >
          <div
            onClick={() => onClickItem(noteID)}
            className="app-side-item-text"
          >
            {notesList[noteID].title}
          </div>
          <div
            onClick={() => onClickDelete(noteID)}
            className="app-side-item-delete"
          >
            🗑️
          </div>
        </div>
      ))}
      <div onClick={onClickCreate} className="app-side-create pt-2">
        + Create new note
      </div>
    </div>
  );
};

export default App;
