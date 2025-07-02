// Gestionale completo esteso - Clienti, Impianti, Magazzino, Prenotazioni, Contabilità, Personale
import React, { useState, useEffect } from "react";
import "./styles.css";

const datiClientiFinti = [
  {
    id: 1,
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@email.it",
    telefono: "3331234567",
    indirizzo: "Via Roma 1, Milano",
    note: "Cliente storico",
  },
  {
    id: 2,
    nome: "Luigi",
    cognome: "Verdi",
    email: "luigi.verdi@email.it",
    telefono: "3339876543",
    indirizzo: "Via Napoli 10, Torino",
    note: "Nuovo cliente",
  },
];

const datiImpiantiFinti = [
  {
    id: 1,
    clienteId: 1,
    tipo: "Fotovoltaico",
    dataInstallazione: "2022-03-15",
    conformita: "Doc123",
  },
  {
    id: 2,
    clienteId: 2,
    tipo: "Solare Termico",
    dataInstallazione: "2023-07-10",
    conformita: "Doc456",
  },
];

const datiMagazzinoFinti = [
  {
    id: 1,
    nomeArticolo: "Pannello 300W",
    codice: "P300W",
    prezzo: 150,
    quantita: 25,
  },
  {
    id: 2,
    nomeArticolo: "Inverter 5kW",
    codice: "INV5000",
    prezzo: 400,
    quantita: 10,
  },
];

const datiPrenotazioniFinti = [
  { id: 1, clienteId: 1, descrizione: "Controllo annuale", data: "2024-12-10" },
];

const datiContabilitaFinti = [
  {
    id: 1,
    clienteId: 1,
    importo: 500,
    data: "2024-01-15",
    tipo: "fattura",
    stato: "pagato",
  },
  {
    id: 2,
    clienteId: 2,
    importo: 300,
    data: "2024-02-10",
    tipo: "fattura",
    stato: "da pagare",
  },
];

const datiPersonaleFinti = [
  {
    id: 1,
    nome: "Anna",
    cognome: "Bianchi",
    ruolo: "Tecnico",
    email: "anna@azienda.it",
  },
  {
    id: 2,
    nome: "Paolo",
    cognome: "Neri",
    ruolo: "Amministrazione",
    email: "paolo@azienda.it",
  },
];

