import { createContext, useContext, useReducer, useEffect } from 'react';

const LanguageContext = createContext();

const initialState = {
    language: 'id',
};

const languageReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_LANGUAGE': return {
            ...state,
            language: state.language === 'id' ? 'en' : 'id',
        };
        default: throw new Error();
    }
};

const translations = {
    id: {
        login: 'Masuk',
        register: 'Daftar',
        logout: 'Keluar',
        addNote: 'Tambah Catatan',
        notes: 'Catatan',
        archived: 'Terarsip',
        search: 'Cari catatan...',
        title: 'Judul',
        createdAt: 'Dibuat pada',
        noNotes: 'Tidak ada catatan',
        loading: 'Memuat...',
        delete: 'Hapus',
        archive: 'Arsip',
        unarchive: 'Batal Arsip',
        name: 'Nama',
        email:  'Email',
        password: 'Password',
        confirmPassword: 'Konfirmasi Password',
        theme: 'Tema',
        language: 'Bahasa',
    },
    en: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        addNote: 'Add Note',
        notes: 'Notes',
        archived: 'Archived',
        search: 'Search notes...',
        title: 'Title',
        createdAt: 'Created at',
        noNotes: 'No Notes',
        loading: 'Loading...',
        delete: 'Delete',
        archive: 'Archive',
        unarchive: 'Unarchive',
        name: 'Name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        theme: 'Theme',
        language: 'Language',
    },
};

function LanguageProvider({ children }) {
    const [state, dispatch] = useReducer(languageReducer, initialState);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'id';
        if (savedLanguage === 'en') {
            dispatch({ type: 'TOGGLE_LANGUAGE' });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('language', state.language);
    }, [state.language]);

    const toggleLanguage = () => {
        dispatch({ type: 'TOGGLE_LANGUAGE' });
    };

    const t = (key) => translations[state.language][key] || key;

    const value = {
        ...state,
        toggleLanguage,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}

export { LanguageContext, LanguageProvider, useLanguage };