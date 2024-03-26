<template>
  <section class="p-4 bg-box rounded-xl space-y-4">
    <header
      class="bg-black p-4 rounded-xl flex items-center font-semibold text-xl gap-4 justify-between max-[450px]:text-sm"
    >
      <base-button
        title="back"
        mode="full-rounded-style"
        @click="goBack()"
      >
        <box-icon name='left-arrow-alt'></box-icon>
      </base-button>
      <div>
        {{ currentDate }}
      </div>
      <div>F&deg;</div>
    </header>
    <div
      v-if="currentCity"
      class="capitalize bg-black p-4 rounded-xl relative overflow-hidden"
    >
      <div class="absolute right-[-200px] top-1/2 -translate-y-1/2 size-[400px]">
        <img
          v-if="getCurrentTime"
          src="../assets/sun.png"
          alt="sun"
        >
        <img
          v-else
          src="../assets/moon.png"
          alt="moon"
        >
      </div>
      <h1 class="mb-4 isolate">{{ currentCity.city }}</h1>
      <h1 class="text-7xl isolate">{{ parseInt(currentCity.currentWeather.main.temp) }}&deg;</h1>
      <div class="mb-8 flex gap-2 isolate">
        <span class="flex">
          <box-icon name='chevron-up'></box-icon>
          {{ parseInt(currentCity.currentWeather.main.temp_max) }}
        </span>
        <span class="flex">
          <box-icon name='chevron-down'></box-icon>
          {{ parseInt(currentCity.currentWeather.main.temp_min) }}
        </span>
      </div>
      <h3 class="isolate">{{ currentCity.currentWeather.weather[ 0 ].description }}</h3>
      <div>
        feel like
        {{ parseInt(currentCity.currentWeather.main.feels_like) }}&deg;
      </div>
    </div>
    <ul
      class="bg-black w-[calc(100vw-31rem)] max-[1000px]:w-[calc(100vw-26rem)] max-[850px]:w-full p-4 rounded-xl flex gap-4 overflow-x-scroll"
    >
      <li
        v-for="(time, index) in weatherHourly"
        :key="index"
        class="p-2 grid place-items-center min-w-[100px] h-[100px] bg-btn rounded-md"
      >
        <span>{{ new Date(time.dt * 1000).toLocaleString('en-us', { hour: 'numeric' }) }}</span>
        <img
          class="size-8"
          :src="setUrl('conditions', time.weather[ 0 ].icon, 'svg')"
          alt="weather-icon"
        >
        <span>{{ parseInt(time.temp) }}&deg;</span>
      </li>
    </ul>
    <ul class="bg-black p-4 rounded-xl space-y-2">
      <li
        v-for="(daily, index) in weatherDaily"
        :key="index"
        class="columns-3"
      >
        <div>{{ new Date(daily.dt * 1000).toLocaleString('en-us', { weekday: 'long' }) }}</div>
        <img
          class="size-8 mx-auto"
          :src="setUrl('conditions', daily.weather[ 0 ].icon, 'svg')"
          alt="weather-icon"
        >
        <div class="flex gap-2 justify-end">
          <span>{{ parseInt(daily.temp.max) }}&deg;</span>
          <span>{{ parseInt(daily.temp.min) }}&deg;</span>
        </div>
      </li>
    </ul>
    <div class="bg-black p-4 rounded-xl capitalize columns-2 space-y-2">
      <div>
        <span>sunrise</span>
        <h3>
          {{ new Date(currentCity.currentWeather.sys.sunrise * 1000).toLocaleString('en-us', { timeStyle: 'short' }) }}
        </h3>
      </div>
      <div>
        <span>sunset</span>
        <h3>
          {{ new Date(currentCity.currentWeather.sys.sunset * 1000).toLocaleString('en-us', { timeStyle: 'short' }) }}
        </h3>
      </div>
      <div>
        <span>humidity</span>
        <h3>{{ currentCity.currentWeather.main.humidity }}%</h3>
      </div>
      <div>
        <span>cloudness</span>
        <h3>{{ currentCity.currentWeather.clouds.all }}%</h3>
      </div>
      <div>
        <span>wind</span>
        <h3>{{ parseInt(currentCity.currentWeather.wind.speed) }}mph</h3>
      </div>
      <div>
        <span>pressure</span>
        <h3>{{ currentCity.currentWeather.main.pressure }} hpa</h3>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const props = defineProps({ city: String });

const currentDate = computed(() => new Date()
  .toLocaleString('en-us',
    {
      weekday: 'short',
      month: 'short',
      day: '2-digit'
    }
  ));

const currentCity = computed(() => store.getters.cities.find((city) => city.city === props.city));

const getCurrentTime = computed(() => {
  if(!currentCity.value) return false;
  const currentTime = new Date().getHours();
  const sunrise = new Date(currentCity.value.currentWeather.sys.sunrise * 1000).getHours();
  const sunset = new Date(currentCity.value.currentWeather.sys.sunset * 1000).getHours();
  return currentTime > sunrise && currentTime < sunset; // True if day, false if night
});

const weatherHourly = ref(null);
const weatherDaily = ref(null);

const goBack = () => router.replace('/');

const getImageUrl = (url) => new URL(url, import.meta.url).href;
const setUrl = computed(() => {
  return (folder, fileName, fileType) => {
    return new URL(`../assets/${ folder }/${ fileName }.${ fileType }`, import.meta.url).href;
  };
});

const fetchWeatherData = async () => {
  const API_KEY = 'a32765bf82d273585a943c4af897b9f7';
  const req = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${ currentCity.value.currentWeather.coord.lat }&lon=${ currentCity.value.currentWeather.coord.lon }&exclude=current,minutley,alerts&units=imperial&appid=${ API_KEY }`
  );

  const resData = await req.json();
  weatherHourly.value = resData.hourly.slice(0, 23);
  weatherDaily.value = resData.daily.slice(1, 8);
};

fetchWeatherData();
</script>
