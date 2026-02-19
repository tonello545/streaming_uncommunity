import { useEffect, useRef, useState } from 'react';
import { VixSrcClient } from '../VixSrcClient';
import { saveWatchProgressFirebase, getContentProgressFirebase } from '../services/firebaseWatchHistory';

const VixSrcPlayer = ({ config, width = '100%', height = '500px', contentMetadata = null, onProgressUpdate = null }) => {
  const containerRef = useRef(null);
  const clientRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressSaveIntervalRef = useRef(null);
  const lastSavedTimeRef = useRef(0);

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

    console.log('💾 Tentativo salvataggio progresso:', {
      title: progressData.title,
      currentTime: Math.floor(progressData.currentTime),
      duration: Math.floor(progressData.duration),
      percentage: Math.floor((progressData.currentTime / progressData.duration) * 100) + '%'
    });

    const success = await saveWatchProgressFirebase(progressData);

    if (success) {
      console.log('✅ Progresso salvato con successo!');
      lastSavedTimeRef.current = currentTime;
    } else {
      console.error('❌ Errore nel salvataggio del progresso');
    }

    if (onProgressUpdate) {
      onProgressUpdate(progressData);
    }
  };

  useEffect(() => {
    // Avvia il tracciamento del progresso (salva ogni 10 secondi)
    const startProgressTracking = () => {
      if (progressSaveIntervalRef.current) return;

      progressSaveIntervalRef.current = setInterval(() => {
        // Salva solo se il tempo è cambiato di almeno 5 secondi
        if (Math.abs(currentTime - lastSavedTimeRef.current) >= 5) {
          saveCurrentProgress();
        }
      }, 10000); // 10 secondi
    };

    // Ferma il tracciamento del progresso
    const stopProgressTracking = () => {
      if (progressSaveIntervalRef.current) {
        clearInterval(progressSaveIntervalRef.current);
        progressSaveIntervalRef.current = null;
      }
    };
    // Inizializza il client solo una volta
    if (!clientRef.current) {
      clientRef.current = new VixSrcClient();
      console.log('VixSrc Client inizializzato');

      // Setup event listeners
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
      });

      // Evento per tracciare il tempo corrente
      clientRef.current.addEventListener('timeupdate', (event) => {
        console.log('📡 Evento timeupdate ricevuto:', event.data);
        if (event.data && event.data.currentTime !== undefined) {
          setCurrentTime(event.data.currentTime);
          if (event.data.duration !== undefined) {
            setDuration(event.data.duration);
          }
          console.log('⏱️ Tempo aggiornato:', Math.floor(event.data.currentTime), 's /', event.data.duration ? Math.floor(event.data.duration) + 's' : 'N/A');
        }
      });

      // Evento per tracciare la durata
      clientRef.current.addEventListener('loadedmetadata', (event) => {
        console.log('📡 Evento loadedmetadata ricevuto:', event.data);
        if (event.data && event.data.duration !== undefined) {
          setDuration(event.data.duration);
          console.log('⏱️ Durata video:', Math.floor(event.data.duration), 's');
        }
      });
    }

    // Embed il video quando il config cambia
    if (containerRef.current && config) {
      try {
        clientRef.current.embed(config, {
          container: containerRef.current,
          width,
          height
        });
        console.log('Player embedded con successo');
      } catch (error) {
        console.error('Errore durante l\'embedding:', error);
      }
    }

    // Log per debug: verifica che gli event listener siano attivi
    console.log('🎧 Event listeners registrati. In attesa di eventi dal player...');

    // Cleanup
    return () => {
      stopProgressTracking();
      if (clientRef.current) {
        // Non distruggiamo il client completamente per permettere riutilizzo
        // clientRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, width, height]);

  // Effetto per recuperare il progresso salvato al caricamento
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
          // Se c'è un progresso salvato significativo, mostra un messaggio
          console.log(`Progresso recuperato: ${savedProgress.currentTime}s`);
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
