import Navigation from "../components/Navigation";
import NoteList from "../components/NoteList";

function ArchivePage({ notes, onDelete, onUnarchive }) {
    if (!notes.length) {
        return (
            <>
              <Navigation />
              <section className="notes-list">
                <h3>Arsip kosong</h3>
              </section>
            </>
        );
    }

    return (
        <>
          <Navigation />
          <NoteList notes={notes} onDelete={onDelete} onUnarchive={onUnarchive} />
        </>
    );
}

export default ArchivePage;