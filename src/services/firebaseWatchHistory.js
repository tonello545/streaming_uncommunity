import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { db, auth } from "../config/firebase";

const COLLECTION_NAME = "watchHistory";
const MAX_HISTORY_ITEMS = 50;

/**
 * Salva o aggiorna il progresso di visualizzazione di un contenuto su Firebase
 */
export const saveWatchProgressFirebase = async (contentData) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.error("Nessun utente autenticato");
      return false;
    }

    const {
      tmdbId,
      title,
      contentType,
      currentTime,
      duration,
      posterUrl,
      season,
      episode
    } = contentData;

    // Genera un ID unico per il contenuto
    const contentId = contentType === 'tv'
      ? `tv_${tmdbId}_s${season}_e${episode}`
      : `movie_${tmdbId}`;

    const contentDoc = {
      id: contentId,
      tmdbId,
      title,
      contentType,
      currentTime,
      duration,
      posterUrl,
      lastWatched: new Date().toISOString(),
      userId: user.uid,
      ...(contentType === 'tv' && { season, episode })
    };

    // Salva nel documento dell'utente
    const docRef = doc(db, COLLECTION_NAME, user.uid, "items", contentId);
    await setDoc(docRef, contentDoc, { merge: true });

    console.log("Progresso salvato su Firebase:", contentId, currentTime);
    return true;
  } catch (error) {
    console.error("Errore nel salvataggio del progresso su Firebase:", error);
    return false;
  }
};

/**
 * Recupera lo storico completo di visualizzazione da Firebase
 */
export const getWatchHistoryFirebase = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.error("Nessun utente autenticato");
      return [];
    }

    const itemsCollectionRef = collection(db, COLLECTION_NAME, user.uid, "items");
    const q = query(itemsCollectionRef, orderBy("lastWatched", "desc"), limit(MAX_HISTORY_ITEMS));

    const querySnapshot = await getDocs(q);
    const history = [];

    querySnapshot.forEach((doc) => {
      history.push(doc.data());
    });

    console.log("Storico recuperato da Firebase:", history.length, "elementi");
    return history;
  } catch (error) {
    console.error("Errore nel recupero dello storico da Firebase:", error);
    return [];
  }
};

/**
 * Recupera il progresso di un contenuto specifico da Firebase
 */
export const getContentProgressFirebase = async (tmdbId, contentType, season = null, episode = null) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.error("Nessun utente autenticato");
      return null;
    }

    const contentId = contentType === 'tv' && season && episode
      ? `tv_${tmdbId}_s${season}_e${episode}`
      : `movie_${tmdbId}`;

    const docRef = doc(db, COLLECTION_NAME, user.uid, "items", contentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Errore nel recupero del progresso da Firebase:", error);
    return null;
  }
};

/**
 * Rimuove un contenuto dallo storico su Firebase
 */
export const removeFromWatchHistoryFirebase = async (contentId) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.error("Nessun utente autenticato");
      return false;
    }

    const docRef = doc(db, COLLECTION_NAME, user.uid, "items", contentId);
    await deleteDoc(docRef);

    console.log("Contenuto rimosso da Firebase:", contentId);
    return true;
  } catch (error) {
    console.error("Errore nella rimozione dallo storico Firebase:", error);
    return false;
  }
};

/**
 * Cancella tutto lo storico da Firebase
 */
export const clearWatchHistoryFirebase = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.error("Nessun utente autenticato");
      return false;
    }

    const itemsCollectionRef = collection(db, COLLECTION_NAME, user.uid, "items");
    const querySnapshot = await getDocs(itemsCollectionRef);

    const deletePromises = [];
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(document.ref));
    });

    await Promise.all(deletePromises);

    console.log("Storico Firebase cancellato completamente");
    return true;
  } catch (error) {
    console.error("Errore nella cancellazione dello storico Firebase:", error);
    return false;
  }
};

/**
 * Controlla se un contenuto è stato completato (visto almeno al 90%)
 */
export const isContentCompleted = (currentTime, duration) => {
  if (!duration || duration === 0) return false;
  const progress = (currentTime / duration) * 100;
  return progress >= 90;
};
