import { useState, useEffect } from 'react'
import { getSavedGames } from '../storage'
import './StartScreen.css'

function StartScreen({ onNewGame, onLoadGame, t }) {
    const [hasSavedGames, setHasSavedGames] = useState(false)

    useEffect(() => {
        setHasSavedGames(getSavedGames().length > 0)
    }, [])

    return (
        <div className="start-screen">
            <div className="start-content animate-slideIn">
                <div className="logo-container animate-float">
                    <span className="logo-icon">🎭</span>
                </div>

                <h1 className="game-title">
                    <span className="title-word">{t.gameTitle[0]}</span>
                    <span className="title-word accent">{t.gameTitle[1]}</span>
                    <span className="title-word">{t.gameTitle[2]}</span>
                </h1>

                <p className="game-subtitle">
                    {t.gameSubtitle}
                </p>

                <div className="features">
                    <div className="feature">
                        <span className="feature-icon">👥</span>
                        <span>{t.features.teams}</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">💡</span>
                        <span>{t.features.hints}</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">🏆</span>
                        <span>{t.features.scoring}</span>
                    </div>
                </div>

                <div className="start-buttons">
                    <button className="btn btn-primary start-btn animate-glow" onClick={onNewGame}>
                        <span className="btn-text">{t.newGame}</span>
                        <span className="btn-icon">🚀</span>
                    </button>

                    {hasSavedGames && (
                        <button className="btn btn-secondary load-game-btn" onClick={onLoadGame}>
                            <span className="btn-text">{t.loadSavedGame}</span>
                            <span className="btn-icon">📂</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="background-effects">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>
        </div>
    )
}

export default StartScreen
