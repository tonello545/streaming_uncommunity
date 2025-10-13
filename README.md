# Francesco Streaming Service

Una piattaforma di streaming React per film e serie TV con ricerca avanzata e supporto multilingua.

## 🚀 Caratteristiche

- 🎬 **Streaming Film** - Guarda migliaia di film
- 📺 **Serie TV** - Accedi a episodi di serie TV
- 🔍 **Ricerca Avanzata** - Cerca contenuti tramite TMDB API
- 🌐 **Multilingua** - Supporto Italiano e Inglese
- 🎨 **Player Personalizzabile** - Colori e opzioni personalizzabili
- 📱 **Responsive** - Funziona su desktop e mobile

## 📦 Installazione

### Requisiti
- Node.js v14 o superiore
- npm o yarn

### Setup

```bash
# Clona il repository
git clone <repository-url>
cd streaming_uncommunity

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm start
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 🔧 Configurazione

### TMDB API Key

Per abilitare la ricerca, è necessaria una API key di TMDB:

1. Registrati su [themoviedb.org](https://www.themoviedb.org/)
2. Ottieni la tua API key da [Settings → API](https://www.themoviedb.org/settings/api)
3. Inserisci la key in `src/components/SearchForm.jsx`

```javascript
const TMDB_API_KEY = 'LA_TUA_API_KEY';
```

## 📁 Struttura del Progetto

```
streaming_uncommunity/
├── public/
│   └── index.html              # HTML principale
├── src/
│   ├── components/
│   │   ├── VixSrcPlayer.jsx    # Componente player
│   │   ├── SearchForm.jsx      # Form di ricerca
│   │   ├── LanguageSelector.jsx # Selettore lingua
│   │   └── ExampleComponent.jsx
│   ├── contexts/
│   │   └── LanguageContext.jsx  # Context per traduzioni
│   ├── locales/
│   │   ├── it.js               # Traduzioni italiane
│   │   ├── en.js               # Traduzioni inglesi
│   │   └── index.js
│   ├── types/
│   │   └── vixsrc.js           # Definizioni tipi
│   ├── VixSrcClient.jsx        # Client API principale
│   ├── App.jsx                 # Componente principale
│   └── index.jsx               # Entry point
├── package.json
└── README.md
```

## 🎯 Utilizzo

### Ricerca Contenuti

1. Usa il campo di ricerca per cercare film o serie TV
2. Seleziona il tipo di contenuto (Film/Serie TV)
3. Clicca su un risultato per caricarlo nel player

### Cambio Lingua

Usa il selettore lingua in alto per passare tra Italiano e Inglese.

### Player

- **Film**: Carica qualsiasi film tramite ricerca o ID TMDB
- **Serie TV**: Seleziona stagione ed episodio

## 🛠️ Build per Produzione

```bash
npm run build
```

I file compilati saranno nella cartella `build/`.

## 🔑 API Utilizzate

- **TMDB API** - Per ricerca e informazioni sui contenuti
- **VixSrc** - Per lo streaming dei contenuti

## 📝 Scripts Disponibili

```bash
npm start       # Avvia il server di sviluppo
npm run build   # Build per produzione
npm test        # Esegue i test
npm run eject   # Eject da create-react-app (irreversibile)
```

## 🌐 Traduzioni

Il progetto supporta:
- 🇮🇹 Italiano
- 🇬🇧 Inglese

Per aggiungere una nuova lingua, crea un nuovo file in `src/locales/`.

## 💡 Tecnologie Utilizzate

- React 17
- React Hooks (useState, useContext, useEffect)
- TMDB API
- Context API per gestione stato globale
- localStorage per persistenza

## 👤 Autore

Francesco Tonello

## 📄 Licenza

Questo progetto è fornito as-is per uso personale.
