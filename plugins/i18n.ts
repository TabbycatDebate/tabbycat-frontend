import { createI18n } from 'vue-i18n';
import ar from '../locales/ar.json';
import ast from '../locales/ast.json';
import bg from '../locales/bg.json';
import bn from '../locales/bn.json';
import ca from '../locales/ca.json';
import cs from '../locales/cs.json';
import de from '../locales/de.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import he from '../locales/he.json';
import hi from '../locales/hi.json';
import id from '../locales/id.json';
import it from '../locales/it.json';
import ja from '../locales/ja.json';
import kk from '../locales/kk.json';
import ms from '../locales/ms.json';
import pt from '../locales/pt.json';
import ro from '../locales/ro.json';
import ru from '../locales/ru.json';
import tr from '../locales/tr.json';
import tzl from '../locales/tzl.json';
import vi from '../locales/vi.json';
import zh from '../locales/zh.json';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      ar,
      ast,
      bg,
      bn,
      ca,
      cs,
      de,
      en,
      es,
      fr,
      he,
      hi,
      id,
      it,
      ja,
      kk,
      ms,
      pt,
      ro,
      ru,
      tr,
      tzl,
      vi,
      zh,
    },
  });

  vueApp.use(i18n);
});
