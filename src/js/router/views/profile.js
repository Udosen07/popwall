// src/js/router/views/profile.js
import { authGuard } from "../../utilities/authGuard";
import { onUpdateProfile } from "../../ui/profile/update";

authGuard();
onUpdateProfile();
