import { defineStore } from 'pinia';
import axios from 'axios';
import { date } from 'quasar';

const URL_API = process.env.DEV ? 'http://localhost:8080/api/v0' : '/api/v0';
const POLL_INTERVAL_MS = 2000;
const DELAYED_POLL_MS = 15000;
const GET_ONLY_CURRENT_ENTRIES = true;

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
  }
  return entries;
}

async function poll(force = false) {
  if (!force && !isPollAllowed) {
    return null;
  }
  duringPoll = !force;
  const params = GET_ONLY_CURRENT_ENTRIES ? { fromDate: convertRealDateToDB(new Date()) } : {};
  const response = await axios.get(`${URL_API}/entry`, { params });
  duringPoll = false;
  if (!response) {
    return null;
  }
  return response.data.sort((a, b) => a.date > b.date ? 1 : -1);
}

export const apiStore = () => {
  const innerStore = defineStore('counter', {
    state: () => {
      return {
        entries: [],
        entriesStamp: [0],
        currentErrorMessage: ''
      };
    },

    actions: {
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
    }
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
