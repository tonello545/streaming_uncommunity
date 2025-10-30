# 🔐 Sistema di Autenticazione - Guida Completa

## ✅ Implementazione Completata:

1. ✅ **AuthContext** - Gestione dello stato utente
2. ✅ **Componente Auth** - Form di login/registrazione
3. ✅ **Integrazione Firebase Authentication**
4. ✅ **Protezione delle route** - Solo utenti autenticati possono vedere i contenuti
5. ✅ **Traduzioni** complete in italiano e inglese

---

## 🔧 Configurazione Firebase Console (OBBLIGATORIO):

### Passo 1: Abilita Email/Password Authentication

1. Vai su: https://console.firebase.google.com/project/francesco-streaming-service/authentication/providers
2. Nella tab **"Sign-in method"**, trova **"Email/Password"**
3. Clicca su **"Email/Password"**
4. Attiva il primo toggle: **"Email/Password"** → **ON**
5. (Opzionale) NON attivare "Email link (passwordless sign-in)" per ora
6. Clicca **"Salva"**

### Passo 2: Configura le Regole Firestore

1. Vai su: https://console.firebase.google.com/project/francesco-streaming-service/firestore/rules
2. Sostituisci tutto il contenuto con questo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regole per lo storico di visualizzazione
    match /watchHistory/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Opzionale: Aggiungi altre collezioni qui in futuro
  }
}
```

3. Clicca **"Pubblica"**

---

## 🚀 Come Funziona:

### **1. Registrazione Nuovo Utente**
- L'utente compila il form di registrazione
- Firebase crea un account con email/password
- L'utente viene automaticamente loggato
- Il nome visualizzato viene salvato nel profilo

### **2. Login Utente Esistente**
- L'utente inserisce email e password
- Firebase verifica le credenziali
- Se corrette, l'utente accede all'applicazione
- Lo storico di visualizzazione viene caricato dal database

### **3. Salvataggio Dati**
- Solo utenti autenticati possono salvare dati
- Ogni utente ha accesso solo ai propri dati
- I dati sono salvati in: `watchHistory/{userId}/items/`
- Sincronizzazione automatica tra dispositivi

---

## 🎯 Funzionalità Implementate:

### **Componente Auth** (src/components/Auth.jsx)
- ✅ Form di login/registrazione
- ✅ Validazione password (minimo 6 caratteri)
- ✅ Conferma password
- ✅ Gestione errori Firebase (email già in uso, credenziali errate, etc.)
- ✅ Switch tra login e registrazione
- ✅ Visualizzazione profilo utente quando loggato
- ✅ Pulsante logout

### **AuthContext** (src/contexts/AuthContext.jsx)
- ✅ Gestione stato autenticazione globale
- ✅ Funzioni: `signup`, `login`, `logout`
- ✅ Listener per cambiamenti stato autenticazione
- ✅ Loading state per evitare flash di contenuti

### **Protezione Contenuti** (src/App.jsx)
- ✅ WatchHistory - Solo utenti autenticati
- ✅ SearchForm - Solo utenti autenticati
- ✅ Player - Solo utenti autenticati
- ✅ Componente Auth sempre visibile

### **Firebase Services** (src/services/firebaseWatchHistory.js)
- ✅ Controllo autenticazione prima di ogni operazione
- ✅ Salvataggio dati specifici per utente
- ✅ Isolamento dati tra utenti

---

## 📊 Struttura Dati Firestore:

```
watchHistory/
  └── {userId}/               # ID utente Firebase
      └── items/              # Collezione dei contenuti guardati
          ├── movie_550/      # Film
          │   ├── id: "movie_550"
          │   ├── tmdbId: 550
          │   ├── title: "Fight Club"
          │   ├── contentType: "movie"
          │   ├── currentTime: 125.5
          │   ├── duration: 7200
          │   ├── posterUrl: "https://..."
          │   ├── userId: "abc123"
          │   └── lastWatched: "2025-10-21T..."
          └── tv_1396_s1_e1/  # Serie TV
              ├── id: "tv_1396_s1_e1"
              ├── tmdbId: 1396
              ├── title: "Breaking Bad"
              ├── contentType: "tv"
              ├── season: 1
              ├── episode: 1
              ├── currentTime: 450.2
              ├── duration: 2700
              ├── posterUrl: "https://..."
              ├── userId: "abc123"
              └── lastWatched: "2025-10-21T..."
