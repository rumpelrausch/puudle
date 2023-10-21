<template>
  <q-btn icon="bi-plus-square" color="green-4" dense ripple flat @click="showState = true" />
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
              <!-- <q-input v-model="myEvent.entryName" :label="$t('eventName')" lazy-rules
                :rules="[val => val && val.length >= MIN_ENTRY_NAME_LENGTH || nameTooShort]" outlined dense autofocus stack-label>
              </q-input> -->
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
                      <q-date v-model="myEvent.date" :locale="myLocale" :mask="$t('dateFormatPretty')" minimal>
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
            <q-btn icon="bi-floppy" type="submit" color="green-4" dense ripple />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { date } from 'quasar';

const MIN_ENTRY_NAME_LENGTH = 3;

export default {
  setup() {
    const { t, tm, locale } = useI18n();
    const showState = ref(false);
    const today = date.buildDate({ hours: 17, minutes: 0 });
    const myEvent = ref({
      entryName: '',
      date: date.formatDate(today, t('dateFormatPretty')),
      get result() {
        return `${myEvent.value.date} ${myEvent.value.time}`;
      }
    });

    watch(showState, () => {
      myEvent.value.entryName = '';
    });

    watch(locale, (a, b) => {
      myEvent.value.date = date.formatDate(today, t('dateFormatPretty'));
    });

    return {
      get myLocale() {
        return tm('date');
      },
      showState,
      myEvent,
      MIN_ENTRY_NAME_LENGTH,
      nameTooShort: t('minCharacters').replace('%s', MIN_ENTRY_NAME_LENGTH),
      setEntryName(val) {
        myEvent.value.entryName = val;
      },
      onSubmit() {
        showState.value = false;
      }
    };
  }
};
</script>
