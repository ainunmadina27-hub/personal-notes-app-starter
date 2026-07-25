import { useParams, Link } from "react-router-dom";
import parser from 'html-react-parser';
import { getRelativeTime } from '../App.jsx';
import NotFoundPage from "./NotFoundPage.jsx";

function DetailPage({ notes, onDelete, onArchive, onUnarchive }) {
    const { id } = useParams();
    const note = notes.find(note => note.id === id);

    if (!note) {
        return <NotFoundPage />;
    }

    const toggleArchive = () => {
        if (note.archived) {
            onUnarchive(note.id);
        } else {
            onArchive(note.id);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Yakin ingin menghapus catatan ini?')) {
            onDelete(note.id);
        }
    };

    return (
        <section className="detail-page">
            <h2>{note.title}</h2>
            <p className="detail-page__createdAt">{getRelativeTime(note.createdAt)}</p>
            <div className="detail-page__body">
                {parser(note.body)}
            </div>
            <div className="detail-page__action">
                <button
                  className="detail-page__action__archive"
                  onClick={toggleArchive}
                >
                    {note.archived ? 'Pindahkan' : 'Arsipkan'}
                </button>
                <button 
                  className="detail-page__action__delete"
                  onClick={handleDelete}
                >
                    Hapus
                </button>
                <Link to="/">Kembali</Link>
            </div>
        </section>
    );
}

export default DetailPage;