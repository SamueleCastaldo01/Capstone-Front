# Veyro - Flashcards e Appunti per Materie e Capitoli

Veyro è una web app sviluppata con **React.js** che ti permette di organizzare appunti e creare flashcards per ogni materia e capitolo di studio. Puoi facilmente aggiungere, modificare e visualizzare appunti, oltre a gestire le flashcards personalizzate con livelli di difficoltà per ottimizzare il tuo processo di apprendimento.

## Caratteristiche

### Homepage
La homepage è suddivisa in tre sezioni principali:
- **Crea una materia**: Puoi creare una nuova materia con un titolo e una copertura colorata.
- **I miei appunti**: Visualizza e accedi ai tuoi appunti per ogni materia e capitolo.
- **Flashcards**: Accedi alle flashcards per ogni materia per esercitarti e testare le tue conoscenze.

### Barra di Navigazione Laterale
La barra di navigazione laterale offre un menu con le seguenti sezioni:
- **Appunti**: Un dropdown che mostra tutte le materie con i rispettivi capitoli. Selezionando un capitolo, puoi accedere agli appunti specifici di quel capitolo.
  - **Editor di appunti**: Aggiungi o modifica appunti per ogni capitolo.
  - **Eliminazione capitolo**: Puoi eliminare un capitolo se non più necessario.
  - **Flashcards per il capitolo**: Seleziona il pulsante "Flashcard" per accedere alle domande relative a quel capitolo.
- **Materia**: Gestisci le materie.
  - **Aggiungi capitoli**: Puoi aggiungere nuovi capitoli alla materia.
  - **Accesso capitoli**: Accedi ai capitoli esistenti per aggiungere o visualizzare appunti.
  - **Flashcards per la materia**: Crea domande di flashcard per ogni materia.
  - **Eliminazione materia**: Elimina una materia (attenzione, questa azione è irreversibile).

### Gestione delle Flashcards
- Le flashcards sono suddivise per **difficoltà** (facile, media, difficile). Durante il test delle flashcards, la difficoltà influisce sul tempo di visualizzazione delle domande.
- Ogni domanda di flashcard può essere associata a una materia o un capitolo specifico.

### Autenticazione
- **Pagina di registrazione**: Registrati per iniziare a utilizzare Veyro.
- **Pagina di login**: Accedi per visualizzare i tuoi appunti e flashcards.
- **Il mio account**: Gestisci i tuoi dati anagrafici e l'immagine del profilo.

## Tecnologie Utilizzate

- **React.js**: Framework per la creazione dell'interfaccia utente.
- **React Router**: Gestione della navigazione tra le pagine.
- **Redux**: Gestione dello stato globale.
- **Spring**: Backend per l'autenticazione e il salvataggio dei dati. https://github.com/SamueleCastaldo01/Capstone-Back

## Come Iniziare

1. **Clonare il Repository**
   ```bash
   git clone https://github.com/tuo-username/veyro.git
   cd veyro
   npm install
   npm start
