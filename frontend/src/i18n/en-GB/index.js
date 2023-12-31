export default {
  slogan: 'The appointment planner',
  dateFormatPretty: 'dddd, D MMM YYYY HH:mm',
  yesterday: 'yesterday',
  today: 'today',
  tomorrow: 'tomorrow',
  inDays: 'in %s days',
  daysAgo: '%s days ago',
  userName: 'Name',
  tabHint: '(accept with TAB or tap+hold)',
  subscriptionStates: {
    suggested: 'suggested',
    confirmed: 'confirmed',
    rejected: 'rejected',
    maybe: 'maybe'
  },
  save: 'save',
  titleAddEvent: 'Create an invitation',
  eventName: 'What / where?',
  minCharacters: 'Please enter at least %s characters.',
  pleaseChoose: 'Please make a choice',
  comment: 'Comment',
  deleteEntry: 'Delete the whole appointment?',
  deleteSubscription: 'Delete whole entry for "%s" ?',
  ok: 'OK',
  cancel: 'Cancel',
  date: {
    days: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    daysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    firstDayOfWeek: 0,
    format24h: false,
    pluralDay: 'days'
  },
  eventSuggestions: [
    'Boulder session',
    'Climbing session',
    'Powwow'
  ],
  errorMessages: {
    genericApiError: 'API error',
    entryAlreadyExists: 'Such an appointment already exists.',
    subscriptionAlreadyExists: 'Such an entry already exists.'
  }
};
