//src/js/ui/post/update.js

import { readPost } from "../../api/post/read";
import { updatePost } from "../../api/post/update";

export async function onUpdatePost() {
  const postId = new URLSearchParams(window.location.search).get("id");
  const form = document.getElementById("editPostForm");

  if (!postId) {
    console.error("No post ID found.");
    return;
  }

  // Fetch post data to populate the form
  async function fetchPostData() {
    try {
      const responseData = await readPost(postId);
      populateForm(responseData);
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  }

  // Populate the form with the fetched post data
  function populateForm(data) {
    const titleInput = document.getElementById("postTitle");
    const bodyInput = document.getElementById("postBody");
    const mediaInput = document.getElementById("postMedia");

    if (titleInput) titleInput.value = data.title;
    if (bodyInput) bodyInput.value = data.body;
    if (mediaInput) mediaInput.value = data.media?.url || "";
  }

  // Handle form submission
  async function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById("postTitle").value;
    const body = document.getElementById("postBody").value;
    const media = document.getElementById("postMedia").value;

    try {
      const postData = {
        title,
        body,
        media: { url: media },
      };

      await updatePost(postId, postData);
      alert("Post updated successfully!");
      window.location.href = `/post/?id=${postId}`;
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  }

  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  fetchPostData();
}
