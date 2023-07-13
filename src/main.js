import { createApp } from 'vue'
import App from './App.vue'

import { createRouter, createWebHistory } from "vue-router";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import Home from "./components/Home.vue";
import ReservedBasket from "./components/ReservedBasket";
import Reservation from "@/components/Reservation";
import About from "@/components/About";

const router = createRouter({
    history: createWebHistory(), // from library
    routes: [
        { path: "/", redirect: "/home" },
        { path: "/register", component: Register },
        { path: "/login", component: Login },
        { path: "/home", component: Home },
        { path: "/basket", component: ReservedBasket, meta: {requiredLoginAuthen: true} },
        { path: "/:bookTitle", component: Reservation },
        { path: "/about", component: About },
    ],
});

router.beforeEach(function(to, from, next) {
    // when you access/click a component page, you can set condition before going into it
    if (to.meta.requiredLoginAuthen) { // to is where you click to, from is where you clicked from
        // set /basket to require login/authentication
        if (app.config.globalProperties.$authenticated) {
            next(); // direct to "to"
        }
        else {
            next("/login");
        }
    }
    else { // user is heading to public pages, accessible by anyone
        next();
    }
});

const app = createApp(App);
app.use(router);
app.mount("#app");

// we want to access the app object
// create global properties - sth that you can access anywhere as long as you access the app
// when login is success, these values will change
app.config.globalProperties.$displayName = "";
app.config.globalProperties.$idToken = "";
app.config.globalProperties.$expiresIn = "";
app.config.globalProperties.$authenticated = false; // user hasnt logged in yet auth = false

export { app }; // so that we can import this app and access it make use of it