import { createContext, useContext, useEffect, useReducer } from 'react';
import {
    getAccessToken, 
    putAccessToken,
    deleteAccessToken,
    getUserLogged,
    login as apiLogin,
    register as apiRegister
} from '../utils/network-data';
    
const AuthContext = createContext();

const initialState = {
    user: null,
    isLoading: true,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_USER_SUCCESS':
        case 'LOGIN_SUCCESS': return {
            ...state, 
            user: action.payload,
            isLoading: false,
        };
        case 'FETCH_USER_ERROR': return {
            ...state,
            user: null,
            isLoading: false,
        };
        case 'LOGOUT': return {
            ...state,
            user: null,
        };
        default: throw new Error(`Unknown action type: ${action.type}`);
    }
};

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    
    const refreshUser = async () => {
        try {
            const accessToken = getAccessToken();
            if (!accessToken) {
                dispatch({ type: 'FETCH_USER_ERROR' });
                return;
            }

            const response = await getUserLogged();
            if (response.error === false) {
                dispatch({ type: 'FETCH_USER_SUCCESS', payload: response.data });
            } else {
                dispatch({ type: 'FETCH_USER_ERROR' });
            }
        } catch (error) {
            console.error('Refresh user error:', error);
            dispatch({ type: 'FETCH_USER_ERROR' });
        }
        
    };

    const login = async (email, password) => {
        try {
            const response = await apiLogin({ email, password });
            if (response.error === true) {
                alert(response.message || 'Login gagal');
                return { error: true };
            }
            putAccessToken(response.data.accessToken);
            await refreshUser();
            return { error: false };
        } catch (error) {
            alert('Terjadi kesalahan pada server');
            return { error: true };
        }  
    };

    const register = async ({ name, email, password }) => {
        try {
            const response = await apiRegister({ name, email, password });
            if (response.error === true) {
                alert(response.message || 'Register gagal');
                return { error: true };
            }
            return { error: false };
        } catch (error) {
            alert('Terjadi kesalahan pada server');
            return { error: true };
        }
    };

    const logout = () => {
        deleteAccessToken();
        dispatch({ type: 'LOGOUT' });
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const value = {
        ...state,
        login, 
        register, 
        logout, 
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    } 
    return context;
}

export { AuthContext, AuthProvider, useAuth };