import { getAllNotes, useAppDispatch, useAppSelector } from "../store";
import { notesActions } from "../store/notesReducer";
import { INote } from "../types";

interface SidePanelProps {
  currentNoteID: string;
  handleCurrentNote: (noteID: string) => void;
}

const SidePanel = ({ currentNoteID, handleCurrentNote }: SidePanelProps) => {
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

export default SidePanel;
