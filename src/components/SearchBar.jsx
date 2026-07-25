import { useSearchParams  } from "react-router-dom";

function SearchBar({ onSearch }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSearch =  (e) => {
        const keyword =  e.target.valuee;
        if (keyword) {
            searchParams.set('keyword', keyword);
        } else {
            searchParams.delete('keyword');
        }
        setSearchParams(searchParams);
        onSearch(keyword);
    };

    return (
        <div className="search-bar">
            <input
            className="search-bar__input"
            type="text"
            placeholder="Cari catatan berdasarkan judul..."
            value={searchParams.get('keyword') || ''}
            onChange={handleSearch}
            />
        </div>
    );
}

export default SearchBar;