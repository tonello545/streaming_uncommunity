import React, { useEffect, useRef, useState } from 'react';
import { VixSrcClient } from '../VixSrcClient';

const VixSrcPlayer = ({ config, width = '100%', height = '500px' }) => {
  const containerRef = useRef(null);
  const clientRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Inizializza il client solo una volta
    if (!clientRef.current) {
      clientRef.current = new VixSrcClient();
      console.log('VixSrc Client inizializzato');

      // Setup event listeners
      clientRef.current.addEventListener('play', (event) => {
        console.log('Video started playing:', event.data);
        setEvents(prev => [...prev, `▶️ Play - ${new Date().toLocaleTimeString()}`]);
      });

      clientRef.current.addEventListener('pause', (event) => {
        console.log('Video paused:', event.data);
        setEvents(prev => [...prev, `⏸️ Pause - ${new Date().toLocaleTimeString()}`]);
      });

      clientRef.current.addEventListener('ended', (event) => {
        console.log('Video ended:', event.data);
        setEvents(prev => [...prev, `🏁 Ended - ${new Date().toLocaleTimeString()}`]);
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

    // Cleanup
    return () => {
      if (clientRef.current) {
        // Non distruggiamo il client completamente per permettere riutilizzo
        // clientRef.current.destroy();
      }
    };
  }, [config, width, height]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        ref={containerRef}
        style={{
          width,
          height,
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
      {events.length > 0 && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          <strong>Eventi:</strong>
          {events.map((event, index) => (
            <div key={index} style={{ fontSize: '12px', marginTop: '5px' }}>
              {event}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VixSrcPlayer;
