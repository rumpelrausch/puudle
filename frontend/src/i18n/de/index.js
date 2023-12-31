export default {
  slogan: 'Der Verabredungsplaner',
  dateFormatPretty: 'dddd DD.MM.YY - HH:mm',
  yesterday: 'gestern',
  today: 'heute',
  tomorrow: 'morgen',
  inDays: 'in %s Tagen',
  daysAgo: 'vor %s Tagen',
  userName: 'Name',
  tabHint: '(mit TAB oder Festhalten übernehmen)',
  subscriptionStates: {
    suggested: 'vorgeschlagen',
    confirmed: 'zugesagt',
    rejected: 'abgesagt',
    maybe: 'vielleicht'
  },
  save: 'speichern',
  titleAddEvent: 'Einladung erstellen',
  eventName: 'Was / wo?',
  minCharacters: 'Bitte mindestens %s Zeichen eingeben.',
  pleaseChoose: 'Bitte auswählen',
  comment: 'Kommentar',
  deleteEntry: 'Gesamte Einladung löschen?',
  deleteSubscription: 'Gesamten Eintrag für "%s" löschen?',
  ok: 'OK',
  cancel: 'Abbrechen',
  date: {
    days: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    daysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Dez'.split('_'),
    firstDayOfWeek: 1,
    format24h: true,
    pluralDay: 'Tage'
  },
  eventSuggestions: [
    'Bouldern: FLASHH',
    'Klettern (mit Seil): DAV Kletterzentrum',
    'Treffen: '
  ],
  errorMessages: {
    genericApiError: 'API Fehler',
    entryAlreadyExists: 'Solch eine Einladung existiert bereits.',
    subscriptionAlreadyExists: 'Solch ein Eintrag existiert bereits.'
  }
};
