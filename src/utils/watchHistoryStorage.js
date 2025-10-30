// Utility functions per gestire lo storico di visualizzazione nel localStorage

const STORAGE_KEY = 'watchHistory';
const MAX_HISTORY_ITEMS = 50; // Limite massimo di elementi nello storico

/**
 * Salva o aggiorna il progresso di visualizzazione di un contenuto
 * @param {Object} contentData - Dati del contenuto
 * @param {number|string} contentData.tmdbId - ID TMDB del contenuto
 * @param {string} contentData.title - Titolo del contenuto
 * @param {string} contentData.contentType - Tipo ('movie' o 'tv')
 * @param {number} contentData.currentTime - Tempo corrente in secondi
 * @param {number} contentData.duration - Durata totale in secondi
 * @param {string} contentData.posterUrl - URL del poster
 * @param {number} contentData.season - Stagione (solo per TV)
 * @param {number} contentData.episode - Episodio (solo per TV)
 */
export const saveWatchProgress = (contentData) => {
  try {
    const {
      tmdbId,
      title,
      contentType,
      currentTime,
      duration,
      posterUrl,
      season,
      episode
    } = contentData;

    // Genera un ID unico per il contenuto
    const contentId = contentType === 'tv'
      ? `tv_${tmdbId}_s${season}_e${episode}`
      : `movie_${tmdbId}`;

    // Recupera lo storico esistente
    const history = getWatchHistory();

    // Cerca se il contenuto esiste già
    const existingIndex = history.findIndex(item => item.id === contentId);

    const updatedItem = {
      id: contentId,
      tmdbId,
      title,
      contentType,
      currentTime,
      duration,
      posterUrl,
      lastWatched: new Date().toISOString(),
      ...(contentType === 'tv' && { season, episode })
    };

    if (existingIndex >= 0) {
      // Aggiorna l'elemento esistente
      history[existingIndex] = updatedItem;
    } else {
      // Aggiungi nuovo elemento
      history.unshift(updatedItem);
    }

    // Limita il numero di elementi
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    // Salva nel localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));

    console.log('Progresso salvato:', contentId, currentTime);
    return true;
  } catch (error) {
    console.error('Errore nel salvataggio del progresso:', error);
    return false;
  }
};

/**
 * Recupera lo storico completo di visualizzazione
 * @returns {Array} Array di oggetti contenuto
 */
export const getWatchHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Errore nel recupero dello storico:', error);
    return [];
  }
};

/**
 * Recupera il progresso di un contenuto specifico
 * @param {number|string} tmdbId - ID TMDB del contenuto
 * @param {string} contentType - Tipo di contenuto ('movie' o 'tv')
 * @param {number} season - Stagione (opzionale, per TV)
 * @param {number} episode - Episodio (opzionale, per TV)
 * @returns {Object|null} Oggetto con i dati del progresso o null
 */
export const getContentProgress = (tmdbId, contentType, season = null, episode = null) => {
  try {
    const history = getWatchHistory();
    const contentId = contentType === 'tv' && season && episode
      ? `tv_${tmdbId}_s${season}_e${episode}`
      : `movie_${tmdbId}`;

    return history.find(item => item.id === contentId) || null;
  } catch (error) {
    console.error('Errore nel recupero del progresso:', error);
    return null;
  }
};

/**
 * Rimuove un contenuto dallo storico
 * @param {string} contentId - ID del contenuto da rimuovere
 * @returns {boolean} True se la rimozione ha avuto successo
 */
export const removeFromWatchHistory = (contentId) => {
  try {
    const history = getWatchHistory();
    const updatedHistory = history.filter(item => item.id !== contentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Errore nella rimozione dallo storico:', error);
    return false;
  }
};

/**
 * Cancella tutto lo storico
 * @returns {boolean} True se la cancellazione ha avuto successo
 */
export const clearWatchHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Errore nella cancellazione dello storico:', error);
    return false;
  }
};

/**
 * Controlla se un contenuto è stato completato (visto almeno al 90%)
 * @param {number} currentTime - Tempo corrente in secondi
 * @param {number} duration - Durata totale in secondi
 * @returns {boolean} True se il contenuto è stato completato
 */
export const isContentCompleted = (currentTime, duration) => {
  if (!duration || duration === 0) return false;
  const progress = (currentTime / duration) * 100;
  return progress >= 90;
};
