<template>
  <q-ajax-bar ref="bar" position="bottom" :hijack-filter="store.getHijackFilter"/>
  <router-view />
</template>

<script>
import { ref } from 'vue';
import { apiStore } from 'stores/apiStore';

export default {
  setup() {
    const store = apiStore();
    const bar = ref(null);

    return {
      store,
      bar
    };
  }
};
</script>
