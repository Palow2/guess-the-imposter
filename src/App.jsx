import { useState } from 'react'
import StartScreen from './components/StartScreen'
import TeamSetup from './components/TeamSetup'
import CardCreation from './components/CardCreation'
import GameReady from './components/GameReady'
import GameBoard from './components/GameBoard'
import EndScreen from './components/EndScreen'
import LanguageToggle from './components/LanguageToggle'
import SavedGames from './components/SavedGames'
import { useTranslation } from './translations'
import './App.css'

function App() {
  const [gamePhase, setGamePhase] = useState('start')
  const [teams, setTeams] = useState([])
  const [cards, setCards] = useState([])
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [language, setLanguage] = useState('en')
  const [showSavedGames, setShowSavedGames] = useState(false)
  const [usedCardIndices, setUsedCardIndices] = useState(new Set())

  const t = useTranslation(language)
  const isRTL = language === 'ar'

  const startNewGame = () => {
    setGamePhase('teamSetup')
  }

  const openSavedGames = () => {
    setShowSavedGames(true)
  }

  const loadSavedGame = (game) => {
    setTeams(game.teams.map(team => ({ ...team, score: 0 })))
    setCards(game.cards)
    setShowSavedGames(false)
    // Go to GameReady screen where they can save or play
    setGamePhase('gameReady')
  }

  const setupTeams = (teamNames) => {
    const newTeams = teamNames.map(name => ({
      name,
      score: 0
    }))
    setTeams(newTeams)
    setCards([])
    setGamePhase('cardCreation')
  }

  const addCards = (newCards) => {
    setCards(newCards)
    setGamePhase('gameReady')
  }

  const startPlaying = () => {
    // Shuffle cards and start playing
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentTeamIndex(0)
    setCurrentCardIndex(0)
    setUsedCardIndices(new Set())
    setGamePhase('playing')
  }

  const updateScore = (points) => {
    setTeams(prev => prev.map((team, index) =>
      index === currentTeamIndex
        ? { ...team, score: team.score + points }
        : team
    ))
  }

  const nextTurn = (points) => {
    updateScore(points)

    if (currentCardIndex >= cards.length - 1) {
      setGamePhase('gameOver')
    } else {
      setCurrentCardIndex(prev => prev + 1)
      setCurrentTeamIndex(prev => (prev + 1) % teams.length)
    }
  }

  const restartGame = () => {
    setGamePhase('start')
    setTeams([])
    setCards([])
    setCurrentTeamIndex(0)
    setCurrentCardIndex(0)
    setUsedCardIndices(new Set())
  }

  return (
    <div className={`app ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <LanguageToggle language={language} setLanguage={setLanguage} t={t} />

      {showSavedGames && (
        <SavedGames
          onLoad={loadSavedGame}
          onClose={() => setShowSavedGames(false)}
          t={t}
        />
      )}

      {gamePhase === 'start' && (
        <StartScreen
          onNewGame={startNewGame}
          onLoadGame={openSavedGames}
          t={t}
        />
      )}

      {gamePhase === 'teamSetup' && (
        <TeamSetup onSubmit={setupTeams} t={t} />
      )}

      {gamePhase === 'cardCreation' && (
        <CardCreation
          onSubmit={addCards}
          t={t}
        />
      )}

      {gamePhase === 'gameReady' && (
        <GameReady
          teams={teams}
          cards={cards}
          onStartGame={startPlaying}
          onBack={restartGame}
          t={t}
        />
      )}

      {gamePhase === 'playing' && cards.length > 0 && (
        <GameBoard
          teams={teams}
          currentTeam={teams[currentTeamIndex]}
          currentTeamIndex={currentTeamIndex}
          currentCard={cards[currentCardIndex]}
          cardNumber={currentCardIndex + 1}
          totalCards={cards.length}
          onNextTurn={nextTurn}
          t={t}
        />
      )}

      {gamePhase === 'gameOver' && (
        <EndScreen teams={teams} onRestart={restartGame} t={t} />
      )}

      <div className="credit-footer">
        Game made by Jasser Mdanat
      </div>
    </div>
  )
}

export default App
