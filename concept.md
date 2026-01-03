Es soll eine PWA entwickelt werden, die vom generellen Design her sich an der bereits existierenden "day of year" App orientieren soll. Die Dateien der App "day of year" werden unten aufgeführt als Template. Alle Funktionen und Elemente, die nicht für die hier beschriebene App notwendig sind, sollen gelöscht werden. Die neue App heißt "10k challenge". Bitte das auch in den Dateien ändern. Die Icons beginnen mit tkc-icon statt doy-icon.

Die PWA besteht grundlegend aus 3 Tabs:
- Heute
- Statistik
- Settings

Der Tab Settings beinhaltet folgende Elemente und Funktionalitäten:

- Initial einen Button mit einem Plus-Zeichen
    * Wird der Button betätigt, erscheint ein PopUp mit folgenden Elementen:
    * ein Eingabefeld für den Namen einer Übung
    * rechts daneben ein Zählrad für das Gewicht der Übung als Ganzzahl größer 0 (default 1)
    * rechts daneben ein Dropdown für die Auswahl der Einheit der Übung [Wdh, Minuten, km] (default ist Wdh)
    * Save-Button zum speichern der Übung und ihrem Gewicht, danach schließen des Popups
    * Cancel-Button zum Abbruch, danach schließen des Popups ohne speichern
- alle gespeicherten Übungen werden im Settings-Tab untereinander angezeigt
    * links der Name der Übung, rechts das Gewicht
    * unter allen gespeicherten Übungen ist dann der Button mit dem Plus-Zeichen zum Hinzufügen einer Übung
- rechts neben jeder Übungszeile wird ein kleiner Änderungs-Button mit Stift-Icon angezeigt
    * klickt man darauf, öffnet sich ein Popup wie beim Erstellen einer Übung
    * im Feld für den Übungsnamen ist der existierende Name der Übung eingetragen und kann geändert werden
    * im Feld für das Gewicht steht das bisherig eingetragene Gewicht und kann geändert werden
    * im Dropdown für die Einheit ist die der Übung zugewiesene Einheit ausgewählt und kann geändert werden
    * Save-Button zum speichern der Übung und ihrem Gewicht, danach schließen des Popups
    * Cancel-Button zum Abbruch, danach schließen des Popups ohne speichern und die bestehende Einstellung der Übung bleibt bestehen
- rechts neben dem Änderungs-Button ist noch ein Lösch-Button mit rotem Kreuz drauf
    * klickt man darauf, erscheint ein Popup, in dem die Infos der Übung geschrieben sind
    * darüber die Frage, ob diese Übung gelöscht werden soll
    * Confirm-Button löscht die Übung aus der Datenstruktur
    * Cancel-Button zum Abbruch, danach schließen des Popups ohne löschen und die bestehende Einstellung der Übung bleibt
- Die Übungen müssen für einen sinnvollen Offline-Betrieb auf dem Gerät des Nutzers gespeichert werden
    * jede Übung hat einen Namen, ein Gewicht und eine Einheit


Der Tab Heute beinhaltet folgende Elemente und Funktionalitäten:

- Gesamtzahl zum Stand der Challenge im aktuellen Jahr ganz oben
- Eine Auswahl des Datums
    * default ist immer das aktuelle Datum
    * Auswahl von Tag, Monat, Jahr möglich
- Für jede in den Settings definierte Übung ist eine Kombination aus Übungsname als Label und dem Eingabefeld für den Zahlenwert vorhanden
    * manuelles Eintragen der Zahl möglich möglich
    * Auswahl über Zählrad möglich
- Ein Bestätigungsbutton
    * wird dieser gedrückt, werden die eingetragenen Werte für den aktuellen Tag gespeichert
    * falls schon Werte für den aktuellen Tag existieren, werden die neuen Werte zu den bestehenden addiert
    * die Tage werden nach Jahr zusammengefasst
    * entsprechend der Gewichte der einzelnen Übungen wird der Gesamtwert der Challenge für das aktuelle Jahr berechnet und angezeigt


Der Tab Statistik beinhaltet folgende Elemente und Funktionalitäten:

- Ganz oben ist die Auswahl des Jahres über ein Dropdown möglich
    * Es werden nur Jahre angezeigt, die auch in dem gespeicherten Objekt vorkommen
- Dann wird der aktuelle Gesamtwert für das ausgewählte Jahr angezeigt, welcher sich wie folgt berechnet:
    * Es ist die Summe über die Werte der einzelnen Übungen
    * Der Wert einer Übung berechnet sich aus der absolvierten Häufigkeit im aktuellen Jahr geteilt durch das Gewicht
    * Es werden nur ganzzahlige Gesamtwerte angezeigt
- Darunter soll ein Plot die einzelnen Werte veranschaulichen
    * eine Ansicht zeigt den Verlauf vom Anfang des Jahres bis zum letzten Eintrag des Jahres mit adaptierter y-Achse
    * eine Ansicht zeigt den Verlauf vom Anfang des Jahres bis zum letzten Eintrag des Jahres mit einem y-Achsen-Bereich 0-10000
    * Es wird immer der Verlauf der Gesamtpunktzahl deutlich hervorgehoben angezeigt
    * Zusätzlich kann man aktivieren, dass die Werte der einzelnen Übungen angezeigt werden (einmal roh als Verlauf der jeweiligen Einheit, einmal der Verlauf, wie sie zur Gesamtpunktzahl beitragen)
- Abschließend wird ein Kalender wie bei der Ursprungsapp angezeigt
    * rote Kreuze sind für im gespeicherten Objekt nicht vorkommende Tage, die schon vergangen sind, angezeigt
    * für Tage, an denen Einträge gemacht wurden, wird auf grünem Hintergrund die Zahl angezeigt, die an diesem Tag für den Gesamtwert hinzugekommen ist