export function onLogout() {
  localStorage.removeItem("username");
  localStorage.removeItem("accessToken");
  window.location.reload();
}
