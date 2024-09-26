// src/js/view/post/postEdit.js
import { onUpdatePost } from "../../ui/post/update";
import { authGuard } from "../../utilities/authGuard";

authGuard();

onUpdatePost();
