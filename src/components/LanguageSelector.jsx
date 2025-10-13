import { useTranslation } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useTranslation();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <label style={{
        fontWeight: 'bold',
        color: '#555'
      }}>
        🌐 {t('language.label')}:
      </label>
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          fontSize: '14px',
          backgroundColor: 'white',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        <option value="it">{t('language.it')}</option>
        <option value="en">{t('language.en')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
