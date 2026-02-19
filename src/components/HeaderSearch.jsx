import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import EpisodeSelector from './EpisodeSelector';

const TMDB_API_KEY = '29c7e7dd5d0745880dd92f2a2adf6fb3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const HeaderSearch = ({ onSelectContent }) => {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
  const [selectedTvShow, setSelectedTvShow] = useState(null);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Chiudi dropdown cliccando fuori
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ricerca con debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const tmdbLang = language === 'it' ? 'it-IT' : 'en-US';
        const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=${tmdbLang}&query=${encodeURIComponent(query)}&page=1`;
        const res = await fetch(url);
        const data = await res.json();
        const filtered = (data.results || [])
          .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 8);
        setResults(filtered);
        setShowDropdown(true);
      } catch (err) {
        console.error('Errore ricerca header:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, language]);

  const handleSelectItem = (item) => {
    if (item.media_type === 'tv') {
      setSelectedTvShow(item);
      setShowEpisodeSelector(true);
      setShowDropdown(false);
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
      setQuery('');
      setShowDropdown(false);
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
    setQuery('');
  };

  const handleEpisodeCancel = () => {
    setShowEpisodeSelector(false);
    setSelectedTvShow(null);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
      {/* Input */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{
          position: 'absolute',
          left: '12px',
          color: '#b3b3b3',
          fontSize: '16px',
          pointerEvents: 'none'
        }}>
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder={t('search.placeholder')}
          style={{
            width: '100%',
            padding: '10px 12px 10px 38px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '20px',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }}
          onFocusCapture={(e) => { e.target.style.borderColor = '#E50914'; }}
          onBlurCapture={(e) => { e.target.style.borderColor = '#444'; }}
        />
        {isLoading && (
          <span style={{
            position: 'absolute',
            right: '12px',
            color: '#b3b3b3',
            fontSize: '12px'
          }}>
            ···
          </span>
        )}
        {query && !isLoading && (
          <button
            onClick={() => { setQuery(''); setShowDropdown(false); }}
            style={{
              position: 'absolute',
              right: '10px',
              background: 'none',
              border: 'none',
              color: '#b3b3b3',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '0',
              lineHeight: 1
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown risultati */}
      {showDropdown && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          backgroundColor: '#1f1f1f',
          borderRadius: '8px',
          border: '1px solid #333',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          zIndex: 2000,
          overflow: 'hidden'
        }}>
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                cursor: 'pointer',
                borderBottom: '1px solid #2a2a2a',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                  alt={item.title || item.name}
                  style={{ width: '36px', height: '54px', borderRadius: '3px', objectFit: 'cover', flexShrink: 0 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{
                  width: '36px', height: '54px', borderRadius: '3px',
                  backgroundColor: '#333', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px', flexShrink: 0
                }}>
                  {item.media_type === 'tv' ? '📺' : '🎬'}
                </div>
              )}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.media_type === 'tv' ? '📺 ' : '🎬 '}{item.title || item.name}
                </p>
                <p style={{ margin: '2px 0 0', color: '#b3b3b3', fontSize: '12px' }}>
                  {(item.release_date || item.first_air_date || '').substring(0, 4)}
                  {item.vote_average > 0 && (
                    <span style={{ color: '#E50914', marginLeft: '8px' }}>
                      ⭐ {item.vote_average.toFixed(1)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EpisodeSelector */}
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

export default HeaderSearch;
