<template>
  <div class="non-selectable">
    <q-card v-for="subscription in subscriptions" :key="subscription.userName" bordered flat
      class="row content-stretch items-center rounded-borders q-mb-xs">
      <div class="col-8 col-grow bg-disabled" :set="subscription.userNameBefore = subscription.userName">
        <q-input :label="$t('userName')" :model-value="subscription.userName" class="q-pl-sm" borderless disable dense
          square stack-label />
      </div>
      <div class="col-4 col-grow non-selectable stateselect" dense>
        <q-select v-model="subscription.state" :options="subscriptionStates" map-options dense
          standout="bg-primary text-white" hide-dropdown-icon
          :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
          @update:model-value="updateSubscription(subscription.userNameBefore, subscription)"
          @focus="store.suspendUpdate">
          <template v-slot:selected-item="scope">
            <q-avatar size="sm" :color="scope.opt.color" text-color="white" :icon="scope.opt.icon" />
            <div class="q-ml-sm non-selectable">
              {{ scope.opt.label }}
            </div>
          </template>
        </q-select>
      </div>
      <div class="col-10" dense>
        <q-input v-model="subscription.comment" :label="$t('comment')" :debounce="AUTO_SAVE_MILLISECONDS"
          @change="updateSubscription(subscription.userNameBefore, subscription)" @focus="store.suspendUpdate"
          data-debounce="1" class="q-pl-sm" borderless dense stack-label />
      </div>
      <div class="col" dense>
        <q-btn icon="bi-trash" color="negative" @click="confirmDelete(subscription.userNameBefore)" class="float-right"
          dense ripple flat />
      </div>
    </q-card>
    <q-btn icon="bi-plus-square" color="positive" v-if="!newSubscription.visible" @click="newSubscription.visible = true"
      dense ripple flat />
    <q-form ref="newSubscriptionForm" @submit="addSubscription" v-if="newSubscription.visible">
      <q-card class="row content-stretch items-center rounded-borders" bordered flat>
        <div class="col-8">
          <q-input :label="userNameFieldTitle" v-model="newSubscription.userName" class="q-pl-sm q-pr-xl" lazy-rules
            :rules="[val => val && val.length >= MIN_USERNAME_LENGTH || nameTooShort]" :shadow-text="userNameShadowText"
            @focus="newSubscription.hasFocus = true" @keydown="keyDown" v-touch-hold.mouse="setDefaultUser"
            @blur="resetValidation(); newSubscription.hasFocus = false" borderless dense stack-label hide-bottom-space />
        </div>
        <div class="col-grow non-selectable stateselect" dense>
          <q-select :options="subscriptionStates" v-model="newSubscription.state" map-options dense hide-dropdown-icon
            lazy-rules :rules="[val => val && val.label && val.label.length > 0 || $t('pleaseChoose')]"
            :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'"
            standout="bg-primary text-white" @focus="store.suspendUpdate">
            <template v-slot:selected>
              <q-avatar size="sm" :color="newSubscription.state.color" text-color="white"
                :icon="newSubscription.state.icon" />
              <div class="q-ml-sm non-selectable">
                {{ newSubscription.state.label }}
              </div>
            </template>
          </q-select>
        </div>
        <div class="col-10" dense>
          <q-input v-model="newSubscription.comment" :label="$t('comment')" class="q-pl-sm" borderless dense stack-label
            @focus="store.suspendUpdate" />
        </div>
        <div class="col float-right" style="display: flex; justify-content: right;" dense>
          <q-btn icon="bi-x-square" color="negative" @click="resetNewSubscription" dense
            ripple flat />
          <q-btn type="submit" icon="bi-floppy" color="positive" class="q-ml-xs" dense ripple flat />
        </div>
        <q-banner v-if="errorMessage.length > 0" class="bg-negative text-white">
          {{ errorMessage }}
        </q-banner>
      </q-card>
    </q-form>
  </div>
</template>

<style>
.stateselect {
  min-width: 12em !important;
}

div {
  user-select: none !important;
}
</style>

<script>
import { useQuasar, event } from 'quasar';
import { ref, watch, toRaw } from 'vue';
import { apiStore } from 'stores/apiStore';
import { useI18n } from 'vue-i18n';

const MIN_USERNAME_LENGTH = 2;
const AUTO_SAVE_MILLISECONDS = 1500;

const { stopAndPrevent } = event;

