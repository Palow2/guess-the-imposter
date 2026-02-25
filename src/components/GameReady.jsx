import { useState } from 'react'
import { saveGame } from '../storage'
import './GameReady.css'

function GameReady({ teams, cards, onStartGame, onBack, t }) {
    const [saveName, setSaveName] = useState('')
    const [saved, setSaved] = useState(false)
    const [showSaveInput, setShowSaveInput] = useState(false)

    const handleSave = () => {
        const name = saveName.trim() || teams.map(t => t.name).join(' vs ')
        saveGame({
            name,
            teams,
            cards
        })
        setSaved(true)
        setShowSaveInput(false)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="game-ready">
            <div className="ready-container animate-slideIn">
                <div className="ready-header">
                    <span className="ready-icon">✅</span>
                    <h2>{t.setupComplete}</h2>
                    <p>{t.setupCompleteDesc}</p>
                </div>

                <div className="setup-summary">
                    <div className="summary-section">
                        <h3>👥 {t.teamsLabel}</h3>
                        <div className="teams-list">
                            {teams.map((team, i) => (
                                <div key={i} className="team-item" style={{
                                    borderColor: `hsl(${(i * 60) + 270}, 80%, 50%)`
                                }}>
                                    <span className="team-name">{team.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="summary-section">
                        <h3>🎴 {t.totalCards}</h3>
                        <div className="cards-summary">
                            <span className="cards-count">{cards.length}</span>
                            <span className="cards-label">{t.cardsReady}</span>
                        </div>
                    </div>
                </div>

                <div className="action-section">
                    {!showSaveInput ? (
                        <button
                            className="btn btn-secondary save-btn"
                            onClick={() => setShowSaveInput(true)}
                            disabled={saved}
                        >
                            {saved ? (
                                <><span>✓</span> {t.gameSaved}</>
                            ) : (
                                <><span>💾</span> {t.saveSetup}</>
                            )}
                        </button>
                    ) : (
                        <div className="save-input-group">
                            <input
                                type="text"
                                className="input save-name-input"
                                placeholder={t.saveNamePlaceholder}
                                value={saveName}
                                onChange={(e) => setSaveName(e.target.value)}
                                maxLength={30}
                            />
                            <button className="btn btn-success confirm-save-btn" onClick={handleSave}>
                                {t.confirmSave}
                            </button>
                            <button className="cancel-btn" onClick={() => setShowSaveInput(false)}>
                                ×
                            </button>
                        </div>
                    )}

                    <button
                        className="btn btn-primary start-btn"
                        onClick={onStartGame}
                    >
                        <span>{t.startPlaying}</span>
                        <span className="btn-icon">🎮</span>
                    </button>

                    <button className="back-btn" onClick={onBack}>
                        ← {t.backToStart}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GameReady
