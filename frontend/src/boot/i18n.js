import { createI18n } from 'vue-i18n';
import messages from '../i18n';

export default ({ app }) => {
  const i18n = createI18n({
    locale: 'de-DE',
    legacy: false,
    globalInjection: true,
    messages
  });

  app.use(i18n);
};
