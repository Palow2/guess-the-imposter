import { useState } from 'react'
import './TeamSetup.css'

function TeamSetup({ onSubmit, t }) {
    const [teamCount, setTeamCount] = useState(2)
    const [teamNames, setTeamNames] = useState(['', ''])

    const handleTeamCountChange = (count) => {
        setTeamCount(count)
        setTeamNames(prev => {
            const newNames = [...prev]
            while (newNames.length < count) {
                newNames.push('')
            }
            return newNames.slice(0, count)
        })
    }

    const handleNameChange = (index, value) => {
        setTeamNames(prev => {
            const newNames = [...prev]
            newNames[index] = value
            return newNames
        })
    }

    const handleSubmit = () => {
        const finalNames = teamNames.map((name, i) =>
            name.trim() || `${t.teamPlaceholder} ${i + 1}`
        )
        onSubmit(finalNames)
    }

    return (
        <div className="team-setup">
            <div className="setup-container animate-slideIn">
                <div className="setup-header">
                    <span className="header-icon">👥</span>
                    <h2>{t.teamSetup}</h2>
                    <p>{t.teamSetupDesc}</p>
                </div>

                <div className="team-count-section">
                    <label className="section-label">{t.numberOfTeams}</label>
                    <div className="team-count-buttons">
                        {[2, 3, 4, 5, 6].map(num => (
                            <button
                                key={num}
                                className={`count-btn ${teamCount === num ? 'active' : ''}`}
                                onClick={() => handleTeamCountChange(num)}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="team-names-section">
                    <label className="section-label">{t.teamNames}</label>
                    <div className="team-inputs">
                        {teamNames.map((name, index) => (
                            <div key={index} className="team-input-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                                <span className="team-number">{index + 1}</span>
                                <input
                                    type="text"
                                    className="input team-input"
                                    placeholder={`${t.teamPlaceholder} ${index + 1}`}
                                    value={name}
                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                    maxLength={20}
                                />
                                <span className="team-color" style={{
                                    background: `hsl(${(index * 60) + 270}, 80%, 60%)`
                                }}></span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="btn btn-primary continue-btn"
                    onClick={handleSubmit}
                >
                    {t.continueBtn}
                    <span className="btn-arrow">→</span>
                </button>
            </div>
        </div>
    )
}

export default TeamSetup
