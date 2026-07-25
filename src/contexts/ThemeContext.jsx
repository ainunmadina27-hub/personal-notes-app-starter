import { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

const initialState = {
    theme: 'light',
    isDark: false,
};

const themeReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_THEME': return {
            ...state,
            theme: state.theme === 'light' ? 'dark' : 'light',
            isDark: !state.isDark,
        };
        default: throw new Error();
    }
};

function ThemeProvider({ children }) {
    const [state, dispatch] = useReducer(themeReducer, initialState);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            dispatch({ type: 'TOGGLE_THEME' });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', state.theme);
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    const toggleTheme = () => {
        dispatch({ type: 'TOGGLE_THEME' });
    };

    const value = {
        ...state,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

export { ThemeContext, ThemeProvider, useTheme };