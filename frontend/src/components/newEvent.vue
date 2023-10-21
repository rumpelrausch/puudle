<template>
  <q-btn icon="bi-plus-square" color="green-4" dense ripple flat @click="showState = true" />
  <q-dialog v-model="showState">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('titleAddEvent') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-input v-model="newEvent.entryName" :label="$t('eventName')"></q-input>
          <q-date v-model="newEvent.date" :locale="myLocale" minimal />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { tm } = useI18n();
    const showState = ref(false);
    const newEvent = ref({
      entryName: '',
      date: '',
      time: '17:00'
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
