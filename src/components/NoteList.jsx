import NoteItem from "./NoteItem";

function NoteList({ notes, onDelete, onArchive, onUnarchive }) {
    if (!notes.length) {
        return (
            <section className="notes-list">
                <h3>Tidak ada catatan</h3>
            </section>
        );
    }

    return (
        <section className="notes-list">
            {notes.map((note) => (
                <NoteItem
                key={note.id}
                id={note.id}
                title={note.title}
                body={note.body}
                createdAt={note.createdAt}
                onDelete={onDelete}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
                />
            ))}
        </section>
    );
}

export  default NoteList;