<template>
  <!-- <q-btn @click="store.add()">+</q-btn> -->
  <q-timeline layout="loose">
    <q-timeline-entry v-for="(entry, key) in entries" :key="entry._id" :title="entry.entryName"
      :side="key % 2 === 0 ? 'left' : 'right'">
      <div class="q-mb-xl" :set="parsedDate = getParsedDate(entry.date)">
        {{ parsedDate.prettyDate }} - {{ parsedDate.dayDiffString }}
        <div class="q-pb-xl">
          <q-markup-table wrap-cells :class="key % 2 === 0 ? 'float-right' : 'float-left'">
            <tbody>
              <tr v-for="subscription in entry.subscriptions" :key="subscription.userName"
                :set="userNameBefore = subscription.userName">
                <td>
                  <q-input :model-value="subscription.userName" borderless readonly dense />
                </td>
                <td>
                  <q-select v-model="subscription.state" :options="subscriptionStates" outlined map-options dense
                    @update:model-value="subscriptionChanged(entry, userNameBefore, subscription)"
                    @focus="store.suspendUpdate" />
                </td>
                <td>
                </td>
              </tr>
              <tr class="bg-green-1">
                <td>
                  <q-input :label="$t('userName') + ':'" v-model="newSubscription.userName" borderless dense stack-label />
                </td>
                <td>
                  <q-select :options="subscriptionStates" v-model="newSubscription.state" outlined map-options dense
                    @focus="store.suspendUpdate" />
                </td>
                <td>
                  <q-btn icon="bi-floppy" color="green-4"/>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </q-timeline-entry>

  </q-timeline>
</template>

<script>
import { ref } from 'vue';
import { date } from 'quasar';
import { useI18n } from 'vue-i18n';
import { apiStore } from 'stores/apiStore';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const store = apiStore();
    const { entries } = storeToRefs(store);
    const { t } = useI18n();
    const subscriptionStates = [];
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

    const newSubscription = ref({});

    function initSubscriptionTemplate() {
      newSubscription.value.state = subscriptionStates[0];
    }

    function subscriptionChanged(entry, userNameBefore, subscription) {
      if (subscription.state.value) {
        // unmap select options
        subscription.state = subscription.state.value;
      }
      store.subscriptionChanged(entry._id, userNameBefore, subscription);
    }

    initSubscriptionTemplate();
    store.startUpdate();

    return {
      store,
      entries,
      subscriptionStates,
      newSubscription,
      initSubscriptionTemplate,
      subscriptionChanged,
      getDayDiffString(dayDiff) {
        if (dayDiff === 1) {
          return t('tomorrow');
        }
        return t('inDays').replace('%s', dayDiff.toString());
      },
      getParsedDate(entryDate) {
        const dateFormat = t('dateFormatPretty');
        const [dateString, timeString] = entryDate.split(' ');
        const [year, month, day] = dateString.split('-');
        const [hour, minute] = timeString.split(':');
        const realDate = date.buildDate({ year, month, day, hour, minute });
        const realDateDay = date.buildDate({ year, month, day });
        const dayDiff = date.getDateDiff(realDateDay, new Date(), 'days');
        return {
          realDate,
          prettyDate: date.formatDate(realDate, dateFormat),
          dayDiffString: this.getDayDiffString(dayDiff)
        };
      }
    };
  }
};
</script>
