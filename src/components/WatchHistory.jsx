import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import {
  getWatchHistoryFirebase,
  removeFromWatchHistoryFirebase,
  clearWatchHistoryFirebase
} from '../services/firebaseWatchHistory';

const WatchHistory = ({ onResumeContent }) => {
  const { t } = useTranslation();
  const [watchHistory, setWatchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWatchHistory();
  }, []);

  const loadWatchHistory = async () => {
    try {
      setIsLoading(true);
      const history = await getWatchHistoryFirebase();
      setWatchHistory(history);
    } catch (error) {
      console.error('Errore nel caricamento dello storico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = (currentTime, duration) => {
    if (!duration || duration === 0) return 0;
    return Math.min((currentTime / duration) * 100, 100);
  };

  const removeFromHistory = async (contentId) => {
    try {
      await removeFromWatchHistoryFirebase(contentId);
      const updatedHistory = watchHistory.filter(item => item.id !== contentId);
      setWatchHistory(updatedHistory);
    } catch (error) {
      console.error('Errore nella rimozione dallo storico:', error);
    }
  };

  const clearAllHistory = async () => {
    if (window.confirm(t('watchHistory.confirmClear'))) {
      await clearWatchHistoryFirebase();
      setWatchHistory([]);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        backgroundColor: '#181818',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#ffffff',
          borderBottom: '3px solid #E50914',
          paddingBottom: '10px',
          marginTop: 0,
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          📺 {t('watchHistory.title')}
        </h2>
        <p style={{ color: '#b3b3b3', textAlign: 'center', padding: '40px 0' }}>
          Caricamento...
        </p>
      </div>
    );
  }

  if (watchHistory.length === 0) {
    return (
      <div style={{
        backgroundColor: '#181818',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#ffffff',
          borderBottom: '3px solid #E50914',
          paddingBottom: '10px',
          marginTop: 0,
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          📺 {t('watchHistory.title')}
        </h2>
        <p style={{ color: '#b3b3b3', textAlign: 'center', padding: '40px 0' }}>
          {t('watchHistory.empty')}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#181818',
      padding: '20px',
      borderRadius: '4px',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h2 style={{
          color: '#ffffff',
          borderBottom: '3px solid #E50914',
          paddingBottom: '10px',
          marginTop: 0,
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: 0
        }}>
          📺 {t('watchHistory.title')}
        </h2>
        <button
          onClick={clearAllHistory}
          style={{
            backgroundColor: '#333333',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#E50914'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#333333'}
        >
          {t('watchHistory.clearAll')}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px',
        marginTop: '20px'
      }}>
        {watchHistory.map((item) => {
          const progress = calculateProgress(item.currentTime, item.duration);

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#2d2d2d',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(229, 9, 20, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div onClick={() => onResumeContent(item)}>
                {item.posterUrl ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '280px',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {progress > 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${progress}%`,
                          backgroundColor: '#E50914',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '280px',
                    backgroundColor: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    {item.contentType === 'tv' ? '📺' : '🎬'}
                  </div>
                )}

                <div style={{ padding: '12px' }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    color: '#ffffff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.contentType === 'tv' ? '📺 ' : '🎬 '}{item.title}
                  </h4>

                  {item.contentType === 'tv' && (
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '12px',
                      color: '#b3b3b3'
                    }}>
                      S{item.season} E{item.episode}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#E50914',
                      fontWeight: 'bold'
                    }}>
                      {formatTime(item.currentTime)}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      {item.duration ? `/ ${formatTime(item.duration)}` : ''}
                    </span>
                  </div>

                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: '#666'
                  }}>
                    {new Date(item.lastWatched).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(item.id);
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E50914'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
                title={t('watchHistory.remove')}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WatchHistory;
