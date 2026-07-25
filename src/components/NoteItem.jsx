import { Link } from "react-router-dom";
import parser from 'html-react-parser';
import { getRelativeTime } from '../App.jsx';

function NoteItem({ id, title, body, createdAt, onDelete, onArchive, onUnarchive }) {
    const handleDelete = () => {
        if (window.confirm('Yakin ingin menghapus catatan ini?')) {
            onDelete(id);
        }
    };

    const handleArchive = () => {
        onArchive(id);
    };

    const handleUnarchive = () => {
        onUnarchive(id);
    };

    return (
        <article className="notes-list__item">
            <div className="notes-list__item__thumbnail">
                <h2>{title}</h2>
                <p>{getRelativeTime(createdAt)}</p>
            </div>
            <div className="notes-list__item__content">
                {parser(body)}
            </div>
            <div className="notes-list__item__action">
                <Link className="notes-list__item__button" to={`/notes/${id}`}>
                    Baca
                </Link>
                <button className="notes-list__item__button notes-list__item__button--archive" onClick={handleArchive}>
                    {onUnarchive ? 'Batal Arsip' : 'Arsip'}
                </button>
                <button className="notes-list__item__button notes-list__item__button--delete" onClick={handleDelete}>
                    Hapus
                </button>
            </div>
        </article>
    );
}

export default NoteItem;