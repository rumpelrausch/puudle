<template>
  <q-select v-model="locale" :options="localeOptions" dense borderless emit-value map-options options-dense
    hide-bottom-space rounded />
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { locale } = useI18n({ useScope: 'global' });

    return {
      locale,
      localeOptions: [
        { value: 'en-GB', label: 'English (GB)' },
        { value: 'en-US', label: 'English (US)' },
        { value: 'de', label: 'Deutsch' }
      ]
    };
  }
};
</script>
