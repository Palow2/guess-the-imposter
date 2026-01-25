import { useState, useEffect } from 'react'
import { getSavedGames, deleteGame, formatDate } from '../storage'
import './SavedGames.css'

function SavedGames({ onLoad, onClose, t }) {
    const [savedGames, setSavedGames] = useState([])
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    useEffect(() => {
        setSavedGames(getSavedGames())
    }, [])

    const handleDelete = (gameId) => {
        if (deleteConfirm === gameId) {
            deleteGame(gameId)
            setSavedGames(getSavedGames())
            setDeleteConfirm(null)
        } else {
            setDeleteConfirm(gameId)
        }
    }

    const handleLoad = (game) => {
        onLoad(game)
    }

    return (
        <div className="saved-games-overlay" onClick={onClose}>
            <div className="saved-games-modal animate-slideIn" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t.savedGames}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    {savedGames.length === 0 ? (
                        <div className="no-games">
                            <span className="no-games-icon">📭</span>
                            <p>{t.noSavedGames}</p>
                        </div>
                    ) : (
                        <div className="games-list">
                            {savedGames.map(game => (
                                <div key={game.id} className="saved-game-item">
                                    <div className="game-info">
                                        <h3 className="game-name">{game.name}</h3>
                                        <div className="game-meta">
                                            <span className="meta-item">
                                                <span className="meta-icon">👥</span>
                                                {game.teams.length} {t.teamsLabel}
                                            </span>
                                            <span className="meta-item">
                                                <span className="meta-icon">🎴</span>
                                                {game.cards.length} {t.cardsLabel}
                                            </span>
                                            <span className="meta-item">
                                                <span className="meta-icon">🕐</span>
                                                {formatDate(game.savedAt)}
                                            </span>
                                        </div>
                                        <div className="team-names">
                                            {game.teams.map((team, i) => (
                                                <span key={i} className="team-tag">{team.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="game-actions">
                                        <button
                                            className="btn btn-primary load-btn"
                                            onClick={() => handleLoad(game)}
                                        >
                                            {t.loadGame}
                                        </button>
                                        <button
                                            className={`delete-btn ${deleteConfirm === game.id ? 'confirm' : ''}`}
                                            onClick={() => handleDelete(game.id)}
                                        >
                                            {deleteConfirm === game.id ? t.confirmDelete : '🗑️'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SavedGames
