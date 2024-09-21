import { API_SOCIAL_POSTS } from "../../api/constants";
import { updatePost } from "../../api/post/update";

// Function to get the query parameter by name
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const postId = getQueryParameter("id"); // Extract post ID from the URL
const apiUrl = `${API_SOCIAL_POSTS}/${postId}`;

// Fetch the existing blog post and pre-populate the form
// async function fetchBlogPost() {
//   try {
//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "X-Noroff-API-Key": API_KEY,
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch post.");

//     const data = await response.json();
//     const post = data.data;

//     document.getElementById("title").value = post.title;
//     document.getElementById("image").value = post.media.url || "";
//     document.getElementById("content").value = post.body;
//   } catch (error) {
//     console.error("Error fetching blog post:", error);
//     document.getElementById("errorMessage").innerText =
//       "Failed to fetch the post.";
//     document.getElementById("errorMessage").style.display = "block";
//   }
// }

// Function to update the blog post
async function updateBlogPost(postId, postBody, apiUrl) {
  try {
    const response = await updatePost(postId, postBody, apiUrl);

    if (!response.ok) throw new Error("Failed to update the post.");

    alert("Blog post updated successfully!");
    window.location.href = "/";
  } catch (error) {
    console.error("Error updating the post:", error);
    alert("Error updating the post.");
  }
}

// Set up form submission listener
document.addEventListener("DOMContentLoaded", () => {
  if (postId) {
    // fetchBlogPost(); // Fetch the post details when the page loads

    document.getElementById("editPost").addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission

      const postBody = {
        title: document.getElementById("title").value,
        media: {
          url: document.getElementById("image").value,
        },
        body: document.getElementById("content").value,
      };

      updateBlogPost(postBody, postBody, apiUrl); // Call update function with the updated post
    });
  } else {
    alert("Invalid post ID");
  }
});
