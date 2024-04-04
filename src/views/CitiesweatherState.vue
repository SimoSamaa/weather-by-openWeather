<template>
  <section class="relative max-[850px]:min-h-[calc(100vh-132px)]">
    <BaseLoading v-if="isLoading" />
    <transition-group
      v-else
      tag="ul"
      appear
      name="scale-animation"
      class="grid gap-4 relative overflow-hidden"
    >
      <li
        class="relative rounded-xl overflow-hidden aspect-video p-5 cursor-pointer"
        v-for="city in cities"
        :key="city.id"
        @click="weatherDetails(city.city)"
      >
        <video
          class="absolute inset-0 size-full object-fill"
          autoplay
          muted
          loop
          playsinline
          disablepictureinpicture
          :src="setUrl('videos', city.currentWeather.weather[ 0 ].icon, 'mp4')"
        ></video>
        <div class="font-semibold text-xl isolate">
          <div>{{ city.city }}</div>
          <div class="flex gap-2 items-center absolute bottom-5 right-5">
            <div>{{ parseInt(city.currentWeather.main.temp) }}&deg;</div>
            <img
              :src="setUrl('conditions', city.currentWeather.weather[ 0 ].icon, 'svg')"
              alt="status-icon"
              class="size-10 max-[600px]:size-8"
            >
          </div>
        </div>
        <div
          v-if="editMode"
          @click.stop="deleteWeatherCity(city.id)"
          class="size-10 rounded-tr-xl grid place-content-center cursor-pointer bg-black bg-opacity-50 absolute left-0 bottom-0"
        >
          <box-icon name='trash'></box-icon>
        </div>
      </li>
    </transition-group>
    <h1
      v-if="checkCities && !isLoading"
      class="absolute text-center left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2"
    >No Cities for Now</h1>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

defineProps(
  {
    editMode: Boolean,
    isLoading: Boolean
  }
);

const store = useStore();
const router = useRouter();

const cities = computed(() => store.getters.cities);
const checkCities = computed(() => store.getters.checkCities);

const setUrl = computed(() => {
  return (folder, fileName, fileType) => {
    return new URL(`../assets/${ folder }/${ fileName }.${ fileType }`, import.meta.url).href;
  };
});

const deleteWeatherCity = async (id) => {
  await store.dispatch('deleteCity', id);
};

const weatherDetails = (city) => router.replace(`/${ city }`);
</script>

<style scoped>
ul {
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  grid-auto-rows: max-content;
}


.scale-animation-enter-active {
  animation: scale-animation 300ms ease;
}

.scale-animation-leave-active {
  animation: scale-animation 300ms ease reverse;
  position: absolute;
}

.scale-animation-move {
  transition: transform 300ms ease;
}

@keyframes scale-animation {
  from {
    opacity: .5;
    transform: scale(.8);
  }

  to {
    opacity: 1;
    transform: translateY(-100px) scale(1);
  }
}
</style>