export default {
  props: {
    entry: Object
  },
  setup(props) {
    const $q = useQuasar();
    const store = apiStore();
    const { t, tm, locale } = useI18n();
    const subscriptionStates = ref([]);
    const subscriptions = ref(props.entry.subscriptions);
    const newSubscription = ref({});
    const newSubscriptionForm = ref(null);
    const errorMessage = ref('');

    $q.iconSet.field.error = '';

    function buildSubscriptionStates() {
      subscriptionStates.value.length = 0;
      [
        ['suggested', 'bi-person-raised-hand', 'info'],
        ['confirmed', 'bi-check-lg', 'positive'],
        ['rejected', 'bi-ban', 'negative'],
        ['maybe', 'bi-question-lg', 'warning']
      ].forEach((state) => {
        subscriptionStates.value.push(({
          value: state[0],
          label: t(`subscriptionStates.${state[0]}`),
          icon: state[1],
          color: state[2]
        }));
      });
    }

    function resetNewSubscription() {
      newSubscription.value = {
        visible: false,
        userName: '',
        state: {
          label: '',
          icon: 'expand_more',
          color: 'secondary'
        },
        comment: '',
        hasFocus: false
      };
      resetValidation();
    }

    function resetValidation() {
      newSubscriptionForm.value?.resetValidation();
    }

    async function updateSubscription(userNameBefore, subscription) {
      if (subscription.state.value) {
        // unmap select options
        subscription.state = subscription.state.value;
      }
      await store.updateSubscription(props.entry._id, userNameBefore, subscription);
    }

    async function addSubscription() {
      const subscription = { ...newSubscription.value };
      subscription.state = subscription.state.value;
      store.addSubscription(props.entry._id, subscription)
        .then((entry) => {
          subscriptions.value = entry.subscriptions;
          resetNewSubscription();
          store.userSettings.lastUsedUserName = subscription.userName;
        })
        .catch(error => {
          errorMessage.value = tm(error.message);
        });
    }

    async function deleteSubscription(userName) {
      const entry = await store.deleteSubscription(props.entry._id, userName);
      subscriptions.value = entry.subscriptions;
      resetValidation();
    }

    function confirmDelete(userName) {
      $q.dialog({
        message: t('deleteSubscription').replace('%s', userName),
        cancel: t('cancel'),
        ok: t('ok'),
        focus: 'cancel'
      }).onOk(() => deleteSubscription(userName));
    }

    function setDefaultUser() {
      if (newSubscription.value.userName.length === 0) {
        newSubscription.value.userName = store.userSettings?.lastUsedUserName;
      }
    }

    function keyDown(domEvent) {
      if (
        domEvent.keyCode === 9 &&
        store.userSettings?.lastUsedUserName
      ) {
        stopAndPrevent(domEvent);
        setDefaultUser();
      }
    }

    watch(locale, () => {
      buildSubscriptionStates();
      resetNewSubscription();
    });

    watch(subscriptions, () => {
      // blur all inputs on changes -> force @change events
      Array.from(document.querySelectorAll('[data-debounce]')).forEach(el => el.blur());
      store.resumeUpdate();
    }, {
      deep: true
    });

    watch(store.entriesStamp, () => {
      const myEntry = toRaw(store.getEntryById(props.entry._id));
      if (myEntry) {
        subscriptions.value = myEntry.subscriptions;
      }
    }, {
      deep: true
    });

    buildSubscriptionStates();
    resetNewSubscription();

    return {
      newSubscriptionForm,
      MIN_USERNAME_LENGTH,
      AUTO_SAVE_MILLISECONDS,
      errorMessage,
      get nameTooShort() { return t('minCharacters').replace('%s', MIN_USERNAME_LENGTH); },
      get userNameFieldTitle() {
        let title = t('userName');
        if (newSubscription.value.hasFocus && this.userNameShadowText !== '') {
          title += '\xa0\xa0\xa0' + t('tabHint');
        }
        return title;
      },
      get userNameShadowText() {
        return newSubscription.value.userName === '' ? store.userSettings?.lastUsedUserName : '';
      },
      setDefaultUser,
      entryId: props.entry._id,
      subscriptions,
      subscriptionStates,
      newSubscription,
      store,
      updateSubscription,
      addSubscription,
      confirmDelete,
      resetNewSubscription,
      resetValidation,
      keyDown
    };
  }
};
</script>
