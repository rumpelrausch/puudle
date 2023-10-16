<template>
  <div class="q-mb-xl">
    <div class="xq-mb-xs">
      <q-card v-for="subscription in subscriptions" :key="subscription.userName"
        :set="userNameBefore = subscription.userName" bordered flat
        class="row content-stretch bg-white rounded-borders q-mb-xs">
        <div class="col-grow">
          <q-input :model-value="subscription.userName" borderless disable filled dense />
        </div>
        <div class="col-grow" dense>
          <q-select v-model="subscription.state" :options="subscriptionStates" map-options dense standout
            @update:model-value="subscriptionChanged(userNameBefore, subscription)" @focus="store.suspendUpdate" />
        </div>
      </q-card>
      <q-card class="row content-stretch items-center rounded-borders" bordered flat>
        <div class="col-grow">
          <q-input :label="$t('userName') + ':'" v-model="newSubscription.userName" class="q-pl-sm" borderless dense
            stack-label />
        </div>
        <div class="col-grow" dense>
          <q-select :options="subscriptionStates" v-model="newSubscription.state" map-options dense standout
            @focus="store.suspendUpdate" />
        </div>
        <div class="q-ml-xs" dense>
          <q-btn icon="bi-floppy" color="green-4" dense ripple flat />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { apiStore } from 'stores/apiStore';
import { useI18n } from 'vue-i18n';

export default {
  // name: 'subscriptionList',
  props: {
    entry: Object
  },
  setup(props) {
    const store = apiStore();
    const { t, locale } = useI18n();

    const subscriptionStates = [];
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
      newSubscription.value.state = subscriptionStates[0];
    }

    buildSubscriptionStates();

    function subscriptionChanged(userNameBefore, subscription) {
      if (subscription.state.value) {
        // unmap select options
        subscription.state = subscription.state.value;
      }
      store.subscriptionChanged(props.entry._id, userNameBefore, subscription);
    }

    watch(locale, () => buildSubscriptionStates());

    return {
      // props
      entryId: props.entry._id,
      subscriptions: props.entry.subscriptions,

      // computed
      subscriptionStates,
      newSubscription,

      // globals
      store,

      // methods
      subscriptionChanged
    };
  }
};
</script>
