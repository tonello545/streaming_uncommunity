import { useTranslation } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useTranslation();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '15px',
      backgroundColor: '#181818',
      borderRadius: '4px',
      marginBottom: '20px'
    }}>
      <label style={{
        fontWeight: '600',
        color: '#ffffff',
        fontSize: '14px'
      }}>
        🌐 {t('language.label')}:
      </label>
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          padding: '10px 16px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: '#333333',
          color: '#ffffff',
          cursor: 'pointer',
          outline: 'none',
          fontWeight: '500'
        }}
      >
        <option value="it">{t('language.it')}</option>
        <option value="en">{t('language.en')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
