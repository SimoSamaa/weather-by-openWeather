import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';
import App from './App.vue';
import './style/main.css';
import { v4 as genId } from 'uuid';

import BaseButton from './components/UI/BaseButton.vue';
import BaseLoading from './components/UI/BaseLoading.vue';

const app = createApp(App);

app.component('base-button', BaseButton);
app.component('BaseLoading', BaseLoading);

import CitiesweatherState from '@/views/CitiesweatherState.vue';
import CityweatherDetaials from '@/views/CityweatherDetaials.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: CitiesweatherState,
    },
    {
      props: true,
      path: '/:city',
      component: CityweatherDetaials,
    }
  ]
});

const API_KEY = 'a32765bf82d273585a943c4af897b9f7';
const FIREBASE_URL = 'https://weather-app-e5616-default-rtdb.europe-west1.firebasedatabase.app/citiesWeather.json';

async function handleRequests(method = 'GET', url = null, payload = null) {
  try {
    const fetchOptions = { method: method !== null ? method : 'GET' };
    if(payload !== null) fetchOptions.body = JSON.stringify(payload);
    const req = await fetch(url === null ? FIREBASE_URL : url, fetchOptions);
    if(!req.ok) {
      throw new Error('Failed to fetch data from the server');
    }

    const res = await req.json();

    return res;
  } catch(error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

const store = createStore({
  state() {
    return {
      cities: [],
    };
  },
  mutations: {
    setAddWeatherCity(state, payload) {
      state.cities.push(payload);
    },
    setFetchWeatherData(state, payload) {
      state.cities = payload;
    },
    setDeleteCity(state, payload) {
      state.cities = state.cities.filter((city) => city.id !== payload);
    },
    setDeleteAll(state) {
      state.cities = [];
    }
  },
  actions: {
    async fetchWeatherByCoordinates(context, { latitude, longitude }) {
      const OPENWEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${ latitude }&lon=${ longitude }&appid=${ API_KEY }&units=metric`;
      const resWeatherData = await handleRequests(null, OPENWEATHER_URL, null);
      const weatherInfo = {
        city: resWeatherData.name,
        currentWeather: resWeatherData
      };

      if(context.state.cities.some((city) => city.city === resWeatherData.name)) {
        alert('This city is already exist');
        return;
      }

      const res = await handleRequests('POST', null, weatherInfo);
      context.commit('setAddWeatherCity', { ...weatherInfo, id: res.name });
    },
    async postWeatherCity(context, payload) {
      const OPENWEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${ payload }&appid=${ API_KEY }&units=metric`;
      const resWeatherData = await handleRequests(null, OPENWEATHER_URL, null);

      let token = localStorage.getItem('token');
      if(!token) {
        token = genId();
        localStorage.setItem('token', token);
      }

      // const token = genId();
      const weatherInfo = {
        city: payload,
        currentWeather: resWeatherData,
        token: token
      };

      if(context.state.cities.some((city) => city.city === payload)) {
        alert('this city is already exist!!');
        return;
      }

      if(context.state.cities.length >= 9) {
        alert('max city allow is 9!!');
        return;
      }

      const res = await handleRequests('POST', null, weatherInfo);

      context.commit('setAddWeatherCity', { ...weatherInfo, id: res.name });
    },
    async fetchWeatherData({ commit }) {
      const res = await handleRequests(null, null);
      const cities = [];

      const token = localStorage.getItem('token');

      for(const key in res) {
        const data = {
          id: key,
          city: res[ key ].city,
          token: res[ key ].token,
          currentWeather: res[ key ].currentWeather
        };

        if(data.token === token) {
          cities.push(data);
        }
      }
      commit('setFetchWeatherData', cities);
    },
    async deleteCity({ commit }, payload) {
      const NEW_URL = FIREBASE_URL.split('.json')[ 0 ];
      await handleRequests('DELETE', `${ NEW_URL }/${ payload }.json`);
      commit('setDeleteCity', payload);
    },
    async deleteAllCityWeather({ commit }) {
      // await handleRequests('DELETE', null);
      // commit('setDeleteAll');
      const token = localStorage.getItem('token');
      if(!token) {
        alert('No token found in local storage');
        return;
      }

      const res = await handleRequests(null, null);
      const citiesToDelete = [];

      for(const key in res) {
        if(res[ key ].token === token) {
          citiesToDelete.push(key);
        }
      }

      const promises = citiesToDelete.map(cityId => {
        const NEW_URL = FIREBASE_URL.split('.json')[ 0 ];
        return handleRequests('DELETE', `${ NEW_URL }/${ cityId }.json`);
      });

      await Promise.all(promises);

      commit('setDeleteAll');
    }
  },
  getters: {
    cities(state) {
      return state.cities;
    },
    checkCities(state) {
      return state.cities.length === 0;
    },
    info(state) {
      return state.info;
    }
  },
});

app.use(router);

app.use(store);

app.mount('#app');
