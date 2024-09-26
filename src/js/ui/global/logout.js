import { onLogout } from "../auth/logout";

export function setLogoutListener() {
  const logoutButtons = document.querySelectorAll("#logout");

  logoutButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      onLogout();
    });
  });
}
