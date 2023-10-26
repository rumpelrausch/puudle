import { apiStore } from 'stores/apiStore';
import { createI18n } from 'vue-i18n';
import { Quasar } from 'quasar';
import messages from '../i18n';
import { ref, watch } from 'vue';

export default ({ app }) => {
  const store = apiStore();
  const locale = ref(store.userSettings?.locale || Quasar.lang.getLocale());

  const i18n = createI18n({
    locale: locale.value,
    legacy: false,
    globalInjection: true,
    messages
  });

  watch(i18n.global.locale, (newLocale) => {
    store.userSettings.locale = newLocale;
  });

  app.use(i18n);
};
