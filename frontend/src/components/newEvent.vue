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
        <q-form>
          <div class="row">
            <div class="column q-mr-sm q-mb-sm">
              <q-input v-model="newEvent.entryName" :label="$t('eventName')" outlined dense></q-input>
            </div>
            <div class="column">
              <q-input v-model="newEvent.date" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="newEvent.date" :locale="myLocale" :mask="$t('dateFormatPretty')" minimal>
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
                      <q-time v-model="newEvent.date" :mask="$t('dateFormatPretty')" :format24h="myLocale.format24h"
                        :minute-options="[0,15,30,45]">
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
            <q-btn icon="bi-floppy" color="green-4" v-close-popup dense ripple xflat />
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

export default {
  setup() {
    const { t, tm, locale } = useI18n();
    const showState = ref(false);
    const today = date.buildDate({ hours: 17, minutes: 0 });
    const newEvent = ref({
      entryName: '',
      date: date.formatDate(today, t('dateFormatPretty')),
      get result() {
        return `${newEvent.value.date} ${newEvent.value.time}`;
      }
    });

    watch(locale, (a, b) => {
      newEvent.value.date = date.formatDate(today, t('dateFormatPretty'));
    });

    return {
      get myLocale() {
        return tm('date');
      },
      showState,
      newEvent
    };
  }
};
</script>
