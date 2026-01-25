import { useEffect, useState } from 'react'
import './EndScreen.css'

function EndScreen({ teams, onRestart, t }) {
    const [showConfetti, setShowConfetti] = useState(false)
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score)
    const winner = sortedTeams[0]
    const isTie = sortedTeams.filter(team => team.score === winner.score).length > 1

    useEffect(() => {
        setShowConfetti(true)
        const timer = setTimeout(() => setShowConfetti(false), 5000)
        return () => clearTimeout(timer)
    }, [])

    const confettiColors = ['#a855f7', '#22d3ee', '#ec4899', '#22c55e', '#fbbf24', '#6366f1']

    return (
        <div className="end-screen">
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                background: confettiColors[i % confettiColors.length],
                                animationDuration: `${2 + Math.random() * 3}s`,
                                animationDelay: `${Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="end-content animate-slideIn">
                <div className="trophy-container animate-bounce">
                    <span className="trophy">🏆</span>
                </div>

                <h1 className="winner-title">
                    {isTie ? (
                        <>{t.tie}</>
                    ) : (
                        <>{winner.name} {t.wins}</>
                    )}
                </h1>

                <p className="winner-score">
                    {isTie ? (
                        <>{t.topScore} {winner.score} {t.pointsLabel}</>
                    ) : (
                        <>{t.withPoints} {winner.score} {t.pointsLabel}!</>
                    )}
                </p>

                <div className="final-scoreboard">
                    <h3>{t.finalStandings}</h3>
                    <div className="final-scores">
                        {sortedTeams.map((team, index) => (
                            <div
                                key={team.name}
                                className={`final-score-item ${index === 0 ? 'first' : ''} ${index === 1 ? 'second' : ''} ${index === 2 ? 'third' : ''}`}
                                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                            >
                                <div className="medal">
                                    {index === 0 && '🥇'}
                                    {index === 1 && '🥈'}
                                    {index === 2 && '🥉'}
                                    {index > 2 && (index + 1)}
                                </div>
                                <div className="final-team-info">
                                    <span className="final-team-name">{team.name}</span>
                                    <span className="final-team-score">{team.score} {t.pts}</span>
                                </div>
                                <div className="score-bar">
                                    <div
                                        className="score-bar-fill"
                                        style={{
                                            width: `${winner.score > 0 ? (team.score / winner.score) * 100 : 0}%`,
                                            background: `hsl(${(index * 40) + 270}, 80%, 60%)`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="btn btn-primary restart-btn" onClick={onRestart}>
                    <span>{t.playAgain}</span>
                    <span className="restart-icon">🎮</span>
                </button>
            </div>
        </div>
    )
}

export default EndScreen
