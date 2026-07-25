import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

function RegisterPage() {
    const [name,  onNameChange] = useInput('');
    const [email, onEmailChange] = useInput('');
    const [password, onPasswordChange] = useInput('');
    const [confirmPassword, onConfirmPasswordChange] = useInput('');
    const { register, user, refreshUser }= useAuth();
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

    const onRegisterHandler = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert(`${t('password')} tidak cocok`);
            return;
        }

        const registerResult = await register({ name, email, password });
        if (!registerResult.error) {
            navigate('/login');
        }
    };

    return (
        <section className="register-page">
            <h2>{t('register')}</h2>
            <form onSubmit={onRegisterHandler} className="register-form">
                <div className="input-wrapper">
                    <label htmlFor="name">{t('name')}</label>
                    <input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={onNameChange}
                    required 
                    />
                </div>
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
                <div className="input-wrapper">
                    <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                    <input 
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={onConfirmPasswordChange}
                    required
                    />
                </div>
                <button type="submit" className="register-button">
                    {t('register')}
                </button>
            </form>
            <p>
                Sudah punya akun?{' '}
                <Link to="/login">{t('login')}</Link>
            </p>
        </section>
    );
}

export default RegisterPage;