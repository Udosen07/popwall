import "./css/style.css";
import { API_SOCIAL_POSTS } from "./js/api/constants";
import router from "./js/router";

// Ensure router completes
await router(window.location.pathname);
