import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const EpisodeSelector = ({ tvShowId, tvShowData, onConfirm, onCancel }) => {
  const { t, language } = useTranslation();
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const TMDB_API_KEY = '29c7e7dd5d0745880dd92f2a2adf6fb3';
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  // Carica dettagli della serie TV per ottenere le stagioni
  useEffect(() => {
    const fetchSeasons = async () => {
      setIsLoading(true);
      try {
        const tmdbLang = language === 'it' ? 'it-IT' : 'en-US';
        const url = `${TMDB_BASE_URL}/tv/${tvShowId}?api_key=${TMDB_API_KEY}&language=${tmdbLang}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch TV show details');
        }

        const data = await response.json();
        console.log('TV Show details:', data);

        // Filtra le stagioni (esclude season 0 che di solito sono speciali)
        const filteredSeasons = data.seasons.filter(season => season.season_number > 0);
        setSeasons(filteredSeasons);

        if (filteredSeasons.length > 0) {
          setSelectedSeason(filteredSeasons[0].season_number);
        }
      } catch (error) {
        console.error('Error fetching seasons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
  }, [tvShowId, language]);

  // Carica episodi quando cambia la stagione selezionata
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!selectedSeason) return;

      try {
        const tmdbLang = language === 'it' ? 'it-IT' : 'en-US';
        const url = `${TMDB_BASE_URL}/tv/${tvShowId}/season/${selectedSeason}?api_key=${TMDB_API_KEY}&language=${tmdbLang}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch episodes');
        }

        const data = await response.json();
        console.log('Season episodes:', data);
        setEpisodes(data.episodes || []);

        // Reset al primo episodio quando cambia stagione
        if (data.episodes && data.episodes.length > 0) {
          setSelectedEpisode(1);
        }
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    };

    fetchEpisodes();
  }, [selectedSeason, tvShowId, language]);

  const handleConfirm = () => {
    onConfirm(selectedSeason, selectedEpisode);
  };

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#181818',
          padding: '40px',
          borderRadius: '8px',
          color: '#ffffff',
          fontSize: '18px'
        }}>
          {t('episodeSelector.loading')}...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: '#181818',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{
          color: '#ffffff',
          marginTop: 0,
          marginBottom: '20px',
          fontSize: '1.5rem',
          borderBottom: '3px solid #E50914',
          paddingBottom: '10px'
        }}>
          📺 {tvShowData.title || tvShowData.name}
        </h2>

        <p style={{
          color: '#b3b3b3',
          marginBottom: '25px',
          fontSize: '14px'
        }}>
          {t('episodeSelector.selectEpisode')}
        </p>

        {/* Season Selector */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            color: '#ffffff',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {t('episodeSelector.season')}
          </label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#333333',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {seasons.map((season) => (
              <option key={season.season_number} value={season.season_number}>
                {t('episodeSelector.season')} {season.season_number} ({season.episode_count} {t('episodeSelector.episodes')})
              </option>
            ))}
          </select>
        </div>

        {/* Episode Selector */}
        {episodes.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              marginBottom: '10px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {t('episodeSelector.episode')}
            </label>
            <select
              value={selectedEpisode}
              onChange={(e) => setSelectedEpisode(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#333333',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {episodes.map((episode) => (
                <option key={episode.episode_number} value={episode.episode_number}>
                  {t('episodeSelector.episode')} {episode.episode_number} - {episode.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selected Episode Details */}
        {episodes.length > 0 && episodes[selectedEpisode - 1] && (
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '25px',
            borderLeft: '4px solid #E50914'
          }}>
            <h4 style={{
              color: '#ffffff',
              marginTop: 0,
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              {episodes[selectedEpisode - 1].name}
            </h4>
            <p style={{
              color: '#b3b3b3',
              fontSize: '13px',
              marginBottom: '8px'
            }}>
              {episodes[selectedEpisode - 1].overview || t('episodeSelector.noDescription')}
            </p>
            {episodes[selectedEpisode - 1].air_date && (
              <p style={{
                color: '#999999',
                fontSize: '12px',
                margin: 0
              }}>
                {t('episodeSelector.airDate')}: {episodes[selectedEpisode - 1].air_date}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: '#333333',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4d4d4d'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#333333'}
          >
            {t('episodeSelector.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: '#E50914',
              color: '#ffffff',
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
            {t('episodeSelector.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeSelector;
