import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useLanguage } from '../contexts/LanguageContext';

function AddNotePage({ addNote }) {
    const [loading, setLoading] = useState(false);
    const [title, onTitleChange] = useInput('');
    const [body, onBodyChange] = useInput('');
    const { t } = useLanguage();
    const navigate = useNavigate();

    const onSubmitEventHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        await addNote({
            title,
            body,
        });
        navigate('/');
        setLoading(false);
    };

    return (
        <section className="add-new-page">
            <h2>{t('addNote')}</h2>
            <form className="add-new-page__input" onSubmit={onSubmitEventHandler}>
                <div className="add-new-page__input__title">
                    <label htmlFor="title">{t('title')}</label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={onTitleChange}
                      placeholder={t('title') + '...'}
                      required
                    />
                </div>
                <div className="add-new-page__input__body">
                    <label htmlFor="body">{t('body')}</label>
                    <textarea
                      id="body"
                      value={body}
                      onChange={onBodyChange}
                      placeholder={t('body') + '...'}
                      rows="10"
                      className="add-new-page__input__body__input"
                      required
                    />
                </div>
                <button 
                type="submit" 
                className="add-new-page__action"
                disabled={loading}
                >
                    {loading ? t('loading') : t('save')}
                </button>
            </form>
        </section>
    );
}

export default AddNotePage;
