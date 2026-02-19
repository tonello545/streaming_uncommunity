/**
 * Client per l'integrazione con VixSrc.to
 * Gestisce embed di film e serie TV e comunicazione con il player
 */
export class VixSrcClient {
  constructor() {
    this.baseUrl = 'https://vixsrc.to';
    this.eventListeners = new Map();
    this.iframes = new Map();

    // Setup message listener per eventi dal player
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handlePlayerMessage.bind(this));
    }
  }

  /**
   * Costruisce l'URL di embed per un contenuto
   * @param {import('./types/vixsrc').VixSrcConfig} config - Configurazione del contenuto
   * @returns {string} URL di embed
   */
  buildEmbedUrl(config) {
    const { tmdbId, season, episode, primaryColor, secondaryColor, autoplay, startAt, lang } = config;

    // Determina il tipo di contenuto
    const contentType = (season !== undefined && episode !== undefined) ? 'tv' : 'movie';

    // Costruisci il path base (senza /embed secondo la documentazione)
    let path = `/${contentType}/${tmdbId}`;

    // Aggiungi stagione ed episodio per le serie TV
    if (contentType === 'tv') {
      path += `/${season}/${episode}`;
    }

    // Costruisci i parametri query
    const params = new URLSearchParams();

    if (primaryColor) params.append('primaryColor', primaryColor);
    if (secondaryColor) params.append('secondaryColor', secondaryColor);
    if (autoplay !== undefined) params.append('autoplay', autoplay.toString());
    if (startAt !== undefined) params.append('startAt', startAt.toString());
    if (lang) params.append('lang', lang);

    const queryString = params.toString();
    return `${this.baseUrl}${path}${queryString ? '?' + queryString : ''}`;
  }

  /**
   * Crea e inserisce un iframe nel DOM
   * @param {import('./types/vixsrc').VixSrcConfig} config - Configurazione del contenuto
   * @param {import('./types/vixsrc').VixSrcEmbedOptions} options - Opzioni di embedding
   * @returns {HTMLIFrameElement} L'iframe creato
   */
  embed(config, options) {
    const {
      container,
      width = '100%',
      height = '500px',
      frameBorder = 0,
      allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      allowFullscreen = true
    } = options;

    // Ottieni il container element
    const containerElement = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!containerElement) {
      throw new Error(`Container non trovato: ${container}`);
    }

    // Crea l'iframe
    const iframe = document.createElement('iframe');
    const embedUrl = this.buildEmbedUrl(config);

    iframe.src = embedUrl;
    iframe.width = typeof width === 'number' ? `${width}px` : width;
    iframe.height = typeof height === 'number' ? `${height}px` : height;
    iframe.frameBorder = frameBorder.toString();
    iframe.allow = allow;

    if (allowFullscreen) {
      iframe.allowFullscreen = true;
    }

    // Salva riferimento all'iframe
    const iframeId = `vixsrc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    iframe.dataset.vixsrcId = iframeId;
    this.iframes.set(iframeId, iframe);

    // Inserisci nel DOM
    containerElement.innerHTML = '';
    containerElement.appendChild(iframe);

    return iframe;
  }

  /**
   * Gestisce i messaggi ricevuti dal player
   * @param {MessageEvent} event - Evento messaggio
   */
  handlePlayerMessage(event) {
    // Verifica che il messaggio provenga da VixSrc
    if (!event.origin.includes('vixsrc.to')) {
      return;
    }

    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      // Log tutti i messaggi ricevuti per debug
      console.log('📨 Messaggio ricevuto da VixSrc:', data);

      // Il formato secondo la documentazione è: { type: "PLAYER_EVENT", data: { event: "play", ... } }
      if (data.type === 'PLAYER_EVENT' && data.data && data.data.event) {
        console.log('🎬 Evento player:', data.data.event, data.data);
        this.emitEvent(data.data.event, data.data);
      }
    } catch (error) {
      console.error('Errore nel parsing del messaggio player:', error);
    }
  }

  /**
   * Registra un listener per eventi del player
   * @param {string} eventType - Tipo di evento (play, pause, ended, timeupdate, etc.)
   * @param {Function} callback - Funzione callback
   */
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType).push(callback);
  }

  /**
   * Rimuove un listener per eventi del player
   * @param {string} eventType - Tipo di evento
   * @param {Function} callback - Funzione callback da rimuovere
   */
  removeEventListener(eventType, callback) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emette un evento ai listener registrati
   * @param {string} eventType - Tipo di evento
   * @param {any} data - Dati dell'evento
   */
  emitEvent(eventType, data) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback({ type: eventType, data });
        } catch (error) {
          console.error(`Errore nel callback per evento ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Ottiene il catalogo dei contenuti disponibili
   * @param {'movie'|'tv'|'episode'} type - Tipo di contenuto
   * @param {string} [lang='it'] - Lingua
   * @returns {Promise<import('./types/vixsrc').VixSrcCatalogResponse>} Catalogo
   */
  async fetchCatalog(type, lang = 'it') {
    const url = `${this.baseUrl}/api/list/${type}?lang=${lang}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Errore nel caricamento del catalogo:', error);
      throw error;
    }
  }


  /**
   * Invia un comando al player
   * @param {string} iframeId - ID dell'iframe
   * @param {string} command - Comando (play, pause, seek, setVolume, etc.)
   * @param {any} [params] - Parametri del comando
   */
  sendCommand(iframeId, command, params) {
    const iframe = this.iframes.get(iframeId);
    if (!iframe || !iframe.contentWindow) {
      console.warn(`Iframe non trovato: ${iframeId}`);
      return;
    }

    const message = {
      type: 'command',
      command,
      params
    };

    iframe.contentWindow.postMessage(JSON.stringify(message), this.baseUrl);
  }

  /**
   * Pulisce e rimuove tutti gli iframe
   */
  destroy() {
    this.iframes.forEach(iframe => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    });
    this.iframes.clear();
    this.eventListeners.clear();
  }
}