```

---

## 🔒 Sicurezza:

### **Regole Firestore**
- Ogni utente può leggere/scrivere solo i propri dati
- Impossibile accedere ai dati di altri utenti
- Autenticazione obbligatoria per tutte le operazioni

### **Password**
- Gestite da Firebase (crittografate)
- Validazione minimo 6 caratteri
- Firebase gestisce automaticamente hash e salt

### **Email**
- Validazione formato email
- Controllo univocità (no duplicati)

---

## 🎨 Esperienza Utente:

### **Non Autenticato**
- Vede solo il form di login/registrazione
- Non può accedere a contenuti, ricerca o storico
- UI pulita e minimale

### **Autenticato**
- Vede il profilo utente con pulsante logout
- Accesso completo a tutte le funzionalità
- Storico personale di visualizzazione
- Dati sincronizzati tra dispositivi

---

## 🧪 Test dell'Autenticazione:

### 1. **Registrazione**
```
1. Apri http://localhost:3000
2. Compila il form di registrazione:
   - Nome: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Conferma: "password123"
3. Clicca "Registrati"
4. Dovresti essere automaticamente loggato
```

### 2. **Logout e Login**
```
1. Clicca "Esci" in alto
2. Dovresti vedere di nuovo il form
3. Inserisci email e password usati prima
4. Clicca "Accedi"
5. Dovresti vedere i tuoi dati salvati
```

### 3. **Verifica Dati**
```
1. Guarda un contenuto per alcuni secondi
2. Vai su Firebase Console > Firestore Database
3. Cerca: watchHistory/{tuo-user-id}/items
4. Dovresti vedere i tuoi dati salvati
```

---

## 🐛 Risoluzione Problemi:

### **"Email already in use"**
- L'email è già registrata
- Usa "Accedi" invece di "Registrati"
- Oppure usa un'altra email

### **"Invalid email or password"**
- Email o password errate
- Controlla le credenziali
- Firebase distingue maiuscole/minuscole

### **"Nessun utente autenticato" in console**
- Firebase Authentication non è abilitata
- Vai su Firebase Console e abilita Email/Password

### **Dati non vengono salvati**
- Le regole Firestore non sono configurate
- Vai su Firebase Console > Firestore > Rules
- Copia le regole indicate sopra

---

## 📝 Prossimi Passi (Opzionali):

### **1. Password Reset**
- Implementare "Password dimenticata?"
- Usare `sendPasswordResetEmail()`

### **2. Email Verification**
- Richiedere verifica email
- Usare `sendEmailVerification()`

### **3. Social Login**
- Google Sign-In
- Facebook Login
- etc.

### **4. Profilo Utente**
- Pagina profilo personale
- Modifica nome/email
- Avatar personalizzato

---

## ✨ Vantaggi del Sistema:

✅ **Sicurezza**: Dati isolati per utente, password crittografate
✅ **Sincronizzazione**: Accesso da qualsiasi dispositivo
✅ **Scalabilità**: Firebase gestisce milioni di utenti
✅ **Gratuito**: Fino a 10K utenti attivi/mese
✅ **Semplice**: Form intuitivo, gestione errori chiara
✅ **Professionale**: Sistema di auth enterprise-grade

---

## 🎉 L'autenticazione è completa e pronta all'uso!

Dopo aver completato i 2 passi su Firebase Console, potrai:
1. Registrare nuovi utenti
2. Fare login/logout
3. Salvare dati personalizzati per utente
4. Accedere da qualsiasi dispositivo

**Buon divertimento con la tua piattaforma streaming! 🍿**
