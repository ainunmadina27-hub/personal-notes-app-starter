import React, { useState, useEffect } from 'react';
import { 
  Routes,
  Route,
  useSearchParams,
  Navigate,
  useNavigate
} from 'react-router-dom';
import {
  getActiveNotes,
  getArchivedNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  getAccessToken
} from './utils/network-data';
import HomePage from './pages/HomePage';
import ArchivePage from './pages/ArchivePage';
import AddNotePage from './pages/AddNotePage';
import DetailPage from './pages/DetailPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navigation from './components/Navigation';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import './styles/style.css';

export const getRelativeTime = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInSeconds = Math.floor((now - created) / 1000);

  if (diffInSeconds < 60) return 'Baru dibuat';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
};

function ProtectedRoute({ children}) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user && getAccessToken()) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [activeNotes, setActiveNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const { user } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { toggleLanguage, language, t } = useLanguage();

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      const activeResponse = await getActiveNotes();
      const archivedResponse = await getArchivedNotes();

      if (!activeResponse.error && !archivedResponse.error) {
        setActiveNotes(activeResponse.data);
        setArchivedNotes(archivedResponse.data);
        setNotes([...activeResponse.data, ...archivedResponse.data]);
      }
    };

    fetchNotes();
  }, [user]);

  const onDeleteHandler = async (id) => {
    await deleteNote(id);
    const activeResponse = await getActiveNotes();
    const archivedResponse = await getArchivedNotes();
    if (!activeResponse.error && !archivedResponse.error) {
      setActiveNotes(activeResponse.data);
      setArchivedNotes(archivedResponse.data);
      setNotes([...activeResponse.data, ...archivedResponse.data]);
    }
  };

  const onAddNoteHandler = async ({ title, body }) => {
    await addNote({ title, body });
    const activeResponse = await getActiveNotes();
    if (!activeResponse.error) {
      setActiveNotes(activeResponse.data.filter(note => note.userId === user.id));
    }
  };

  const onArchiveHandler = async (id) => {
    await archiveNote(id);
    const activeResponse = await getActiveNotes();
    const archivedResponse = await getArchivedNotes();
    if (!activeResponse.error && !archivedResponse.error) {
      setActiveNotes(activeResponse.data);
      setArchivedNotes(archivedResponse.data);
    }
  };

  const onUnarchiveHandler = async (id) => {
    await unarchiveNote(id);
    const activeResponse = await getActiveNotes();
    const archivedResponse = await getArchivedNotes();
    if (!activeResponse.error && !archivedResponse.error) {
      setActiveNotes(activeResponse.data.notes);
      setArchivedNotes(archivedResponse.data);
    }
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{t('notes')}</h1>
        {user && (
          <div className="header-actions">
            <span className="user-name">Hi, {user.name}!</span>
            <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={t('theme')}
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
            <button
            onClick={toggleLanguage}
            className="lang-toggle"
            title={t('language')}
            >
              {language.toUpperCase()}
            </button>
          </div>
        )}
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage
                notes={activeNotes}
                onDelete={onDeleteHandler}
                onArchive={onArchiveHandler}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
              </ProtectedRoute>
            }
          />
          <Route
            path="/archives"
            element={
              <ProtectedRoute>
                <ArchivePage
                notes={archivedNotes}
                onDelete={onDeleteHandler}
                onUnarchive={onUnarchiveHandler}
              />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/notes/new" 
            element ={
            <ProtectedRoute>
              <AddNotePage addNote={onAddNoteHandler} />
            </ProtectedRoute>
             } 
          />
          <Route
            path="/notes/:id"
            element={
              <ProtectedRoute>
                <DetailPage
                notes={notes}
                onDelete={onDeleteHandler}
                onArchive={onArchiveHandler}
                onUnarchive={onUnarchiveHandler}
              />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {user && (
        <Navigation
        onSearch={(keyword) => {
          setSearchParams({ keyword });
        }}
        keyword={searchParams.get('keyword') || ''}
         />
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
