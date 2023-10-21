<template>
  <div class="q-mb-xl non-selectable">
    <div class="xq-mb-xs">
      <q-card v-for="subscription in subscriptions" :key="subscription.userName"
        :set="userNameBefore = subscription.userName" bordered flat
        class="row content-stretch items-center rounded-borders q-mb-xs">
        <div class="col-grow bg-grey-1">
          <q-input :label="$t('userName')" :model-value="subscription.userName" class="q-pl-sm" borderless disable dense stack-label />
        </div>
        <div class="col-6" dense>
          <q-input v-model="subscription.comment" :label="$t('comment')"
            @change="updateSubscription(userNameBefore, subscription)" @focus="store.suspendUpdate" class="q-pl-sm"
            borderless dense stack-label />
        </div>
        <div class="col-8" dense>
          <q-select v-model="subscription.state" :options="subscriptionStates" map-options dense standout="bg-primary text-white"
            @update:model-value="updateSubscription(userNameBefore, subscription)" @focus="store.suspendUpdate" />
        </div>
        <div class="col" dense>
          <q-btn icon="bi-trash" color="red-4" @click="confirmDelete(userNameBefore)" dense ripple flat />
        </div>
      </q-card>
      <q-card class="row content-stretch items-center rounded-borders" bordered flat>
        <div class="col-6">
          <q-input :label="$t('userName')" v-model="newSubscription.userName" class="q-pl-sm" borderless dense
            stack-label />
        </div>
        <div class="col-6" dense>
          <q-input v-model="newSubscription.comment" :label="$t('comment')" class="q-pl-sm" borderless dense stack-label
            @focus="store.suspendUpdate" />
        </div>
        <div class="col-8" dense>
          <q-select :options="subscriptionStates" v-model="newSubscription.state" map-options dense standout="bg-primary text-white"
            @focus="store.suspendUpdate" />
        </div>
         <div class="col" dense>
          <q-btn icon="bi-floppy" color="green-4" dense ripple flat @click="addSubscription" />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar';
import { ref, watch } from 'vue';
import { apiStore } from 'stores/apiStore';
import { useI18n } from 'vue-i18n';

export default {
  props: {
    entry: Object
  },
  setup(props) {
    const $q = useQuasar();
    const store = apiStore();
    const { t, locale } = useI18n();
    const subscriptionStates = [];
    const subscriptions = ref(props.entry.subscriptions);
    const newSubscription = ref({});
    function buildSubscriptionStates() {
      subscriptionStates.length = 0;
      [
        'suggested',
        'confirmed',
        'rejected',
        'maybe'
      ].forEach((key) => {
        subscriptionStates.push(({
          value: key,
          label: t(`subscriptionStates.${key}`)
        }));
      });
    }

    function resetNewSubscription() {
      newSubscription.value = {
        userName: '',
        state: subscriptionStates[0],
        comment: ''
      };
    }

    function updateSubscription(userNameBefore, subscription) {
      if (subscription.state.value) {
        // unmap select options
        subscription.state = subscription.state.value;
      }
      store.updateSubscription(props.entry._id, userNameBefore, subscription);
    }

    async function addSubscription() {
      const subscription = { ...newSubscription.value };
      subscription.state = subscription.state.value;
      const entry = await store.addSubscription(props.entry._id, subscription);
      subscriptions.value = entry.subscriptions;
      resetNewSubscription();
    }

    async function deleteSubscription(userName) {
      const entry = await store.deleteSubscription(props.entry._id, userName);
      subscriptions.value = entry.subscriptions;
    }

    function confirmDelete(userName) {
      $q.dialog({
        message: t('deleteSubscription').replace('%s', userName),
        cancel: t('cancel'),
        ok: t('ok'),
        focus: 'cancel'
      }).onOk(() => deleteSubscription(userName));
    }

    watch(locale, () => { buildSubscriptionStates(); resetNewSubscription(); });
    // watch(store.entries, () => { console.log('entry changed', store.entries); });
    buildSubscriptionStates();
    resetNewSubscription();

    return {
      entryId: props.entry._id,
      subscriptions,
      subscriptionStates,
      newSubscription,
      store,
      updateSubscription,
      addSubscription,
      confirmDelete
    };
  }
};
</script>
