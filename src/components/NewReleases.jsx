import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import EpisodeSelector from './EpisodeSelector';

const TMDB_API_KEY = '29c7e7dd5d0745880dd92f2a2adf6fb3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const NewReleases = ({ onSelectContent }) => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('movie');
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
  const [selectedTvShow, setSelectedTvShow] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      setIsLoading(true);
      const tmdbLang = language === 'it' ? 'it-IT' : 'en-US';
      try {
        const [moviesRes, tvRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=${tmdbLang}&page=1`),
          fetch(`${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=${tmdbLang}&page=1`)
        ]);
        const [moviesData, tvData] = await Promise.all([moviesRes.json(), tvRes.json()]);
        setMovies(moviesData.results?.slice(0, 20) || []);
        setTvShows(tvData.results?.slice(0, 20) || []);
      } catch (err) {
        console.error('Errore nel caricare le nuove uscite:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewReleases();
  }, [language]);

  const handleSelectItem = (item, mediaType) => {
    if (mediaType === 'tv') {
      setSelectedTvShow({ ...item, media_type: 'tv' });
      setShowEpisodeSelector(true);
    } else {
      const config = {
        tmdbId: item.id,
        primaryColor: 'B20710',
        secondaryColor: '170000',
        autoplay: false,
        lang: 'it'
      };
      const metadata = {
        title: item.title || item.name,
        posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null
      };
      onSelectContent(config, 'movie', metadata);
    }
  };

  const handleEpisodeConfirm = (season, episode) => {
    const config = {
      tmdbId: selectedTvShow.id,
      season,
      episode,
      primaryColor: 'B20710',
      secondaryColor: '170000',
      autoplay: false,
      lang: 'it'
    };
    const metadata = {
      title: selectedTvShow.name || selectedTvShow.title,
      posterUrl: selectedTvShow.poster_path
        ? `https://image.tmdb.org/t/p/w500${selectedTvShow.poster_path}`
        : null
    };
    onSelectContent(config, 'tv', metadata);
    setShowEpisodeSelector(false);
    setSelectedTvShow(null);
  };

  const handleEpisodeCancel = () => {
    setShowEpisodeSelector(false);
    setSelectedTvShow(null);
  };

  const currentItems = activeTab === 'movie' ? movies : tvShows;

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
        {t('newReleases.title')}
      </h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['movie', 'tv'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              backgroundColor: activeTab === tab ? '#E50914' : '#333333',
              color: '#ffffff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab ? '700' : '400',
              transition: 'background-color 0.2s'
            }}
          >
            {tab === 'movie' ? `🎬 ${t('newReleases.movies')}` : `📺 ${t('newReleases.tvShows')}`}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <p style={{ color: '#b3b3b3', textAlign: 'center', padding: '20px 0' }}>
          {t('newReleases.loading')}
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '15px',
          maxHeight: '480px',
          overflowY: 'auto',
          padding: '5px'
        }}>
          {currentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item, activeTab)}
              style={{
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.2s',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#E50914';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name}
                  style={{ width: '100%', display: 'block' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  backgroundColor: '#3a3a3a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {activeTab === 'movie' ? '🎬' : '📺'}
                </div>
              )}
              <div style={{ padding: '8px' }}>
                <p style={{
                  margin: '0 0 4px',
                  fontSize: '13px',
                  color: '#ffffff',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.title || item.name}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#b3b3b3' }}>
                  {(item.release_date || item.first_air_date || '').substring(0, 4)}
                  {item.vote_average > 0 && (
                    <span style={{ color: '#E50914', fontWeight: 'bold', marginLeft: '6px' }}>
                      ⭐ {item.vote_average.toFixed(1)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEpisodeSelector && selectedTvShow && (
        <EpisodeSelector
          tvShowId={selectedTvShow.id}
          tvShowData={selectedTvShow}
          onConfirm={handleEpisodeConfirm}
          onCancel={handleEpisodeCancel}
        />
      )}
    </div>
  );
};

export default NewReleases;
