<template>
  <q-banner v-if="store.currentErrorMessage.length > 0" class="bg-negative text-white">
    {{ store.currentErrorMessage }}
  </q-banner>
  <q-page class="vertical-top q-px-sm non-selectable">
    <eventTimeLine></eventTimeLine>
  </q-page>
</template>

<script>
import { apiStore } from 'stores/apiStore';
import eventTimeLine from '../components/eventTimeLine.vue';

export default {
  components: {
    eventTimeLine
  },
  setup() {
    return {
      store: apiStore()
    };
  }
};
</script>
