/**
 * @typedef {Object} VixSrcConfig
 * @property {number} tmdbId - ID del contenuto da The Movie Database
 * @property {number} [season] - Numero della stagione (solo per serie TV)
 * @property {number} [episode] - Numero dell'episodio (solo per serie TV)
 * @property {string} [primaryColor] - Colore primario del player (hex senza #)
 * @property {string} [secondaryColor] - Colore secondario del player (hex senza #)
 * @property {boolean} [autoplay] - Riproduzione automatica
 * @property {number} [startAt] - Tempo di inizio in secondi
 * @property {string} [lang] - Lingua preferita (default: 'en')
 */

/**
 * @typedef {Object} VixSrcEmbedOptions
 * @property {HTMLElement|string} container - Elemento o selettore CSS del container
 * @property {string|number} [width] - Larghezza del player (default: '100%')
 * @property {string|number} [height] - Altezza del player (default: '500px')
 * @property {number} [frameBorder] - Spessore del bordo (default: 0)
 * @property {string} [allow] - Permessi iframe
 * @property {boolean} [allowFullscreen] - Permetti fullscreen (default: true)
 */

/**
 * @typedef {Object} VixSrcCatalogItem
 * @property {number} id - ID TMDB
 * @property {string} title - Titolo del contenuto
 * @property {string} [name] - Nome (per serie TV)
 * @property {string} overview - Descrizione
 * @property {string} poster_path - Path del poster
 * @property {string} backdrop_path - Path del backdrop
 * @property {number} vote_average - Voto medio
 * @property {string} release_date - Data di rilascio (film)
 * @property {string} [first_air_date] - Data prima messa in onda (TV)
 */

/**
 * @typedef {Object} VixSrcCatalogResponse
 * @property {number} page - Numero pagina corrente
 * @property {VixSrcCatalogItem[]} results - Array di risultati
 * @property {number} total_pages - Totale pagine
 * @property {number} total_results - Totale risultati
 */

/**
 * @typedef {Object} PlayerEventData
 * @property {number} [currentTime] - Tempo corrente del video
 * @property {number} [duration] - Durata totale del video
 * @property {boolean} [paused] - Stato pausa
 * @property {number} [volume] - Volume (0-1)
 */

/**
 * @typedef {Object} PlayerEvent
 * @property {string} type - Tipo di evento
 * @property {PlayerEventData} data - Dati dell'evento
 */

export {};
