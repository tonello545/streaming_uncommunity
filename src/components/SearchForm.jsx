import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const SearchForm = ({ onSelectContent }) => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // TMDB API Key
  const TMDB_API_KEY = '29c7e7dd5d0745880dd92f2a2adf6fb3';
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError(t('search.enterQuery'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      // Usa TMDB API per la ricerca con la lingua corrente
      const tmdbLang = language === 'it' ? 'it-IT' : 'en-US';
      const url = `${TMDB_BASE_URL}/search/${searchType}?api_key=${TMDB_API_KEY}&language=${tmdbLang}&query=${encodeURIComponent(searchQuery)}&page=1`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${t('search.error')}: ${response.status}`);
      }

      const data = await response.json();
      console.log('Risultati ricerca TMDB:', data);

      if (data && data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setError(t('search.noResults'));
      }
    } catch (err) {
      console.error('Errore nella ricerca:', err);
      setError(`${t('search.error')}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectContent = (item) => {
    const config = {
      tmdbId: item.id,
      primaryColor: 'B20710',
      secondaryColor: '170000',
      autoplay: false,
      lang: 'it'
    };

    // Per le serie TV, aggiungi season e episode
    if (searchType === 'tv') {
      config.season = 1;
      config.episode = 1;
    }

    onSelectContent(config, searchType);
    setSearchResults([]);
    setSearchQuery('');
  };

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
        🔍 {t('search.title')}
      </h2>

      <form onSubmit={handleSearch} style={{ marginBottom: '15px' }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '10px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: '#333333',
              color: '#ffffff'
            }}
          />

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: '#333333',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="movie">{t('content.movie')}</option>
            <option value="tv">{t('content.tv')}</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#564d4d' : '#E50914',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {isLoading ? t('search.searching') : t('search.button')}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          backgroundColor: '#2d2d2d',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '15px',
          borderLeft: '4px solid #E50914',
          color: '#ffffff'
        }}>
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '15px', marginTop: '20px', fontSize: '1.2rem' }}>
            {t('search.results')} ({searchResults.length})
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '15px',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '10px'
          }}>
            {searchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectContent(item)}
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#B20710';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {item.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                    alt={item.title || item.name}
                    style={{
                      width: '100%',
                      borderRadius: '5px',
                      marginBottom: '8px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <h4 style={{
                  margin: '5px 0',
                  fontSize: '14px',
                  color: '#333',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.title || item.name}
                </h4>
                <p style={{
                  margin: '5px 0',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {item.release_date || item.first_air_date
                    ? `(${(item.release_date || item.first_air_date).substring(0, 4)})`
                    : ''
                  }
                </p>
                {item.vote_average && (
                  <p style={{
                    margin: '5px 0',
                    fontSize: '12px',
                    color: '#B20710',
                    fontWeight: 'bold'
                  }}>
                    ⭐ {item.vote_average.toFixed(1)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
