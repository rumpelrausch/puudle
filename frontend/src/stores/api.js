import { defineStore } from 'pinia';
import axios from 'axios';

const URL_API = 'http://localhost:8080/api/v0';

export const apiStore = defineStore('counter', {
  state: () => ({
    entries: []
    //   {
    //     _id: '1234',
    //     name: 'Bouldern / FLASHH',
    //     date: '2023-10-17 17:00'
    //   },
    //   {
    //     _id: '1234',
    //     name: 'Bouldern / FLASHH',
    //     date: '2023-10-16 11:00'
    //   }
    // ]
  }),

  getters: {
  },

  actions: {
    async fetchEntries() {
      const response = await axios.get(`${URL_API}/entry`);
      this.entries = response.data
        .sort((a, b) => a.date > b.date ? 1 : -1);
    },
    add() {
      this.entries.push({
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      });
    }
  }
});
