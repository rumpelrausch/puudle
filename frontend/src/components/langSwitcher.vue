<template>
  <q-select v-model="lang" :options="langOptions" dense borderless emit-value map-options options-dense hide-bottom-space
    rounded />
</template>

<script>
import { useQuasar } from 'quasar';
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import languages from 'quasar/lang/index.json';

const appLanguages = languages.filter(lang =>
  ['de', 'en-US'].includes(lang.isoName)
);

const langOptions = appLanguages.map(lang => ({
  label: lang.nativeName, value: lang.isoName
}));

export default {
  setup() {
    const $q = useQuasar();
    const lang = ref($q.lang.isoName);
    watch(lang, value => {
      // import(
      //   /* webpackInclude: /(de|en-US)\.js$/ */
      //   `quasar/lang/${value}.js`
      // ).then(lang => {
      //   $q.lang.set(lang.default);
      // });
      locale.value = value;
    });
    const { locale } = useI18n({ useScope: 'global' });
    lang.value = locale.value;

    return {
      lang,
      langOptions
    };
  }
};
</script>
