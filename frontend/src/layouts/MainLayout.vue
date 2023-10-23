<template>
  <div>
    <q-layout view="hHh lpR fFf" class="layout-container non-selectable">

      <q-header elevated class="bg-primary text-white">
        <q-toolbar class="layout-container">
          <q-toolbar-title>
            {{ $t('mainTitle') }}
          </q-toolbar-title>
          <langSwitcher class="langSwitcher"></langSwitcher>
        </q-toolbar>
      </q-header>

      <q-space />

      <q-page-container class="layout-container bg-back shadow-2">
        <router-view />
      </q-page-container>

    </q-layout>
  </div>
</template>

<style>
.langSwitcher {
  margin-top: calc(1rem / 3);
}

.langSwitcher .q-select__dropdown-icon,
.langSwitcher .q-field__native,
.langSwitcher .q-field__prefix,
.langSwitcher .q-field__suffix,
.langSwitcher .q-field__input {
  color: white !important;
}

.layout-container {
  max-width: 50rem;
  margin: auto;
}
</style>

<script>
import { defineComponent, ref } from 'vue';
import langSwitcher from 'components/langSwitcher.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    langSwitcher
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      }
    };
  }
});
</script>
