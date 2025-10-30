import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registrazione nuovo utente
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Aggiorna il profilo con il nome
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      return result.user;
    } catch (err) {
      console.error('Error signing up:', err);
      setError(err.message);
      throw err;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      console.error('Error logging in:', err);
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      console.error('Error logging out:', err);
      setError(err.message);
      throw err;
    }
  };

  // Aggiorna il profilo utente
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      if (currentUser) {
        await updateProfile(currentUser, updates);
        setCurrentUser({ ...currentUser, ...updates });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      throw err;
    }
  };

  // Ascolta i cambiamenti dello stato di autenticazione
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        console.log('User authenticated:', user.email, 'UID:', user.uid);
      } else {
        console.log('No user authenticated');
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    updateUserProfile,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
