# Redirectpedia

Sito statico di reindirizzamento, organizzato come una "mappa dei trasporti":
ogni categoria è una linea colorata. Si clicca una linea per aprire la lista
dei suoi link ("links" nell'interfaccia).

## File

- `index.html` — struttura e contenuti (le 7 categorie + i link)
- `style.css` — tutto lo stile, palette e tipografia
- `script.js` — la navigazione tra griglia, dettaglio e vista "non trovata" (basata sull'hash dell'URL)
- `favicon.svg` — l'icona del sito, ripresa dal quadratino colorato del logo

## Come funziona la navigazione

- La home mostra 7 tessere cliccabili, una per categoria.
- Cliccandone una si apre il pannello con l'elenco dei link di quella categoria
  e appare un tasto "← Back to homepage".
- Ogni categoria ha un proprio URL diretto: `tuosito.it/#str` apre subito
  "Streaming", `#ani` apre "Anime", ecc. Puoi quindi condividere il link a
  una singola categoria, non solo alla home.
- Se l'hash nell'URL non corrisponde a nessuna categoria (es. `#xyz`), il sito
  mostra una piccola pagina "This line doesn't exist" invece di reindirizzare
  silenziosamente alla home.
- Funziona anche il tasto "indietro" del browser.
- Se JavaScript è disattivato, la pagina mostra comunque tutti i link di
  tutte le categorie in sequenza (nessun contenuto viene perso).

## Come pubblicarlo su GitHub Pages (gratis)

1. Crea un nuovo repository su GitHub, es. `redirectpedia`.
2. Carica dentro questi tre file (`index.html`, `style.css`, `script.js`),
   mantenendoli nella cartella principale (root) del repository.
3. Vai su **Settings → Pages** del repository.
4. In "Source" seleziona il branch `main` e la cartella `/ (root)`, poi salva.
5. Dopo un paio di minuti il sito sarà online all'indirizzo:
   `https://<tuo-nome-utente>.github.io/redirectpedia/`

Se vuoi un dominio tuo (es. `redirectpedia.it`), puoi collegarlo da
Settings → Pages → Custom domain: GitHub Pages resta comunque gratuito.

## Come attivare la donazione PayPal

Nel file `index.html` ci sono **due link** che puntano a PayPal, entrambi con
lo stesso URL segnaposto da sostituire:

- il pulsante `.donate-pill` in alto nell'header ("Sostieni Redirectpedia")
- il link `.footer-donate` in fondo alla pagina ("Offrimi un caffè su PayPal")

Cerca `REPLACE_WITH_YOUR_ID` in entrambi i punti e sostituiscilo con il tuo
link PayPal reale. Hai due opzioni:

1. **Link semplice (più veloce da configurare)**: usa `https://paypal.me/TuoNomeUtente`
   — basta creare un account PayPal.me su [paypal.me](https://www.paypal.me).
2. **Pulsante "Dona" ufficiale**: su [paypal.com/donate](https://www.paypal.com/donate/buttons)
   puoi generare un `hosted_button_id` associato al tuo account, da usare
   nell'URL già presente nel codice (`?hosted_button_id=...`). Questa opzione
   dà accesso a statistiche di donazione più dettagliate.

Entrambi i link aprono PayPal in una nuova scheda (`target="_blank"`), così
chi dona non perde la pagina di Redirectpedia.

## Come modificare i link di una categoria

Ogni categoria ha due punti da aggiornare in `index.html`:

1. La tessera nella griglia (dentro `#tilesView`) — di solito non serve
   toccarla, il conteggio "N links" si aggiorna da solo via JavaScript.
2. Il pannello dettaglio corrispondente (dentro `#detailView`), blocco
   `<div class="detail-panel" data-line="...">`. Lì trovi la lista
   `<ul class="stop-list">`: ogni `<li class="stop">` è un link.

Per aggiungere un link, copia una riga esistente e cambia `href` e testo:

```html
<li class="stop"><a href="https://esempio.com" target="_blank" rel="noopener">Nome del sito<span class="stop-arrow">→</span></a></li>
```

Ho lasciato dei link di esempio (servizi noti e legali) in ogni categoria:
sostituiscili pure con quelli che vuoi tu.

## Aggiungere una nuova categoria (linea)

Serve toccare tre punti:

1. **Colore linea** in `style.css`, sotto `:root` — aggiungi una variabile
   `--line-xxx: #......;` e ripeti per il nuovo codice le regole già presenti
   per le altre linee (`.tile[data-line="xxx"]`, `.detail-panel[data-line="xxx"]`, ecc.).
2. **Tessera** in `index.html` dentro `.tiles-grid`, duplicando un blocco
   `<a class="tile" href="#xxx" data-line="xxx">...</a>` esistente.
3. **Pannello dettaglio** dentro `#detailView`, duplicando un blocco
   `<div class="detail-panel" data-line="xxx">...</div>` esistente.

Non serve toccare `script.js`: legge automaticamente tutte le linee presenti
nell'HTML.
