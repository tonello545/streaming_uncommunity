import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

const Auth = () => {
  const { t } = useTranslation();
  const { signup, login, currentUser, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await login(formData.email, formData.password);
      } else {
        // Registrazione
        if (formData.password !== formData.confirmPassword) {
          setError(t('auth.passwordMismatch'));
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError(t('auth.passwordTooShort'));
          setLoading(false);
          return;
        }

        await signup(formData.email, formData.password, formData.displayName);
      }

      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
      });
    } catch (err) {
      console.error('Auth error:', err);
      // Traduci errori Firebase comuni
      if (err.code === 'auth/email-already-in-use') {
        setError(t('auth.emailInUse'));
      } else if (err.code === 'auth/invalid-email') {
        setError(t('auth.invalidEmail'));
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError(t('auth.invalidCredentials'));
      } else if (err.code === 'auth/weak-password') {
        setError(t('auth.weakPassword'));
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Se l'utente è autenticato, mostra il profilo
  if (currentUser) {
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
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ color: '#ffffff', margin: '0 0 8px 0' }}>
              👤 {t('auth.welcome')}, {currentUser.displayName || currentUser.email}
            </h3>
            <p style={{ color: '#b3b3b3', margin: 0, fontSize: '14px' }}>
              {currentUser.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#E50914',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f40612'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#E50914'}
          >
            {t('auth.logout')}
          </button>
        </div>
      </div>
    );
  }

  // Form di login/registrazione
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
        🔐 {isLogin ? t('auth.login') : t('auth.signup')}
      </h2>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#ffffff', marginBottom: '5px', fontSize: '14px' }}>
              {t('auth.displayName')}
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder={t('auth.displayNamePlaceholder')}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#333333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#ffffff', marginBottom: '5px', fontSize: '14px' }}>
            {t('auth.email')}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={t('auth.emailPlaceholder')}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: '#333333',
              color: '#ffffff',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#ffffff', marginBottom: '5px', fontSize: '14px' }}>
            {t('auth.password')}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder={t('auth.passwordPlaceholder')}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: '#333333',
              color: '#ffffff',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#ffffff', marginBottom: '5px', fontSize: '14px' }}>
              {t('auth.confirmPassword')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder={t('auth.confirmPasswordPlaceholder')}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#333333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '15px',
            borderLeft: '4px solid #E50914',
            color: '#ffffff',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#564d4d' : '#E50914',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '15px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#f40612')}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#E50914')}
        >
          {loading ? t('auth.loading') : (isLogin ? t('auth.loginButton') : t('auth.signupButton'))}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                displayName: ''
              });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#E50914',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? t('auth.switchToSignup') : t('auth.switchToLogin')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
