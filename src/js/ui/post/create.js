// src/js/ui/post/post.js
import { createPost } from "../../api/post/create";

export async function onCreatePost(event) {
  event.preventDefault();
  const form = event.target;
  const title = document.getElementById("title").value;
  const image = document.getElementById("image").value;
  const body = document.getElementById("content").value;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMessage = document.getElementById("errorMessage");
  const submitButton = form.querySelector("button[type='submit']");

  loadingSpinner.style.display = "block"; // Show loading spinner
  errorMessage.style.display = "none"; // Hide error messages
  submitButton.disabled = true; // Disable submit button

  const postData = {
    title,
    media: {
      url: image,
    },
    body,
  };

  try {
    const response = await createPost(postData);

    if (response.ok) {
      const data = await response.json();
      console.log("Post created:", data);
      alert("Post created successfully!");
      form.reset();
    } else {
      // throw new Error("Failed to create blog post");
      const errorData = await response.json(); // Parse the error JSON
      const errorMessages = errorData.errors.map((e) => e.message).join(", "); // Extract error messages

      // Display the error message from the server's response
      errorMessage.innerText = `Failed to create post: ${errorMessages}`;
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error creating blog post:", error);
    errorMessage.innerText = `creating post failed: ${error.message}`;
    errorMessage.style.display = "block"; // Show error message
  } finally {
    loadingSpinner.style.display = "none"; // Hide loading spinner
    submitButton.disabled = false; // Re-enable the submit button
  }
}
