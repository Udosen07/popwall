import { register } from "../../api/auth/register";

export async function onRegister(event) {
  // Register api integration

  event.preventDefault(); // Prevent the form from submitting in the traditional way

  const registerForm = event.target;

  // Retrieve values from the form inputs
  const name = registerForm.querySelector("#userName").value;
  const email = registerForm.querySelector("#email").value;
  const password = registerForm.querySelector("#password").value;
  const bio = registerForm.querySelector("#bio").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = registerForm.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block"; // Show loading spinner
  errorMessage.style.display = "none"; // Hide error messages
  submitButton.disabled = true; // Disable submit button

  try {
    // Use fetch with async/await to send a POST request
    const response = await register({
      name,
      email,
      password,
      bio,
    });

    if (response.ok) {
      const result = await response.json(); // Parse the JSON response
      console.log("Registration successful:", result);
      alert("Registration successful! Redirecting to login...");
      window.location.href = "/auth/login/"; // Redirect to the login page
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.innerText = `Registration failed: ${error.message}`;
    errorMessage.style.display = "block"; // Show error message
  } finally {
    loadingSpinner.style.display = "none"; // Hide loading spinner
    submitButton.disabled = false; // Re-enable the submit button
  }
}

// Add event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form's submission event
  const registerForm = document.querySelector("#registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }
});

// Password Toggler
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
    // If the password is visible, change the type to "text" and update the icon to "eye-slash"
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
    togglePasswordButton.setAttribute("aria-label", "Hide Password");
  } else {
    // If the password is hidden, change the type to "password" and update the icon to "eye"
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
    togglePasswordButton.setAttribute("aria-label", "Show Password");
  }
});