export default function App() {
  const [clienti, setClienti] = useState([]);
  const [impianti, setImpianti] = useState([]);
  const [magazzino, setMagazzino] = useState([]);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [contabilita, setContabilita] = useState([]);
  const [personale, setPersonale] = useState([]);
  const [search, setSearch] = useState("");
  const [nuovoCliente, setNuovoCliente] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    indirizzo: "",
    note: "",
  });
  const [modificaId, setModificaId] = useState(null);

  useEffect(() => {
    const storedClienti = localStorage.getItem("clienti");
    const storedImpianti = localStorage.getItem("impianti");
    const storedMagazzino = localStorage.getItem("magazzino");
    const storedPrenotazioni = localStorage.getItem("prenotazioni");
    const storedContabilita = localStorage.getItem("contabilita");
    const storedPersonale = localStorage.getItem("personale");

    setClienti(storedClienti ? JSON.parse(storedClienti) : datiClientiFinti);
    setImpianti(
      storedImpianti ? JSON.parse(storedImpianti) : datiImpiantiFinti
    );
    setMagazzino(
      storedMagazzino ? JSON.parse(storedMagazzino) : datiMagazzinoFinti
    );
    setPrenotazioni(
      storedPrenotazioni
        ? JSON.parse(storedPrenotazioni)
        : datiPrenotazioniFinti
    );
    setContabilita(
      storedContabilita ? JSON.parse(storedContabilita) : datiContabilitaFinti
    );
    setPersonale(
      storedPersonale ? JSON.parse(storedPersonale) : datiPersonaleFinti
    );
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuovoCliente({ ...nuovoCliente, [name]: value });
  };

  const salvaCliente = () => {
    if (!nuovoCliente.nome || !nuovoCliente.cognome) return;
    if (modificaId !== null) {
      const aggiornato = clienti.map((c) =>
        c.id === modificaId ? { ...nuovoCliente, id: modificaId } : c
      );
      setClienti(aggiornato);
      localStorage.setItem("clienti", JSON.stringify(aggiornato));
      setModificaId(null);
    } else {
      const nuovo = { ...nuovoCliente, id: Date.now() };
      const aggiornato = [...clienti, nuovo];
      setClienti(aggiornato);
      localStorage.setItem("clienti", JSON.stringify(aggiornato));
    }
    setNuovoCliente({
      nome: "",
      cognome: "",
      email: "",
      telefono: "",
      indirizzo: "",
      note: "",
    });
  };

  const modificaCliente = (cliente) => {
    setNuovoCliente({ ...cliente });
    setModificaId(cliente.id);
  };

  const eliminaCliente = (id) => {
    if (window.confirm("Eliminare il cliente?")) {
      const aggiornato = clienti.filter((c) => c.id !== id);
      setClienti(aggiornato);
      localStorage.setItem("clienti", JSON.stringify(aggiornato));
      const nuoviImpianti = impianti.filter((i) => i.clienteId !== id);
      setImpianti(nuoviImpianti);
      localStorage.setItem("impianti", JSON.stringify(nuoviImpianti));
      const nuovePrenotazioni = prenotazioni.filter((p) => p.clienteId !== id);
      setPrenotazioni(nuovePrenotazioni);
      localStorage.setItem("prenotazioni", JSON.stringify(nuovePrenotazioni));
      const nuovaContabilita = contabilita.filter((f) => f.clienteId !== id);
      setContabilita(nuovaContabilita);
      localStorage.setItem("contabilita", JSON.stringify(nuovaContabilita));
    }
  };

  const clientiFiltrati = clienti.filter((c) =>
    `${c.nome} ${c.cognome}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Gestionale Completo</h1>

      <input
        type="text"
        placeholder="Cerca cliente..."
        value={search}
        onChange={handleSearchChange}
        className="search-input"
      />

      <div className="form">
        <h2>{modificaId ? "Modifica Cliente" : "Aggiungi Cliente"}</h2>
        <input
          name="nome"
          placeholder="Nome"
          value={nuovoCliente.nome}
          onChange={handleInputChange}
        />
        <input
          name="cognome"
          placeholder="Cognome"
          value={nuovoCliente.cognome}
          onChange={handleInputChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={nuovoCliente.email}
          onChange={handleInputChange}
        />
        <input
          name="telefono"
          placeholder="Telefono"
          value={nuovoCliente.telefono}
          onChange={handleInputChange}
        />
        <input
          name="indirizzo"
          placeholder="Indirizzo"
          value={nuovoCliente.indirizzo}
          onChange={handleInputChange}
        />
        <textarea
          name="note"
          placeholder="Note"
          value={nuovoCliente.note}
          onChange={handleInputChange}
        ></textarea>
        <button onClick={salvaCliente}>
          {modificaId ? "Salva Modifiche" : "Aggiungi"}
        </button>
      </div>

      <h2>Clienti</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Indirizzo</th>
            <th>Note</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {clientiFiltrati.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nome}</td>
              <td>{c.cognome}</td>
              <td>{c.email}</td>
              <td>{c.telefono}</td>
              <td>{c.indirizzo}</td>
              <td>{c.note}</td>
              <td>
                <button onClick={() => modificaCliente(c)}>Modifica</button>
                <button onClick={() => eliminaCliente(c.id)}>Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Impianti</h2>
      <div className="form">
        <h3>Aggiungi Impianto</h3>
        <select id="clienteIdImpianto">
          {clienti.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} {c.cognome}
            </option>
          ))}
        </select>
        <input id="tipoImpianto" placeholder="Tipo" />
        <input id="dataInstallazione" type="date" />
        <input id="conformita" placeholder="Dichiarazione di conformità" />
        <button
          onClick={() => {
            const id = Date.now();
            const clienteId = parseInt(
              document.getElementById("clienteIdImpianto").value
            );
            const tipo = document.getElementById("tipoImpianto").value;
            const data = document.getElementById("dataInstallazione").value;
            const conformita = document.getElementById("conformita").value;
            const nuovo = {
              id,
              clienteId,
              tipo,
              dataInstallazione: data,
              conformita,
            };
            const aggiornato = [...impianti, nuovo];
            setImpianti(aggiornato);
            localStorage.setItem("impianti", JSON.stringify(aggiornato));
          }}
        >
          Aggiungi Impianto
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Conformità</th>
          </tr>
        </thead>
        <tbody>
          {impianti.map((i) => {
            const cliente = clienti.find((c) => c.id === i.clienteId);
            return (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{cliente ? cliente.nome + " " + cliente.cognome : "-"}</td>
                <td>{i.tipo}</td>
                <td>{i.dataInstallazione}</td>
                <td>{i.conformita}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Magazzino</h2>
      <div className="form">
        <h3>Aggiungi Articolo Magazzino</h3>
        <input id="nomeArticolo" placeholder="Nome articolo" />
        <input id="codiceArticolo" placeholder="Codice" />
        <input id="prezzoArticolo" placeholder="Prezzo" type="number" />
        <input id="quantitaArticolo" placeholder="Quantità" type="number" />
        <button
          onClick={() => {
            const id = Date.now();
            const nomeArticolo = document.getElementById("nomeArticolo").value;
            const codice = document.getElementById("codiceArticolo").value;
            const prezzo = parseFloat(
              document.getElementById("prezzoArticolo").value
            );
            const quantita = parseInt(
              document.getElementById("quantitaArticolo").value
            );
            const nuovo = { id, nomeArticolo, codice, prezzo, quantita };
            const aggiornato = [...magazzino, nuovo];
            setMagazzino(aggiornato);
            localStorage.setItem("magazzino", JSON.stringify(aggiornato));
          }}
        >
          Aggiungi Articolo
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Articolo</th>
            <th>Codice</th>
            <th>Prezzo (€)</th>
            <th>Quantità</th>
          </tr>
        </thead>
        <tbody>
          {magazzino.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.nomeArticolo}</td>
              <td>{a.codice}</td>
              <td>{a.prezzo}</td>
              <td>{a.quantita}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Prenotazioni</h2>
      <div className="form">
        <h3>Nuova Prenotazione</h3>
        <select id="clienteIdPrenotazione">
          {clienti.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} {c.cognome}
            </option>
          ))}
        </select>
        <input id="descrizionePrenotazione" placeholder="Descrizione" />
        <input id="dataPrenotazione" type="date" />
        <button
          onClick={() => {
            const id = Date.now();
            const clienteId = parseInt(
              document.getElementById("clienteIdPrenotazione").value
            );
            const descrizione = document.getElementById(
              "descrizionePrenotazione"
            ).value;
            const data = document.getElementById("dataPrenotazione").value;
            const nuova = { id, clienteId, descrizione, data };
            const aggiornato = [...prenotazioni, nuova];
            setPrenotazioni(aggiornato);
            localStorage.setItem("prenotazioni", JSON.stringify(aggiornato));
          }}
        >
          Aggiungi Prenotazione
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Descrizione</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {prenotazioni.map((p) => {
            const cliente = clienti.find((c) => c.id === p.clienteId);
            return (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{cliente ? cliente.nome + " " + cliente.cognome : "-"}</td>
                <td>{p.descrizione}</td>
                <td>{p.data}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Contabilità</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Importo (€)</th>
            <th>Data</th>
            <th>Tipo</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          {contabilita.map((f) => {
            const cliente = clienti.find((c) => c.id === f.clienteId);
            return (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{cliente ? cliente.nome + " " + cliente.cognome : "-"}</td>
                <td>{f.importo}</td>
                <td>{f.data}</td>
                <td>{f.tipo}</td>
                <td>{f.stato}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Personale</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Ruolo</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {personale.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>{p.cognome}</td>
              <td>{p.ruolo}</td>
              <td>{p.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
