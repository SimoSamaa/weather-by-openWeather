<template>
  <WeatherActions
    @set-edit-mode="activeEditMode"
    @set-refresh-cites="refreshCites"
  />
  <RouterView
    :editMode
    :isLoading
  />
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import WeatherActions from '@/components/WeatherActions.vue';

const store = useStore();

const editMode = ref(false);
const isLoading = ref(false);

const activeEditMode = (mode) => editMode.value = mode;
const refreshCites = () => loadWeatherData();

const loadWeatherData = async () => {
  isLoading.value = true;
  try {
    await store.dispatch('fetchWeatherData');
  } catch(err) {
    console.log('Error fetching weather data:', err.message);
  } finally {
    isLoading.value = false;
  }
};

loadWeatherData();
</script>
