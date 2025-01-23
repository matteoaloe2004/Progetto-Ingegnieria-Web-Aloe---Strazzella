-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Gen 20, 2025 alle 14:25
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `centro_sportivo`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `campi`
--

CREATE TABLE `campi` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `descrizione` text DEFAULT NULL,
  `costo_ora` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `campi`
--

INSERT INTO `campi` (`id`, `nome`, `tipo`, `descrizione`, `costo_ora`) VALUES
(1, 'Campo da Calcio 1', 'Calcio', 'Campo di calcio da 8 a 9 giocatori in erba sintetica.', 50.00),
(2, 'Campo Tennis A', 'Tennis', 'Campo da tennis con illuminazione notturna.', 25.00),
(3, 'Palestra Indoor', 'Palestra', 'Spazio indoor attrezzato per attività multiple.', 30.00),
(4, 'Piscina Estiva', 'Piscina', 'Piscina all’aperto con vista panoramica.', 40.00),
(5, 'Campo Basket', 'Basket', 'Campo regolamentare con parquet.', 35.00),
(6, 'Campo Pallavolo', 'Pallavolo', 'Campo da pallavolo con parquet.', 30.00);

-- --------------------------------------------------------

--
-- Struttura della tabella `prenotazioni`
--

CREATE TABLE `prenotazioni` (
  `id` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `utente_id` int(11) NOT NULL,
  `campo_id` int(11) NOT NULL,
  `data_prenotazione` date NOT NULL,
  `orario_inizio` time NOT NULL,
  `orario_fine` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `prenotazioni`
--

INSERT INTO `prenotazioni` (`id`, `Username`, `utente_id`, `campo_id`, `data_prenotazione`, `orario_inizio`, `orario_fine`) VALUES
(1, 'MarioRossi01', 1, 1, '2025-01-18', '10:00:00', '12:00:00'),
(2, 'GiuliaVerdi02', 2, 2, '2025-01-18', '14:00:00', '15:30:00'),
(3, 'MartinaRossi03', 3, 3, '2025-01-19', '16:00:00', '18:00:00'),
(4, 'GianlucaMazzini04', 4, 4, '2025-01-20', '09:00:00', '10:30:00'),
(5, 'FedericoGialli06', 5, 5, '2025-01-21', '18:00:00', '20:00:00'),
(6, 'MarcoNeri07', 1, 2, '2025-01-22', '11:00:00', '12:30:00'),
(7, 'LucaGrigi08', 3, 1, '2025-01-22', '13:00:00', '15:00:00');

-- --------------------------------------------------------

--
-- Struttura della tabella `utenti`
--

CREATE TABLE `utenti` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `data_creazione` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `utenti`
--

INSERT INTO `utenti` (`id`, `username`, `nome`, `cognome`, `password`, `email`, `data_creazione`) VALUES
(1, 'mario.rossi', 'Mario', 'Rossi', 'password123', 'mario.rossi@gmail.com', '2025-01-17 14:20:00'),
(2, 'lucia.verdi', 'Lucia', 'Verdi', 'password123', 'lucia.verdi@gmail.com', '2025-01-17 14:20:00'),
(3, 'giovanni.bianchi', 'Giovanni', 'Bianchi', 'password123', 'giovanni.bianchi@gmail.com', '2025-01-17 14:20:00'),
(4, 'anna.neri', 'Anna', 'Neri', 'password123', 'anna.neri@gmail.com', '2025-01-17 14:20:00'),
(5, 'paolo.gialli', 'Paolo', 'Gialli', 'password123', 'paolo.gialli@gmail.com', '2025-01-17 14:20:00'),
(20, 'HaloWassupp', 'matteo', 'Aloe', '$2b$10$/MuXO3ZxBUmGcFgYIuhhM.8Xqdf3GB.iHCetz7t1k0L/sLYXq7ARK', 'matteoaloe2004@libero.it', '2025-01-19 16:11:22'),
(28, 'matteoAloe', 'matteo', 'marchiello', '$2b$10$XDwVaODB8xXIyfiQPlYUk.SwMawFuVdNmG7x7/8SuDYSPyxZAASqe', 'mgmt.halobeats@gmail.com', '2025-01-20 13:23:40');

-- Creazione della tabella per l'archivio storico delle prenotazioni
CREATE TABLE `prenotazioni_archivio` (
  `id` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `utente_id` int(11) NOT NULL,
  `campo_id` int(11) NOT NULL,
  `data_prenotazione` date NOT NULL,
  `orario_inizio` time NOT NULL,
  `orario_fine` time NOT NULL,
  `data_eliminazione` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Indici per la tabella `prenotazioni_archivio`
ALTER TABLE `prenotazioni_archivio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utente_id` (`utente_id`),
  ADD KEY `campo_id` (`campo_id`);

-- AUTO_INCREMENT per la tabella `prenotazioni_archivio`
ALTER TABLE `prenotazioni_archivio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Modifica della tabella `prenotazioni` per aggiungere un trigger
DELIMITER //
CREATE TRIGGER `before_delete_prenotazioni`
BEFORE DELETE ON `prenotazioni` FOR EACH ROW
BEGIN
  INSERT INTO `prenotazioni_archivio` (`id`, `Username`, `utente_id`, `campo_id`, `data_prenotazione`, `orario_inizio`, `orario_fine`)
  VALUES (OLD.`id`, OLD.`Username`, OLD.`utente_id`, OLD.`campo_id`, OLD.`data_prenotazione`, OLD.`orario_inizio`, OLD.`orario_fine`);
END//
DELIMITER ;

--
-- Indici per le tabelle `campi`
--
ALTER TABLE `campi`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `prenotazioni`
--
ALTER TABLE `prenotazioni`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utente_id` (`utente_id`),
  ADD KEY `campo_id` (`campo_id`);

--
-- Indici per le tabelle `utenti`
--
ALTER TABLE `utenti`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `campi`
--
ALTER TABLE `campi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT per la tabella `prenotazioni`
--
ALTER TABLE `prenotazioni`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT per la tabella `utenti`
--
ALTER TABLE `utenti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `prenotazioni`
--
ALTER TABLE `prenotazioni`
  ADD CONSTRAINT `prenotazioni_ibfk_1` FOREIGN KEY (`utente_id`) REFERENCES `utenti` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prenotazioni_ibfk_2` FOREIGN KEY (`campo_id`) REFERENCES `campi` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
