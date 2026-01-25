const STORAGE_KEY = 'guessTheImposter_savedGames'

export const getSavedGames = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : []
    } catch (error) {
        console.error('Error loading saved games:', error)
        return []
    }
}

export const saveGame = (gameData) => {
    try {
        const savedGames = getSavedGames()
        const newGame = {
            id: Date.now().toString(),
            name: gameData.name || `Game ${new Date().toLocaleDateString()}`,
            savedAt: new Date().toISOString(),
            teams: gameData.teams,
            cards: gameData.cards
        }
        savedGames.unshift(newGame)
        // Keep only last 10 saved games
        const trimmed = savedGames.slice(0, 10)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
        return newGame
    } catch (error) {
        console.error('Error saving game:', error)
        return null
    }
}

export const loadGame = (gameId) => {
    try {
        const savedGames = getSavedGames()
        return savedGames.find(game => game.id === gameId) || null
    } catch (error) {
        console.error('Error loading game:', error)
        return null
    }
}

export const deleteGame = (gameId) => {
    try {
        const savedGames = getSavedGames()
        const filtered = savedGames.filter(game => game.id !== gameId)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
        return true
    } catch (error) {
        console.error('Error deleting game:', error)
        return false
    }
}

export const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
