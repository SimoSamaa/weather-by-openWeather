<template>
  <main class="relative">
    <section class="h-[calc(100vh-40px)] sticky top-5">
      <div
        @click="closeActionsWeather()"
        v-if="actionsClass"
        class="inset-0 w-screen h-screen fixed bg-black bg-opacity-70"
      ></div>
      <base-button
        title="menu"
        @click="toggleActionsWeather()"
        mode="full-rounded-style hidden"
      >
        <box-icon name='menu'></box-icon>
      </base-button>
      <header
        :class="{ 'act': actionsClass }"
        class="flex gap-4 h-full flex-col"
      >
        <div class="bg-box p-4 rounded-xl">
          <h1>By</h1>
          <img
            src="@/assets/logo_white_cropped.webp"
            alt="logo"
          >
        </div>
        <div class="relative bg-box p-4 rounded-xl space-y-4 flex-auto">
          <input
            type="text"
            class="h-[44px] w-full px-4 placeholder:text-white border-btn bg-black rounded-full border-whithe border-2"
            placeholder="type city"
            v-model="city"
          >
          <div class="weather-actions">
            <base-button @click="addWeatherCity()">
              <box-icon
                type='solid'
                name='add-to-queue'
              ></box-icon>
              add city
            </base-button>
            <base-button
              @click="editCity()"
              :class="{ 'bg-red-700': editMode }"
            >
              <box-icon
                type='solid'
                name='edit-alt'
              ></box-icon>
              {{ !editMode ? 'edit ' : 'remove ' }}
              city
            </base-button>
            <base-button @click="refreshCites()">
              <box-icon name='refresh'></box-icon>
              refresh
            </base-button>
            <base-button @click="getCurrentLocationWeather()">
              <box-icon name='current-location'></box-icon>
              location
            </base-button>
          </div>
          <div class="absolute bottom-4 left-0 w-full px-4">
            <base-button @click="deleteAll()">
              <box-icon name='trash'></box-icon>
              delete all
            </base-button>
          </div>
        </div>
      </header>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const emit = defineEmits([ 'set-edit-mode', 'set-refresh-cites' ]);

const city = ref('');
const editMode = ref(false);
const actionsClass = ref(false);

const closeActionsWeather = () => actionsClass.value = false;
const toggleActionsWeather = () => actionsClass.value = true;

const editCity = () => {
  editMode.value = !editMode.value;
  emit('set-edit-mode', editMode.value);
  router.replace('/');
};

const refreshCites = () => emit('set-refresh-cites');

const addWeatherCity = async () => {
  try {
    await store.dispatch('postWeatherCity', city.value);
    actionsClass.value = false;
    city.value = '';
    router.replace('/');
  } catch(err) {
    alert('This city is not exist!!');
  }
};

const deleteAll = async () => {
  await store.dispatch('deleteAllCityWeather');
  router.replace('/');
};

const getCurrentLocationWeather = async () => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      await store.dispatch('fetchWeatherByCoordinates', { latitude, longitude });
    }, (error) => {
      console.error('Error getting current location:', error.message);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

</script>

<style scoped>
.weather-actions {
  @apply grid gap-4;
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 850px) {
  main {
    @apply h-auto fixed top-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)];
  }

  section {
    @apply bg-box rounded-xl p-4 h-full;
  }

  button {
    @apply flex;
  }

  header {
    @apply bg-box w-[320px] h-screen top-0 left-[-320px] fixed z-10 duration-300 transition-all ease-out opacity-0;
  }

  header.act {
    @apply -left-4 -top-4 opacity-100;
  }
}
</style>