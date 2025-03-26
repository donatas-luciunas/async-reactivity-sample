import { createApp } from 'vue'
import App from './App.vue'

import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './Home.vue';
import Http from './Http.vue';
import Socket from './Socket.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        component: Home
    }, {
        path: '/http',
        component: Http,
    }, {
        path: '/socket',
        component: Socket
    }]
});

createApp(App).use(router).mount('#app');
