# 🔧 Risoluzione Problemi - Film non vengono ricordati

## Problema: I film non vengono salvati nello storico

Ci sono diverse possibili cause. Segui questi passi in ordine:

---

## ✅ **Passo 1: Verifica Autenticazione**

1. Apri la Console del Browser (F12)
2. Vai sulla tab **Console**
3. Cerca questo messaggio all'apertura dell'app:
   ```
   User authenticated: tuo@email.com UID: abc123...
   ```

**Se NON lo vedi:**
- L'autenticazione non funziona
- Fai logout e login di nuovo
- Controlla che Firebase Authentication sia abilitato

**Se lo vedi:** ✅ Autenticazione OK, passa al Passo 2

---

## ✅ **Passo 2: Verifica Eventi Player**

1. Con la Console aperta (F12)
2. Avvia la riproduzione di un film
3. Cerca questi messaggi nella Console:
   ```
   Video started playing: {...}
   VixSrc Client inizializzato
   ```

**Se NON vedi "Video started playing":**
- Il player VixSrc non sta emettendo eventi
- Questo è il problema principale
- Vai al **Passo 3**

**Se lo vedi:** ✅ Eventi OK, vai al Passo 4

---

## ✅ **Passo 3: Fix Eventi Player (PROBLEMA PRINCIPALE)**

Il player VixSrc potrebbe non emettere gli eventi `timeupdate` necessari per salvare il progresso.

### Soluzione: Aggiungi Polling Manuale

Apri il file `src/components/VixSrcPlayer.jsx` e aggiungi questo codice dopo la riga 100 (dentro il useEffect principale):

```javascript
// Polling manuale del tempo se gli eventi non funzionano
const pollingInterval = setInterval(() => {
  if (clientRef.current && clientRef.current.player) {
    try {
      const currentTime = clientRef.current.player.currentTime || 0;
      const duration = clientRef.current.player.duration || 0;

      if (currentTime > 0) {
        setCurrentTime(currentTime);
        setDuration(duration);
        console.log('Polling time:', currentTime, 'Duration:', duration);
      }
    } catch (err) {
      // Ignora errori se il player non è pronto
    }
  }
}, 5000); // Controlla ogni 5 secondi

// Cleanup
return () => {
  clearInterval(pollingInterval);
  stopProgressTracking();
  if (clientRef.current) {
    // Non distruggiamo il client completamente per permettere riutilizzo
    // clientRef.current.destroy();
  }
};
```

**Dopo questa modifica:**
- Ricarica la pagina
- Avvia un video
- Dovresti vedere in console: `Polling time: X Duration: Y`
- Vai al Passo 4

---

## ✅ **Passo 4: Verifica Salvataggio Firebase**

1. Con il video in riproduzione (almeno 10 secondi)
2. Controlla la Console (F12)
3. Cerca questo messaggio:
   ```
   Progresso salvato su Firebase: movie_550 125.5
   ```

**Se NON lo vedi:**
- Il salvataggio non funziona
- Vai al **Passo 5**

**Se lo vedi:** ✅ Il salvataggio funziona! Vai al Passo 6

---

## ✅ **Passo 5: Verifica Regole Firebase**

1. Apri Firebase Console: https://console.firebase.google.com/project/francesco-streaming-service/firestore/rules

2. Verifica che le regole siano ESATTAMENTE così:
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

3. Clicca **"Pubblica"** se hai fatto modifiche

4. Riprova dal **Passo 4**

---

## ✅ **Passo 6: Verifica Dati su Firebase**

1. Vai su Firebase Console: https://console.firebase.google.com/project/francesco-streaming-service/firestore/data

2. Dovresti vedere questa struttura:
   ```
   watchHistory/
     └── {il-tuo-user-id}/
         └── items/
             └── movie_550/  (o altro)
   ```

**Se NON vedi nulla:**
- Apri la Console del browser (F12) → Tab **Network**
- Cerca chiamate a `firestore.googleapis.com`
- Se vedi errori 403 o 401 → Le regole Firebase sono sbagliate
- Torna al **Passo 5**

**Se vedi i dati:** ✅ I dati vengono salvati!

---

## ✅ **Passo 7: Verifica Caricamento Storico**

1. Ricarica la pagina completamente (F5)
2. Controlla la Console (F12)
3. Cerca questo messaggio:
   ```
   Storico recuperato da Firebase: X elementi
   ```

**Se vedi "0 elementi":**
- I dati ci sono ma non vengono caricati
- Controlla che sei loggato con lo stesso account
- Verifica nella Console Firebase che i dati esistano

**Se vedi "X elementi" con X > 0:**
- ✅ Tutto funziona!
- Dovresti vedere la sezione "Continua a Guardare"

---

## 🐛 **Errori Comuni**

### **"Nessun utente autenticato" in console**
```
CAUSA: Non sei loggato
SOLUZIONE: Fai login con un account
```

### **"Permission denied" in console**
```
CAUSA: Regole Firebase non configurate
SOLUZIONE: Vai al Passo 5
```

### **Non vedo eventi del player**
```
CAUSA: VixSrc non emette eventi timeupdate
SOLUZIONE: Vai al Passo 3 e aggiungi il polling manuale
```

### **I dati vengono salvati ma non caricati**
```
CAUSA: Problema con l'ID utente
SOLUZIONE:
1. Apri Console (F12)
2. Esegui: localStorage.clear()
3. Ricarica la pagina
4. Fai login di nuovo
```

---

## 📊 **Debug Avanzato**

### Controlla se il player ha l'API corretta:

Apri la Console (F12) e esegui:
```javascript
// Dopo aver avviato un video
console.log('Client:', window.vixsrcClient);
console.log('Player:', window.vixsrcClient?.player);
console.log('Current Time:', window.vixsrcClient?.player?.currentTime);
console.log('Duration:', window.vixsrcClient?.player?.duration);
```

Se vedi `undefined` → Il player VixSrc non espone l'API standard del video HTML5

### Soluzione alternativa - Salvataggio manuale:

Se nulla funziona, aggiungi un pulsante per salvare manualmente il progresso:

In `VixSrcPlayer.jsx`, aggiungi prima del return:
```javascript
const handleManualSave = () => {
  const time = prompt('A che minuto sei arrivato? (in secondi)');
  if (time) {
    setCurrentTime(parseInt(time));
    saveCurrentProgress();
  }
};
```

E nel JSX, dopo il player:
```jsx
<button onClick={handleManualSave}>
  Salva Progresso Manualmente
</button>
```

---

## ✅ **Checklist Finale**

Prima di dichiarare che "non funziona", verifica:

- [ ] Sei loggato con un account valido
- [ ] Firebase Authentication è abilitato (Email/Password)
- [ ] Le regole Firestore sono pubblicate correttamente
- [ ] Il video è in riproduzione (non in pausa)
- [ ] Sono passati almeno 10 secondi di riproduzione
- [ ] Hai controllato la Console (F12) per errori
- [ ] Hai verificato su Firebase Console che i dati ci siano

---

## 🆘 **Serve ancora aiuto?**

1. Apri la Console del Browser (F12)
2. Copia TUTTI i messaggi (Ctrl+A, Ctrl+C)
3. Condividi i log per debug più approfondito

Il problema più comune è che **VixSrc non emette eventi timeupdate**.
In questo caso, usa il polling manuale del **Passo 3**.
