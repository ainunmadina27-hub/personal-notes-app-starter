import Navigation from "../components/Navigation";
import NoteList from "../components/NoteList";
import { useLanguage } from "../contexts/LanguageContext";

function HomePage({ notes, onDelete, onArchive, searchParams, setSearchParams }) {
    const { t } = useLanguage();
    const keyword = searchParams.get('keyword') || '';
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(keyword.toLowerCase())
    );

    const handleSearch = (newKeyword) => {
        if (newKeyword) {
            setSearchParams({ keyword: newKeyword });
        } else {
            setSearchParams({});
        }
    };

    if (!notes.length) {
        return (
            <>
              <Navigation onSearch={handleSearch} keyword={keyword} />
              <section className="notes-list">
                <h3>{t('noNotes')}</h3>
              </section>
            </>
        );
    }

    return (
        <>
          <Navigation onSearch={handleSearch} keyword={keyword} />
          <NoteList notes={filteredNotes} onDelete={onDelete} onArchive={onArchive} />
        </>
    );
}

export default HomePage;