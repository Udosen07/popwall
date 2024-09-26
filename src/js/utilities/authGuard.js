export function authGuard() {
  if (!localStorage.token) {
    alert("You must be logged in to view this page");
    window.location.href = "/auth/login/";
  }
}

// export function logout() {
//   localStorage.removeItem("username");
//   localStorage.removeItem("token");
//   window.location.href = "/auth/login/";
// }
