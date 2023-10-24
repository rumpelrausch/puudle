<template>
  <q-btn color="positive" @click="showState = true" class="q-mt-sm" padding="sm" dense no-caps ripple>
    <q-icon name="library_add" />
    <q-separator vertical spaced color="white" />
    <div>
      {{ $t('titleAddEvent') }}
    </div>
  </q-btn>
  <q-dialog v-model="showState">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('titleAddEvent') }}</div>
        <q-space />
        <q-btn icon="bi-x-square" flat dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit">
          <div class="row">
            <div class="column q-mr-sm q-mb-sm">
              <q-select :model-value="myEvent.entryName" :label="$t('eventName')" :options="$tm('eventSuggestions')"
                lazy-rules :rules="[val => val && val.length >= MIN_ENTRY_NAME_LENGTH || nameTooShort]"
                @input-value="setEntryName" use-input fill-input hide-selected outlined dense stack-label>
              </q-select>
            </div>
            <div class="column">
              <q-input v-model="myEvent.date" outlined dense lazy-rules :rules="[val => true]">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="myEvent.date" :locale="myLocale" :mask="$t('dateFormatPretty')" emit-immediately
                        minimal>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup icon="bi-check2-square" color="primary" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="myEvent.date" :mask="$t('dateFormatPretty')" :format24h="myLocale.format24h"
                        :minute-options="[0, 15, 30, 45]">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup icon="bi-check2-square" color="primary" />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div>
            <q-btn icon="bi-floppy" type="submit" color="positive" dense ripple />
          </div>
        </q-form>
      </q-card-section>
      <q-banner v-if="errorMessage.length > 0" class="bg-negative text-white">
        {{ errorMessage }}
      </q-banner>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { date } from 'quasar';
import { apiStore } from 'stores/apiStore';

const MIN_ENTRY_NAME_LENGTH = 3;

export default {
  setup() {
    const store = apiStore();
    const { t, tm, locale } = useI18n();
    const showState = ref(false);
    const today = date.buildDate({ hours: 17, minutes: 0 });
    const myEvent = ref({
      entryName: '',
      date: null,
      get result() {
        return `${myEvent.value.date} ${myEvent.value.time}`;
      }
    });
    const errorMessage = ref('');

    function reset() {
      myEvent.value.entryName = '';
      myEvent.value.date = date.formatDate(today, t('dateFormatPretty'), tm('date'));
      errorMessage.value = '';
    }

    watch(showState, reset);
    watch(locale, reset);

    return {
      get myLocale() {
        return tm('date');
      },
      showState,
      myEvent,
      errorMessage,
      MIN_ENTRY_NAME_LENGTH,
      nameTooShort: t('minCharacters').replace('%s', MIN_ENTRY_NAME_LENGTH),
      setEntryName(val) {
        myEvent.value.entryName = val;
      },
      async onSubmit() {
        console.log(myEvent.value);
        const realDate = date.extractDate(myEvent.value.date, t('dateFormatPretty'), tm('date'));
        await store.addEntry(myEvent.value.entryName, realDate)
          .then(() => { showState.value = false; })
          .catch(error => {
            errorMessage.value = tm(error.message);
          });
      }
    };
  }
};
</script>
