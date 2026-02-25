import { useState, useEffect, useCallback } from 'react'
import './GameBoard.css'

function GameBoard({ teams, currentTeam, currentTeamIndex, currentCard, cardNumber, totalCards, onNextTurn, t }) {
    const [gameState, setGameState] = useState('ready')
    const [revealedHints, setRevealedHints] = useState(0)
    const [timeLeft, setTimeLeft] = useState(45)
    const [earnedPoints, setEarnedPoints] = useState(0)
    const [ownerPanelRevealed, setOwnerPanelRevealed] = useState(false)

    const calculatePoints = useCallback((hintsUsed) => {
        if (hintsUsed === 1) return 3
        if (hintsUsed === 2) return 2
        return 1
    }, [])

    useEffect(() => {
        let timer
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [gameState, timeLeft])

    const startRound = () => {
        setGameState('playing')
        setRevealedHints(1)
        setTimeLeft(45)
        setEarnedPoints(0)
        setOwnerPanelRevealed(false)
    }

    const revealHint = () => {
        if (revealedHints < currentCard.hints.length) {
            setRevealedHints(prev => prev + 1)
        }
    }

    // Owner confirms the guess is correct
    const handleOwnerCorrect = () => {
        const points = calculatePoints(revealedHints)
        setEarnedPoints(points)
        setGameState('revealed')
    }

    // Owner confirms the guess is wrong or skip
    const handleOwnerWrong = () => {
        setEarnedPoints(0)
        setGameState('revealed')
    }

    const nextCard = () => {
        onNextTurn(earnedPoints)
        setGameState('ready')
        setRevealedHints(0)
        setTimeLeft(45)
        setEarnedPoints(0)
        setOwnerPanelRevealed(false)
    }

    const sortedTeams = [...teams].sort((a, b) => b.score - a.score)

    return (
        <div className="game-board">
            <div className="game-header">
                <div className="progress-info">
                    <span className="card-count">{t.card} {cardNumber} {t.of} {totalCards}</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(cardNumber / totalCards) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="game-content">
                <div className="scoreboard">
                    <h3>{t.scoreboard}</h3>
                    <div className="score-list">
                        {sortedTeams.map((team, index) => (
                            <div
                                key={team.name}
                                className={`score-item ${team.name === currentTeam.name ? 'active' : ''}`}
                            >
                                <span className="rank">{index + 1}</span>
                                <span className="team-name">{team.name}</span>
                                <span className="team-score">{team.score}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="play-area">
                    <div className="current-team-banner" style={{
                        background: `hsl(${(currentTeamIndex * 60) + 270}, 80%, 50%)`
                    }}>
                        {currentTeam.name}{t.turn}
                    </div>

                    {gameState === 'ready' && (
                        <div className="ready-state animate-fadeIn">
                            <div className="ready-icon">🎯</div>
                            <h2>{t.readyToPlay}</h2>
                            <p>{t.readyDesc1}</p>
                            <p>{t.readyDesc2}</p>
                            <button className="btn btn-primary start-round-btn" onClick={startRound}>
                                {t.startRound}
                            </button>
                        </div>
                    )}

                    {gameState === 'playing' && (
                        <div className="playing-state animate-fadeIn">
                            <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
                                <span className="timer-value">{timeLeft}</span>
                                <span className="timer-label">{t.seconds}</span>
                            </div>

                            <div className="hints-display">
                                <div className="mystery-name">
                                    <span className="mystery-icon">🎭</span>
                                    <span className="mystery-text">???</span>
                                </div>

                                <div className="hints-list">
                                    {currentCard.hints.slice(0, revealedHints).map((hint, index) => (
                                        <div
                                            key={index}
                                            className="hint-card animate-slideIn"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <span className="hint-badge">{t.hintPlaceholder} {index + 1}</span>
                                            <span className="hint-text">{hint}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="potential-points">
                                    <span>{t.currentPoints}</span>
                                    <span className="points-value">{calculatePoints(revealedHints)}</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button
                                    className="btn btn-warning reveal-btn"
                                    onClick={revealHint}
                                    disabled={revealedHints >= currentCard.hints.length}
                                >
                                    {t.revealHint} ({revealedHints}/{currentCard.hints.length})
                                </button>
                            </div>

                            {/* Owner Panel */}
                            <div className="owner-panel">
                                <div className="owner-panel-header">
                                    <span className="owner-panel-icon">🔒</span>
                                    <span className="owner-panel-title">{t.ownerPanelTitle}</span>
                                </div>

                                <p className="owner-warning">⚠️ {t.ownerWarning}</p>

                                <div
                                    className={`owner-answer ${ownerPanelRevealed ? 'revealed' : 'hidden'}`}
                                    onClick={() => setOwnerPanelRevealed(true)}
                                >
                                    {!ownerPanelRevealed ? (
                                        <span className="tap-to-reveal">{t.tapToReveal}</span>
                                    ) : (
                                        <div className="answer-content">
                                            {currentCard.image && (
                                                <img src={currentCard.image} alt="" className="owner-answer-image" />
                                            )}
                                            <span className="owner-answer-name">{currentCard.playerName}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="owner-buttons">
                                    <button
                                        className="btn btn-success owner-btn"
                                        onClick={handleOwnerCorrect}
                                        disabled={!ownerPanelRevealed}
                                    >
                                        {t.confirmCorrect}
                                    </button>
                                    <button
                                        className="btn btn-danger owner-btn"
                                        onClick={handleOwnerWrong}
                                        disabled={!ownerPanelRevealed}
                                    >
                                        {t.confirmWrong}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {gameState === 'revealed' && (
                        <div className="revealed-state animate-fadeIn">
                            <div className="answer-reveal">
                                <span className="answer-label">{t.answerWas}</span>
                                {currentCard.image && (
                                    <div className="answer-image-container">
                                        <img src={currentCard.image} alt={currentCard.playerName} className="answer-image" />
                                    </div>
                                )}
                                <h2 className="answer-name">{currentCard.playerName}</h2>
                            </div>

                            <div className={`points-earned ${earnedPoints > 0 ? 'success' : 'failed'}`}>
                                {earnedPoints > 0 ? (
                                    <>
                                        <span className="earned-icon">🎉</span>
                                        <span className="earned-text">+{earnedPoints} {t.points}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="earned-icon">😅</span>
                                        <span className="earned-text">{t.noPoints}</span>
                                    </>
                                )}
                            </div>

                            <button className="btn btn-primary next-btn" onClick={nextCard}>
                                {cardNumber < totalCards ? t.nextCard : t.seeResults}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GameBoard
