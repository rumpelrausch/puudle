<template>
  <q-timeline layout="loose">
    <q-timeline-entry v-for="(entry, key) in entries" :key="key" :title="entry.name"
      :set="parsedDate = getParsedDate(entry.date)" :subtitle="`${parsedDate.dayDiffString}, ${parsedDate.prettyDate}`"
      :side="key % 2 === 0 ? 'left' : 'right'">
      <div class="q-mb-xl">
        blah
      </div>
    </q-timeline-entry>

  </q-timeline>
</template>

<script>
import { ref } from 'vue';
import { date } from 'quasar';
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { t } = useI18n();
    const entries = ref([
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-17 17:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      },
      {
        _id: '1234',
        name: 'Bouldern / FLASHH',
        date: '2023-10-16 11:00'
      }
    ]);

    return {
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
      },
      entries
    };
  }
};
</script>
