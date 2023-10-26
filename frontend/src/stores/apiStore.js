import { defineStore } from 'pinia';
import axios from 'axios';
import { date, useQuasar } from 'quasar';
import { ref, watch } from 'vue';

const STORE_ID = 'puudle-4903947820978';
const URL_API = process.env.DEV ? 'http://localhost:8080/api/v0' : '/api/v0';

let POLL_INTERVAL_MS;
let DELAYED_POLL_MS;
let GET_ONLY_CURRENT_ENTRIES;

let isPollAllowed = true;
let updateTimer;
let pollDelayTimer;
let duringPoll = false;

function convertRealDateToDB(realDate) {
  return date.formatDate(realDate, 'YYYY-MM-DD HH:mm');
}

function enrichEntries(entries) {
  for (const entry of entries) {
    entry.numOfConfirmed = entry.subscriptions.filter((subscription) => {
      return subscription.state === 'confirmed';
    }).length;
    entry.subscriptions = entry.subscriptions
      .sort((subscription) => subscription.state === 'confirmed' ? -1 : 1);
  }
  return entries;
}

async function poll(force = false) {
  if (!force && !isPollAllowed) {
    return null;
  }
  duringPoll = !force;
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  const params = GET_ONLY_CURRENT_ENTRIES ? { fromDate: convertRealDateToDB(today) } : {};
  const response = await axios.get(`${URL_API}/entry`, { params });
  duringPoll = false;
  if (!response) {
    return null;
  }
  return response.data.sort((a, b) => a.date > b.date ? 1 : -1);
}

function getLocalSettings() {
  let localSettings;
  try {
    localSettings = JSON.parse(localStorage.getItem(STORE_ID));
  } catch (error) {
  }
  if (!localSettings) {
    localSettings = {
      locale: null
    };
  }
  return localSettings;
}

export const apiStore = () => {
  const innerStore = defineStore(STORE_ID, () => {
    const env = useQuasar().config.customEnv;
    POLL_INTERVAL_MS = env.POLL_INTERVAL_MS || 2000;
    DELAYED_POLL_MS = env.DELAYED_POLL_MS || 15000;
    GET_ONLY_CURRENT_ENTRIES = !!env.GET_ONLY_CURRENT_ENTRIES;

    const entries = ref([]);
    const entriesStamp = ref([0]);
    const currentErrorMessage = ref('');
    const userSettings = ref(getLocalSettings());

    watch(userSettings, () => {
      localStorage.setItem(STORE_ID, JSON.stringify(userSettings.value));
    }, { deep: true });

    return {
      entries,
      entriesStamp,
      currentErrorMessage,
      userSettings,

      getHijackFilter() {
        return !duringPoll;
      },

      startUpdate() {
        if (updateTimer) {
          return;
        }
        updateTimer = setInterval(this.fetchEntries, POLL_INTERVAL_MS);
      },

      suspendUpdate() {
        isPollAllowed = false;
        if (pollDelayTimer) {
          clearTimeout(pollDelayTimer);
        }
        pollDelayTimer = setTimeout(() => { isPollAllowed = true; }, DELAYED_POLL_MS);
      },

      resumeUpdate() {
        if (pollDelayTimer) {
          clearTimeout(pollDelayTimer);
        }
        isPollAllowed = true;
      },

      updateStamp() {
        this.entriesStamp[0] = new Date().getTime();
      },

      async fetchEntries(force = false) {
        const entries = await poll(force);
        if (!entries) {
          return;
        }
        this.entries = enrichEntries(entries);
        this.updateStamp();
      },

      getEntryById(entryId) {
        return this.entries.find((entry) => entry._id === entryId);
      },

      async addEntry(entryName, realDate) {
        const body = {
          type: 'entry',
          subscriptions: [],
          entryName,
          date: convertRealDateToDB(realDate)
        };
        const response = await axios.post(`${URL_API}/entry`, body);

        if (response.status === 409) {
          throw new Error('errorMessages.entryAlreadyExists');
        }

        await this.fetchEntries(true);
      },

      async deleteEntry(entryId) {
        const response = await axios.delete(`${URL_API}/entry/${entryId}`);

        if (response.status !== 200) {
          throw new Error('errorMessages.genericApiError');
        }

        await this.fetchEntries(true);
      },

      async addSubscription(entryId, subscription) {
        const response = await axios.post(`${URL_API}/entry/${entryId}/subscription`, subscription);

        if (response.status === 409) {
          throw new Error('errorMessages.entryAlreadyExists');
        }

        await this.fetchEntries(true);
        return this.getEntryById(entryId);
      },

      async updateSubscription(entryId, userName, subscription) {
        const response = await axios.patch(`${URL_API}/entry/${entryId}/subscription/${userName}`, {
          state: subscription.state,
          comment: subscription.comment
        });
        if (!response) {
          return null;
        }
        await this.fetchEntries(true);
      },

      async deleteSubscription(entryId, userName) {
        const response = await axios.delete(`${URL_API}/entry/${entryId}/subscription/${userName}`);
        if (!response) {
          return null;
        }
        await this.fetchEntries(true);
        return this.getEntryById(entryId);
      }
    };
  });

  const store = innerStore();
  axios.interceptors.response.use(function (response) {
    if (response) {
      store.$patch({ currentErrorMessage: '' });
    }
    return response;
  }, (error) => {
    store.$patch({ currentErrorMessage: error.message });
    return error.response;
  });

  store.fetchEntries(true);
  return store;
};
