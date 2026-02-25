import { useState, useRef } from 'react'
import './CardCreation.css'

function CardCreation({ onSubmit, t }) {
    const [cards, setCards] = useState([])
    const [currentCard, setCurrentCard] = useState({
        playerName: '',
        hints: ['', '', ''],
        image: null,
        imagePreview: null
    })
    const fileInputRef = useRef(null)

    const handleHintChange = (index, value) => {
        setCurrentCard(prev => {
            const newHints = [...prev.hints]
            newHints[index] = value
            return { ...prev, hints: newHints }
        })
    }

    const addHint = () => {
        if (currentCard.hints.length < 5) {
            setCurrentCard(prev => ({
                ...prev,
                hints: [...prev.hints, '']
            }))
        }
    }

    const removeHint = (index) => {
        if (currentCard.hints.length > 3) {
            setCurrentCard(prev => ({
                ...prev,
                hints: prev.hints.filter((_, i) => i !== index)
            }))
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setCurrentCard(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setCurrentCard(prev => ({
            ...prev,
            image: null,
            imagePreview: null
        }))
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const addCard = () => {
        if (currentCard.playerName.trim() && currentCard.hints.filter(h => h.trim()).length >= 3) {
            const newCard = {
                playerName: currentCard.playerName,
                hints: currentCard.hints.filter(h => h.trim()),
                image: currentCard.imagePreview
            }
            setCards(prev => [...prev, newCard])
            setCurrentCard({
                playerName: '',
                hints: ['', '', ''],
                image: null,
                imagePreview: null
            })
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const removeCard = (index) => {
        setCards(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = () => {
        if (cards.length >= 1) {
            onSubmit(cards)
        }
    }

    const canAddCard = currentCard.playerName.trim() &&
        currentCard.hints.filter(h => h.trim()).length >= 3

    return (
        <div className="card-creation">
            <div className="creation-container animate-slideIn">
                <div className="creation-header">
                    <h2>{t.createCards}</h2>
                    <p>{t.teamCardHelpText}</p>
                </div>

                <div className="card-form">
                    <div className="form-section">
                        <label className="section-label">
                            <span className="label-icon">🎭</span>
                            {t.hiddenName}
                        </label>
                        <input
                            type="text"
                            className="input player-name-input"
                            placeholder={t.namePlaceholder}
                            value={currentCard.playerName}
                            onChange={(e) => setCurrentCard(prev => ({ ...prev, playerName: e.target.value }))}
                            maxLength={30}
                        />
                    </div>

                    <div className="form-section">
                        <label className="section-label">
                            <span className="label-icon">📷</span>
                            {t.addImage}
                        </label>
                        <div className="image-upload-area">
                            {currentCard.imagePreview ? (
                                <div className="image-preview-container">
                                    <img src={currentCard.imagePreview} alt="Preview" className="image-preview" />
                                    <button className="remove-image-btn" onClick={removeImage}>×</button>
                                </div>
                            ) : (
                                <label className="upload-label">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="file-input"
                                    />
                                    <span className="upload-icon">📁</span>
                                    <span className="upload-text">{t.clickToUpload}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <label className="section-label">
                            <span className="label-icon">💡</span>
                            {t.hints}
                        </label>
                        <div className="hints-container">
                            {currentCard.hints.map((hint, index) => (
                                <div key={index} className="hint-input-wrapper">
                                    <span className="hint-number">{index + 1}</span>
                                    <input
                                        type="text"
                                        className="input hint-input"
                                        placeholder={`${t.hintPlaceholder} ${index + 1} ${index === 0 ? t.hardest : index === currentCard.hints.length - 1 ? t.easiest : ''}`}
                                        value={hint}
                                        onChange={(e) => handleHintChange(index, e.target.value)}
                                        maxLength={100}
                                    />
                                    {currentCard.hints.length > 3 && (
                                        <button
                                            className="remove-hint-btn"
                                            onClick={() => removeHint(index)}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {currentCard.hints.length < 5 && (
                            <button className="add-hint-btn" onClick={addHint}>
                                {t.addHint}
                            </button>
                        )}
                    </div>

                    <button
                        className="btn btn-secondary add-card-btn"
                        onClick={addCard}
                        disabled={!canAddCard}
                    >
                        <span>{t.addCard}</span>
                        <span className="btn-icon">📝</span>
                    </button>
                </div>

                {cards.length > 0 && (
                    <div className="created-cards">
                        <h3>{t.createdCards} ({cards.length})</h3>
                        <div className="cards-list">
                            {cards.map((card, index) => (
                                <div key={index} className="card-preview">
                                    <div className="card-preview-content">
                                        {card.image && (
                                            <img src={card.image} alt={card.playerName} className="card-thumb" />
                                        )}
                                        <span className="card-name">🎭 {card.playerName}</span>
                                        <span className="card-hints">{card.hints.length} {t.hintsCount}</span>
                                    </div>
                                    <button
                                        className="remove-card-btn"
                                        onClick={() => removeCard(index)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    className="btn btn-primary submit-btn"
                    onClick={handleSubmit}
                    disabled={cards.length < 1}
                >
                    {t.startGameBtn}
                </button>

                <p className="help-text">
                    {t.teamCardHelpText}
                </p>
            </div>
        </div>
    )
}

export default CardCreation
