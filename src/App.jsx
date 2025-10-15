import { useState } from 'react';
import VixSrcPlayer from './components/VixSrcPlayer';
import SearchForm from './components/SearchForm';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from './contexts/LanguageContext';

const App = () => {
  const { t } = useTranslation();
  const [currentConfig, setCurrentConfig] = useState({
    tmdbId: 786892, // Furiosa (default: movie)
    primaryColor: 'B20710',
    secondaryColor: '170000',
    autoplay: false,
    lang: 'it'
  });

  const [contentType, setContentType] = useState('movie');
  const [showPlayer, setShowPlayer] = useState(true);

  const handleSelectContent = (config, type) => {
    setCurrentConfig(config);
    setContentType(type);
    setShowPlayer(true);
  };

  const loadMovie = (tmdbId) => {
    setCurrentConfig({
      tmdbId,
      primaryColor: 'B20710',
      secondaryColor: '170000',
      autoplay: false,
      lang: currentConfig.lang || 'it'
    });
    setContentType('movie');
    setShowPlayer(true);
  };

  const loadTvShow = (tmdbId, season = 1, episode = 1) => {
    setCurrentConfig({
      tmdbId,
      season,
      episode,
      primaryColor: 'B20710',
      secondaryColor: '170000',
      autoplay: false,
      lang: currentConfig.lang || 'it'
    });
    setContentType('tv');
    setShowPlayer(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#141414',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#E50914',
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '20px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          {t('app.title')}
        </h1>

        <LanguageSelector />

      {/* Search Section */}
      <SearchForm onSelectContent={handleSelectContent} />

      {/* Unified Player Section */}
      <div style={{
        backgroundColor: '#181818',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '4px'
      }}>
        <h2 style={{
          color: '#ffffff',
          borderBottom: '3px solid #E50914',
          paddingBottom: '10px',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          {contentType === 'movie' ? '🎬 ' + t('player.movie.title') : '📺 ' + t('player.tv.title')}
        </h2>

        <div style={{ marginBottom: '15px', marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => setShowPlayer(!showPlayer)}
            style={{
              backgroundColor: '#E50914',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f40612'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#E50914'}
          >
            {showPlayer ? (contentType === 'movie' ? t('player.movie.hide') : t('player.tv.hide')) : (contentType === 'movie' ? t('player.movie.show') : t('player.tv.show'))}
          </button>

          <button
            onClick={() => loadMovie(550)}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e5e5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            {t('buttons.loadFightClub')}
          </button>

          <button
            onClick={() => loadTvShow(1396, 1, 1)}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e5e5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
            {t('buttons.loadBreakingBad')}
          </button>
        </div>

        {showPlayer && <VixSrcPlayer config={currentConfig} height="600px" />}
      </div>
      </div>
    </div>
  );
};

export default App;