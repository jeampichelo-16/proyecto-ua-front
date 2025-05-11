import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import pinia from "./stores";
import router from "./router";

console.log("Modo:", import.meta.env.VITE_STAGE)

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount("#app");
