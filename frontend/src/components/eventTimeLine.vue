<template>
  <q-btn @click="store.add()">+</q-btn>
  <q-timeline layout="loose">
    <q-timeline-entry v-for="(entry, key) in store.entries" :key="entry._id" :title="entry.entryName"
      :side="key % 2 === 0 ? 'left' : 'right'">
      <div class="q-mb-xl" :set="parsedDate = getParsedDate(entry.date)">
        {{ parsedDate.prettyDate }} - {{ parsedDate.dayDiffString }}
        <div>
          <q-markup-table wrap-cells :class="key % 2 === 0 ? 'float-right' : 'float-left'">
            <tbody>
              <tr v-for="(subscription) in entry.subscriptions" :key="subscription.userName">
                <td>
                  <q-input v-model="subscription.userName" :label="$t('userName')" outlined />
                </td>
                <td>
                  <q-select v-model="subscription.state" :options="subscriptionStates" label="" outlined map-options />
                </td>
                <td>
                  <q-btn color="secondary" :label="$t('save')" />
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
import { date } from 'quasar';
import { useI18n } from 'vue-i18n';
import { apiStore } from 'stores/apiStore';

export default {
  setup() {
    const store = apiStore();
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

    setInterval(store.fetchEntries, 1000);

    return {
      store,
      subscriptionStates,
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
