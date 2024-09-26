import { handleFollowButtonClick } from "../../api/profile/follow";
import { authGuard } from "../../utilities/authGuard";
import { renderPosts } from "../../ui/post/postGrid";
import { renderProfile } from "../../ui/profile/profile";
import { updatePaginationControls } from "../../utilities/pagination";
import { readProfile, readProfiles } from "../../api/profile/read";
import { setLogoutListener } from "../../ui/global/logout";

authGuard();

const name = localStorage.getItem("username");
let currentPage = 1;
const limit = 12;

const hamburger = document.getElementById("hamburger");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    const menu = document.getElementById("navLinks");
    if (menu) menu.classList.toggle("active");
  });
}

async function initializeHomePage() {
  try {
    const postsResponse = await readProfiles(limit, currentPage);

    renderPosts(postsResponse.data, handleFollowButtonClick);
    updatePaginationControls(
      postsResponse.meta,
      currentPage,
      limit,
      readProfiles
    );

    const profileResponse = await readProfile(name);

    renderProfile(profileResponse.data);
  } catch (error) {
    console.error("Error initializing homepage:", error);
  }
}

initializeHomePage();
setLogoutListener();
