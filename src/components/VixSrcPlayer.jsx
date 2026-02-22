import { useEffect, useRef, useState } from 'react';
import { VixSrcClient } from '../VixSrcClient';
import { saveWatchProgressFirebase, getContentProgressFirebase } from '../services/firebaseWatchHistory';
import { useTranslation } from '../contexts/LanguageContext';

const TMDB_API_KEY = '29c7e7dd5d0745880dd92f2a2adf6fb3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const VixSrcPlayer = ({ config, width = '100%', height = '500px', contentMetadata = null, onProgressUpdate = null, onNextEpisode = null }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const clientRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressSaveIntervalRef = useRef(null);
  const lastSavedTimeRef = useRef(0);

  // Stato episodio successivo
  const [totalEpisodes, setTotalEpisodes] = useState(null);
  const [episodeEnded, setEpisodeEnded] = useState(false);

  const isTvShow = config?.season !== undefined && config?.episode !== undefined;

  // Fetch conteggio episodi stagione corrente
  useEffect(() => {
    if (!isTvShow || !config?.tmdbId || !config?.season) {
      setTotalEpisodes(null);
      return;
    }
    const fetchEpisodeCount = async () => {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/tv/${config.tmdbId}/season/${config.season}?api_key=${TMDB_API_KEY}`);
        const data = await res.json();
        setTotalEpisodes(data.episodes?.length || null);
      } catch (err) {
        console.error('Errore nel recupero degli episodi:', err);
      }
    };
    fetchEpisodeCount();
  }, [config?.tmdbId, config?.season, isTvShow]);

  // Reset episodeEnded al cambio episodio
  useEffect(() => {
    setEpisodeEnded(false);
  }, [config?.season, config?.episode]);

  // Calcola episodio successivo
  const getNextEpisode = () => {
    if (!isTvShow) return null;
    const { season, episode } = config;
    if (totalEpisodes && episode < totalEpisodes) {
      return { season, episode: episode + 1 };
    }
    return { season: season + 1, episode: 1 };
  };

  const handleNextEpisodeClick = () => {
    const next = getNextEpisode();
    if (next && onNextEpisode) {
      onNextEpisode(next.season, next.episode);
    }
  };

  const nextEp = isTvShow ? getNextEpisode() : null;

  // Funzione per salvare il progresso corrente
  const saveCurrentProgress = async () => {
    if (!contentMetadata || !config) {
      console.warn('⚠️ Impossibile salvare: mancano contentMetadata o config');
      return;
    }

    if (currentTime === 0 || !duration) {
      console.warn('⚠️ Impossibile salvare: currentTime o duration non validi', { currentTime, duration });
      return;
    }

    const progressData = {
      tmdbId: config.tmdbId,
      title: contentMetadata.title || 'Unknown',
      contentType: config.season !== undefined ? 'tv' : 'movie',
      currentTime: currentTime,
      duration: duration,
      posterUrl: contentMetadata.posterUrl || null,
      ...(config.season !== undefined && {
        season: config.season,
        episode: config.episode
      })
    };

    const success = await saveWatchProgressFirebase(progressData);

    if (success) {
      lastSavedTimeRef.current = currentTime;
    } else {
      console.error('❌ Errore nel salvataggio del progresso');
    }

    if (onProgressUpdate) {
      onProgressUpdate(progressData);
    }
  };

  useEffect(() => {
    const startProgressTracking = () => {
      if (progressSaveIntervalRef.current) return;
      progressSaveIntervalRef.current = setInterval(() => {
        if (Math.abs(currentTime - lastSavedTimeRef.current) >= 5) {
          saveCurrentProgress();
        }
      }, 10000);
    };

    const stopProgressTracking = () => {
      if (progressSaveIntervalRef.current) {
        clearInterval(progressSaveIntervalRef.current);
        progressSaveIntervalRef.current = null;
      }
    };

    if (!clientRef.current) {
      clientRef.current = new VixSrcClient();

      clientRef.current.addEventListener('play', (event) => {
        console.log('Video started playing:', event.data);
        setEvents(prev => [...prev, `▶️ Play - ${new Date().toLocaleTimeString()}`]);
        startProgressTracking();
      });

      clientRef.current.addEventListener('pause', (event) => {
        console.log('Video paused:', event.data);
        setEvents(prev => [...prev, `⏸️ Pause - ${new Date().toLocaleTimeString()}`]);
        saveCurrentProgress();
        stopProgressTracking();
      });

      clientRef.current.addEventListener('ended', (event) => {
        console.log('Video ended:', event.data);
        setEvents(prev => [...prev, `🏁 Ended - ${new Date().toLocaleTimeString()}`]);
        saveCurrentProgress();
        stopProgressTracking();
        setEpisodeEnded(true);
      });

      clientRef.current.addEventListener('timeupdate', (event) => {
        if (event.data && event.data.currentTime !== undefined) {
          setCurrentTime(event.data.currentTime);
          if (event.data.duration !== undefined) {
            setDuration(event.data.duration);
          }
        }
      });

      clientRef.current.addEventListener('loadedmetadata', (event) => {
        if (event.data && event.data.duration !== undefined) {
          setDuration(event.data.duration);
        }
      });
    }

    if (containerRef.current && config) {
      try {
        clientRef.current.embed(config, { container: containerRef.current, width, height });
      } catch (error) {
        console.error('Errore durante l\'embedding:', error);
      }
    }

    return () => {
      stopProgressTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, width, height]);

  useEffect(() => {
    const loadSavedProgress = async () => {
      if (config && contentMetadata) {
        const contentType = config.season !== undefined ? 'tv' : 'movie';
        const savedProgress = await getContentProgressFirebase(
          config.tmdbId,
          contentType,
          config.season,
          config.episode
        );
        if (savedProgress && savedProgress.currentTime > 10) {
          setEvents(prev => [...prev, `📌 Progresso recuperato: ${Math.floor(savedProgress.currentTime)}s`]);
        }
      }
    };
    loadSavedProgress();
  }, [config, contentMetadata]);

  return (
    <div style={{ width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height,
          backgroundColor: '#000',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      />

      {/* Pulsante episodio successivo - solo per serie TV */}
      {isTvShow && onNextEpisode && nextEp && (
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleNextEpisodeClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: episodeEnded ? '#E50914' : '#2a2a2a',
              color: '#ffffff',
              border: episodeEnded ? 'none' : '1px solid #444',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s',
              boxShadow: episodeEnded ? '0 0 16px rgba(229,9,20,0.5)' : 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E50914'; e.currentTarget.style.border = 'none'; }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = episodeEnded ? '#E50914' : '#2a2a2a';
              e.currentTarget.style.border = episodeEnded ? 'none' : '1px solid #444';
            }}
          >
            <span style={{ fontSize: '18px' }}>▶</span>
            <span>
              {t('player.nextEpisode')} — S{nextEp.season}E{nextEp.episode}
            </span>
          </button>
        </div>
      )}

      {events.length > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          backgroundColor: '#2d2d2d',
          borderRadius: '4px',
          maxHeight: '120px',
          overflowY: 'auto',
          borderLeft: '4px solid #E50914'
        }}>
          <strong style={{ color: '#ffffff', fontSize: '14px' }}>Eventi:</strong>
          {events.map((event, index) => (
            <div key={index} style={{ fontSize: '12px', marginTop: '5px', color: '#b3b3b3' }}>
              {event}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VixSrcPlayer;
