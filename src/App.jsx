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

      {/* Film Section */}
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
          🎬 {t('player.movie.title')}
        </h2>

        <div style={{ marginBottom: '15px', marginTop: '15px' }}>
          <button
            onClick={() => setShowMovie(!showMovie)}
            style={{
              backgroundColor: '#E50914',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f40612'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#E50914'}
          >
            {showMovie ? t('player.movie.hide') : t('player.movie.show')}
          </button>

          <button
            onClick={() => setMovieConfig({ ...movieConfig, tmdbId: 550 })}
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
        </div>

        {showMovie && <VixSrcPlayer config={movieConfig} height="600px" />}
      </div>

      {/* TV Series Section */}
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
          📺 {t('player.tv.title')}
        </h2>

        <div style={{ marginBottom: '15px', marginTop: '15px' }}>
          <button
            onClick={() => setShowTv(!showTv)}
            style={{
              backgroundColor: '#E50914',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f40612'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#E50914'}
          >
            {showTv ? t('player.tv.hide') : t('player.tv.show')}
          </button>

          <button
            onClick={() => setTvConfig({ ...tvConfig, tmdbId: 1396, season: 1, episode: 1 })}
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

        {showTv && <VixSrcPlayer config={tvConfig} height="600px" />}
      </div>
      </div>
    </div>
  );
};

export default App;