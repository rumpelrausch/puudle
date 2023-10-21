import { createI18n } from 'vue-i18n';
import { Quasar } from 'quasar';
import messages from '../i18n';

export default ({ app }) => {
  const i18n = createI18n({
    locale: Quasar.lang.getLocale(),
    legacy: false,
    globalInjection: true,
    messages
  });

  app.use(i18n);
};
