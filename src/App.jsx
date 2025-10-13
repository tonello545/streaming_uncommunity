import { useState } from 'react';
import VixSrcPlayer from './components/VixSrcPlayer';
import SearchForm from './components/SearchForm';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from './contexts/LanguageContext';

const App = () => {
  const { t } = useTranslation();
  const [movieConfig, setMovieConfig] = useState({
    tmdbId: 786892, // Furiosa
    primaryColor: 'B20710',
    secondaryColor: '170000',
    autoplay: false,
    lang: 'it'
  });

  const [tvConfig, setTvConfig] = useState({
    tmdbId: 1399, // Game of Thrones
    season: 1,
    episode: 1,
    primaryColor: 'B20710',
    secondaryColor: '170000',
    autoplay: false,
    lang: 'it'
  });

  const [showMovie, setShowMovie] = useState(true);
  const [showTv, setShowTv] = useState(true);

  const handleSelectContent = (config, type) => {
    if (type === 'movie') {
      setMovieConfig(config);
      setShowMovie(true);
      setShowTv(false);
    } else if (type === 'tv') {
      setTvConfig(config);
      setShowTv(true);
      setShowMovie(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        {t('app.title')}
      </h1>

      <LanguageSelector />

      {/* Search Section */}
      <SearchForm onSelectContent={handleSelectContent} />

      {/* Film Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#555', borderBottom: '2px solid #B20710', paddingBottom: '10px' }}>
          🎬 {t('player.movie.title')}
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => setShowMovie(!showMovie)}
            style={{
              backgroundColor: '#B20710',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {showMovie ? t('player.movie.hide') : t('player.movie.show')}
          </button>

          <button
            onClick={() => setMovieConfig({ ...movieConfig, tmdbId: 550 })}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {t('buttons.loadFightClub')}
          </button>
        </div>

        {showMovie && <VixSrcPlayer config={movieConfig} height="500px" />}
      </div>

      {/* TV Series Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#555', borderBottom: '2px solid #B20710', paddingBottom: '10px' }}>
          📺 {t('player.tv.title')}
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => setShowTv(!showTv)}
            style={{
              backgroundColor: '#B20710',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {showTv ? t('player.tv.hide') : t('player.tv.show')}
          </button>

          <button
            onClick={() => setTvConfig({ ...tvConfig, tmdbId: 1396, season: 1, episode: 1 })}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {t('buttons.loadBreakingBad')}
          </button>
        </div>

        {showTv && <VixSrcPlayer config={tvConfig} height="500px" />}
      </div>
    </div>
  );
};

export default App;