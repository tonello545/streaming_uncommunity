# 🐛 Checklist Debug - Film non salvati

## ⚡ Test Rapido (2 minuti)

1. **Apri l'app**: http://localhost:3000
2. **Fai login** con un account
3. **Avvia un video** (Fight Club o Breaking Bad)
4. **Apri Console Browser** (F12)
5. **Aspetta 10 secondi** di riproduzione

### Cosa DEVI vedere in console:

```
✅ User authenticated: tuo@email.com UID: abc123...
✅ VixSrc Client inizializzato
✅ Player embedded con successo
✅ ⏱️ Polling time: 15 s / Duration: 7200 s
✅ 💾 Tentativo salvataggio progresso: { title: "...", currentTime: 15, ... }
✅ Progresso salvato su Firebase: movie_550 15.5
✅ ✅ Progresso salvato con successo!
```

### Se manca uno di questi ❌:

| Messaggio Mancante | Problema | Soluzione |
|-------------------|----------|-----------|
| "User authenticated" | Non sei loggato | Fai login |
| "VixSrc Client inizializzato" | Player non caricato | Ricarica pagina |
| "Polling time" | Player non funziona | Vedi TROUBLESHOOTING.md Passo 3 |
| "Tentativo salvataggio" | Dati mancanti | Controlla contentMetadata |
| "Progresso salvato su Firebase" | Firebase bloccato | Controlla regole Firestore |
| "✅ Progresso salvato" | Errore scrittura | Vedi errori in console |

---

## 🔍 Verifica Dati su Firebase

1. Vai su: https://console.firebase.google.com/project/francesco-streaming-service/firestore/data
2. Cerca: `watchHistory` → `{tuo-user-id}` → `items`
3. Dovresti vedere: `movie_550` o `tv_1396_s1_e1`

**Se NON vedi nulla:**
- Le regole Firestore sono sbagliate
- Vai su: https://console.firebase.google.com/project/francesco-streaming-service/firestore/rules
- Copia le regole da AUTHENTICATION_SETUP.md linee 30-40
- Clicca "Pubblica"

---

## 🎯 Test Storico

1. **Guarda un film** per almeno 15 secondi
2. **Ricarica la pagina** (F5)
3. **Dovresti vedere** la sezione "Continua a Guardare"

**Se NON la vedi:**
1. Apri Console (F12)
2. Cerca: `Storico recuperato da Firebase: X elementi`
3. Se X = 0 → I dati non sono stati salvati, torna al test rapido
4. Se X > 0 → C'è un problema di rendering, controlla WatchHistory.jsx

---

## 🚨 Errori Comuni

### "Permission denied" o errore 403
```
PROBLEMA: Regole Firestore non configurate
SOLUZIONE: Pubblica le regole in Firebase Console
```

### "Nessun utente autenticato"
```
PROBLEMA: Non sei loggato
SOLUZIONE: Fai login con email/password
```

### Il tempo resta a 0
```
PROBLEMA: Player VixSrc non espone currentTime
SOLUZIONE: Il polling manuale è già implementato,
           aspetta 5 secondi e controlla console
```

### I dati ci sono ma non vengono mostrati
```
PROBLEMA: WatchHistory non riceve i dati
SOLUZIONE:
1. Controlla che isAuthenticated sia true
2. Verifica che WatchHistory sia renderizzato
3. Controlla errori in console
```

---

## 📊 Debug Avanzato

Esegui in Console (F12):

```javascript
// Controlla utente
console.log('User:', firebase.auth().currentUser);

// Controlla player
console.log('Client:', window.vixsrcClient);
console.log('Player:', window.vixsrcClient?.player);
console.log('Current Time:', window.vixsrcClient?.player?.currentTime);

// Forza salvataggio manuale
// (solo se il polling non funziona)
```

---

## ✅ Se tutto funziona, dovresti vedere:

1. ✅ Messaggio "User authenticated" in console
2. ✅ Messaggi di polling ogni 5 secondi
3. ✅ Salvataggio automatico ogni 10 secondi
4. ✅ Dati visibili su Firebase Console
5. ✅ Sezione "Continua a Guardare" dopo reload

---

**95% dei problemi** si risolvono con:
1. Pubblicare le regole Firestore corrette
2. Aspettare che il polling inizi (5-10 secondi)
3. Essere loggati con un account valido

Se il problema persiste, condividi i log della console per debug approfondito.
