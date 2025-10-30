# Configurazione Firebase - Passi Finali

## ✅ Completato:
- Firebase SDK installato
- Configurazione Firebase creata
- Servizi per salvare/recuperare dati implementati
- Componenti aggiornati per usare Firebase

## 🔧 IMPORTANTE - Configura le regole di sicurezza:

### Passo 1: Vai su Firebase Console
1. Apri https://console.firebase.google.com/
2. Seleziona il tuo progetto "francesco-streaming-service"

### Passo 2: Abilita Authentication Anonima
1. Nel menu laterale, clicca su **"Authentication"**
2. Clicca su **"Get started"** (se non l'hai già fatto)
3. Vai nel tab **"Sign-in method"**
4. Trova **"Anonimo"** / **"Anonymous"** nella lista
5. Clicca su di esso
6. Attiva il toggle su **ON**
7. Clicca **"Salva"**

### Passo 3: Configura le regole Firestore
1. Nel menu laterale, clicca su **"Firestore Database"**
2. Clicca sul tab **"Regole"** / **"Rules"**
3. Sostituisci tutto il contenuto con questo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /watchHistory/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Clicca **"Pubblica"** / **"Publish"**

### Spiegazione delle regole:
- Solo utenti autenticati possono accedere ai loro dati
- Ogni utente può leggere/scrivere solo i propri dati (non quelli di altri utenti)
- I dati sono salvati in: `watchHistory/{userId}/items/{contentId}`

## 🚀 Come testare:

1. Avvia l'applicazione: `npm start`
2. Apri la console del browser (F12)
3. Dovresti vedere: "Firebase authenticated with user ID: xxx"
4. Guarda un video per alcuni secondi
5. Vai su Firebase Console > Firestore Database
6. Dovresti vedere i tuoi dati salvati in `watchHistory/{userId}/items/`

## 📊 Struttura dei dati in Firestore:

```
watchHistory/
  └── {userId}/
      └── items/
          ├── movie_550/
          │   ├── id: "movie_550"
          │   ├── tmdbId: 550
          │   ├── title: "Fight Club"
          │   ├── contentType: "movie"
          │   ├── currentTime: 125.5
          │   ├── duration: 7200
          │   ├── posterUrl: "https://..."
          │   └── lastWatched: "2025-10-21T..."
          └── tv_1396_s1_e1/
              ├── id: "tv_1396_s1_e1"
              ├── tmdbId: 1396
              ├── title: "Breaking Bad"
              ├── contentType: "tv"
              ├── season: 1
              ├── episode: 1
              ├── currentTime: 450.2
              ├── duration: 2700
              ├── posterUrl: "https://..."
              └── lastWatched: "2025-10-21T..."
```

## 🎯 Vantaggi di Firebase rispetto a localStorage:

✅ I dati persistono anche se cancelli i cookie/localStorage del browser
✅ Sincronizzazione automatica tra dispositivi (stesso utente)
✅ Backup automatico dei dati
✅ Scalabile e affidabile
✅ Gratuito fino a 1GB di storage e 50K letture/giorno

## 🔒 Sicurezza:

- Ogni utente ha un ID anonimo univoco generato da Firebase
- Gli utenti possono accedere solo ai propri dati
- Le regole di sicurezza impediscono l'accesso non autorizzato
- Nessuna informazione personale viene raccolta (autenticazione anonima)
