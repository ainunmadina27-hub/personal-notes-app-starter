import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

function Navigation({ onSearch, keyword }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage(); 

    const handleSearch = (e) => {
        const newKeyword = e.target.value;
        onSearch?.(newKeyword);
    };

    const handleLogout = () => {
      if (window.confirm('Yakin ingin logout')) {
        logout();
      }
    };

    if (!user) {
      return null;
    }

    return (
        <nav className="navigation">
            <div className="navigation__header">
                <NavLink to="/" className="navigation__logo">
                  <h1>{t('notes')}</h1>
                </NavLink>
                <NavLink to="/archives" className="navigation__archives">
                  {t('archived')}
                </NavLink>
            </div>
            <input
              className="navigation__search"
              type="text"
              placeholder={t('search')}
              value={keyword || ''}
              onChange={handleSearch}
            />
            <NavLink className="navigation__new-note" to="/notes/new">
              + {t('addNote')}
            </NavLink>
            <div className="navigation__tabs">
              <div className="user-info">
                <span>{user?.name}</span>
              </div>
              <button
              onClick={handleLogout}
              className="navigation__logout"
              >
                {t('logout')}
              </button>
            </div>
        </nav>
    );
}

export default Navigation;