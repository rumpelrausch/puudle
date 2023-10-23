<template>
  <div class="self-start flex flex-center">
    <newEvent></newEvent>
    <q-timeline class="q-ml-sm">
      <q-timeline-entry v-for="entry in entries" :key="entry._id" xsubtitle="entry.entryName" icon="group" color="primary"
        class="non-selectable">
        <template v-slot:subtitle>
          <div class="text-h5 text-primary">
            {{ entry.entryName }}
          </div>
        </template>
        <div :set="parsedDate = getParsedDate(entry.date)">
          <div class="text-subtitle2 text-primary">
            {{ parsedDate.prettyDate }}
            <q-chip>
              {{ parsedDate.dayDiffString }}
            </q-chip>
            <q-btn icon="bi-trash" color="negative" v-if="isAdmin || entry.secondsOld <= MAX_ENTRY_AGE_FOR_DELETION"
            class="float-right"
            @click="store.deleteEntry(entry._id)" dense ripple flat />
          </div>
          <q-badge v-if="entry.numOfConfirmed > 0" color="positive" align="top" outline >
           {{ $tm('subscriptionStates.confirmed') }}:&nbsp;&nbsp;{{ entry.numOfConfirmed }}
           &nbsp;
           <q-icon name="bi-person" v-if="entry.numOfConfirmed === 1"/>
           <q-icon name="bi-people" v-if="entry.numOfConfirmed > 1"/>
          </q-badge>
          <div class="non-selectable">
            <subscriptionList :entry="entry">
            </subscriptionList>
          </div>
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<style>
.q-timeline__subtitle {
  text-transform: none;
  margin-bottom: -20px;
  opacity: 1;
}
.q-timeline__entry--icon .q-timeline__subtitle {
  padding-top: 4px;
}
</style>

<script>
import { date } from 'quasar';
import { useI18n } from 'vue-i18n';
import { apiStore } from 'stores/apiStore';
import { storeToRefs } from 'pinia';
import subscriptionList from 'components/subscriptionList.vue';
import newEvent from 'components/newEvent.vue';

const MAX_ENTRY_AGE_FOR_DELETION = 180;

const isAdmin = true;

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
      store,
      entries,
      isAdmin,
      MAX_ENTRY_AGE_FOR_DELETION,

      getDayDiffString(dayDiff) {
        if (dayDiff === 0) {
          return t('today');
        }
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
