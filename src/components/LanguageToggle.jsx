import './LanguageToggle.css'

function LanguageToggle({ language, setLanguage, t }) {
    return (
        <div className="language-toggle">
            <span className="lang-label">{t.language}:</span>
            <div className="lang-buttons">
                <button
                    className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                >
                    EN
                </button>
                <button
                    className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
                    onClick={() => setLanguage('ar')}
                >
                    عربي
                </button>
            </div>
        </div>
    )
}

export default LanguageToggle
