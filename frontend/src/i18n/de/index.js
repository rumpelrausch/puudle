export default {
  mainTitle: 'Puudle: Der Verabredungsplaner',
  dateFormatPretty: 'dddd DD.MM.YY - HH:mm',
  today: 'heute',
  tomorrow: 'morgen',
  inDays: 'in %s Tagen',
  userName: 'Name',
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
  deleteSubscription: 'Eintrag für "%s" löschen?',
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
    'Klettern: DAV',
    'Treffen: '
  ],
  errorMessages: {
    genericApiError: 'API Fehler',
    entryAlreadyExists: 'Solch eine Einladung existiert bereits.',
    subscriptionAlreadyExists: 'Solch ein Eintrag existiert bereits.'
  }
};
