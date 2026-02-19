import { useState } from 'react';
import VixSrcPlayer from './components/VixSrcPlayer';
import HeaderSearch from './components/HeaderSearch';
import NewReleases from './components/NewReleases';
import LanguageSelector from './components/LanguageSelector';
import WatchHistory from './components/WatchHistory';
import Auth from './components/Auth';
import { useTranslation } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [currentConfig, setCurrentConfig] = useState(null);
  const [contentType, setContentType] = useState('movie');
  const [showPlayer, setShowPlayer] = useState(false);
  const [contentMetadata, setContentMetadata] = useState(null);

  const handleSelectContent = (config, type, metadata = null) => {
    setCurrentConfig(config);
    setContentType(type);
    setShowPlayer(true);
    if (metadata) {
      setContentMetadata(metadata);
    }
  };

  const handleResumeContent = (item) => {
    const config = {
      tmdbId: item.tmdbId,
      primaryColor: 'B20710',
      secondaryColor: '170000',
      autoplay: false,
      lang: 'it'
    };

    if (item.contentType === 'tv') {
      config.season = item.season;
      config.episode = item.episode;
    }

    setCurrentConfig(config);
    setContentType(item.contentType);
    setContentMetadata({
      title: item.title,
      posterUrl: item.posterUrl
    });
    setShowPlayer(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#141414' }}>

      {/* Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#0d0d0d',
        borderBottom: '2px solid #E50914',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Logo / Titolo */}
        <h1 style={{
          color: '#E50914',
          fontSize: '1.4rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          margin: 0,
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          {t('app.title')}
        </h1>

        {/* Search centrale - solo se autenticato */}
        {isAuthenticated && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <HeaderSearch onSelectContent={handleSelectContent} />
          </div>
        )}

        {/* Destra: LanguageSelector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: 'auto' }}>
          <LanguageSelector />
        </div>
      </header>

      {/* Contenuto principale */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>

        {/* Authentication Section */}
        <Auth />

        {/* Watch History Section - Solo se autenticato */}
        {isAuthenticated && <WatchHistory onResumeContent={handleResumeContent} />}

        {/* New Releases Section - Solo se autenticato */}
        {isAuthenticated && <NewReleases onSelectContent={handleSelectContent} />}

        {/* Unified Player Section - Solo se autenticato */}
        {isAuthenticated && (
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

            {showPlayer && currentConfig && (
              <VixSrcPlayer config={currentConfig} height="600px" contentMetadata={contentMetadata} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
