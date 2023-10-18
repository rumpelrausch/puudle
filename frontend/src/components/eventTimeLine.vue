<template>
  <newEvent></newEvent>
  <q-timeline layout="loose">
    <q-timeline-entry v-for="(entry, key) in entries" :key="entry._id" :title="entry.entryName"
      :side="key % 2 === 0 ? 'left' : 'right'">
      <div class="q-mb-xl" :set="parsedDate = getParsedDate(entry.date)">
        {{ parsedDate.prettyDate }} - {{ parsedDate.dayDiffString }}
        <div class="q-pb-xl">
          <subscriptionList :entry="entry">
          </subscriptionList>
        </div>
      </div>
    </q-timeline-entry>
  </q-timeline>
</template>

<script>
import { date } from 'quasar';
import { useI18n } from 'vue-i18n';
import { apiStore } from 'stores/apiStore';
import { storeToRefs } from 'pinia';
import subscriptionList from 'components/subscriptionList.vue';
import newEvent from 'components/newEvent.vue';

export default {
  components: {
    subscriptionList,
    newEvent
  },
  setup() {
    const store = apiStore();
    const { entries } = storeToRefs(store);
    const { t } = useI18n();

    store.startUpdate();

    return {
      // globals
      store,
      entries,

      // methods
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
