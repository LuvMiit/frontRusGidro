import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import HomePage from "@/components/HomePage.vue";
import LogIn from "@/components/LogIn.vue";
import WorkPage from "@/components/securedZone/WorkPage.vue";
import RegisterPage from "@/components/securedZone/RegisterPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes:[{
        name: 'HomePage',
        path: '/homePage',
        alias:'/',
        component: HomePage

    },{
        name: 'LogIn',
        path: '/login',
        component: LogIn

    },{
        name: 'WorkPage',
        path: '/work',
        component: WorkPage

    },{
        name: 'Register',
        path: '/register',
        component: RegisterPage

    }]
})

const app= createApp(App)
    .use(router)
    .mount('#app')
