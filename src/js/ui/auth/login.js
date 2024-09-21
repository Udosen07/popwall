import { login } from "../../api/auth/login";

const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("toggle-password");
const toggleIcon =
  togglePasswordButton.getElementsByClassName("toggle-password");

// Keep track of whether the password is currently visible or hidden
let isPasswordVisible = false;

// Add an event listener to the button
togglePasswordButton.addEventListener("click", function () {
  // Toggle the password visibility
  isPasswordVisible = !isPasswordVisible;

  if (isPasswordVisible) {
    // If the password is visible, change the type to "text" and update the icon to "eye"
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
    togglePasswordButton.setAttribute("aria-label", "Hide Password");
  } else {
    // If the password is hidden, change the type to "password" and update the icon to "eye-slash"
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
    togglePasswordButton.setAttribute("aria-label", "Show Password");
  }
});

export async function onLogin(event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  const loginForm = event.target;

  // Retrieve values from the form inputs
  const email = loginForm.querySelector("#email").value;
  const password = loginForm.querySelector("#password").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = loginForm.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block"; // Show loading spinner
  errorMessage.style.display = "none"; // Hide error messages
  submitButton.disabled = true; // Disable submit button

  try {
    // Use fetch with async/await to send a POST request
    const response = await login({ email, password });

    if (response.ok) {
      const result = await response.json(); // Parse the JSON response
      console.log("Login successful:", result);
      localStorage.setItem("username", result.data.name);
      localStorage.setItem("token", result.data.accessToken);
      window.location.href = "/"; // Redirect to the home page
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.innerText = `Login failed: ${error.message}`;
    errorMessage.style.display = "block"; // Show error message
  } finally {
    loadingSpinner.style.display = "none"; // Hide loading spinner
    submitButton.disabled = false; // Re-enable the submit button
  }
}

// Add event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form's submission event
  const LoginForm = document.querySelector("#loginForm");
  LoginForm.addEventListener("submit", onLogin); // Use the async function
});
