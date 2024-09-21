import { onLogout } from "../auth/logout";

export function setLogoutListener() {
  const logoutLink = document.querySelector("#logout");
  logoutLink.addEventListener("click", function () {
    onLogout();
  });
}
