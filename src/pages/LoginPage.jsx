import { useEffect  } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

function LoginPage() {
    const [email, onEmailChange] = useInput('');
    const [password, onPasswordChange] = useInput('');
    const { login, user, refreshUser } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser();
    }, []);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const onLoginHandler = async (event) => {
        event.preventDefault();

        const loginResult = await login(email, password);
        if (!loginResult.error) {
            navigate('/');
        }
    };

    return (
        <section className="login-page">
            <h2>{t('login')}</h2>
            <form onSubmit={onLoginHandler} className="login-form">
                <div className="input-wrapper">
                    <label htmlFor="email">{t('email')}</label>
                    <input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={onEmailChange}
                    required
                    />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="password">{t('password')}</label>
                    <input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChange}
                    required
                    />
                </div>
                <button type="submit" className="login-button">
                    {t('login')}
                </button>
            </form>
            <p>
                {t('register')}{' '}
                <Link to="/register">{t('register')}</Link>
            </p>
        </section>
    );
}

export default LoginPage;