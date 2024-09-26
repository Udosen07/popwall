// src/js/ui/delete/post.js
import { deletePost } from "../../api/post/delete";

export async function onDeletePost(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    try {
      const success = await deletePost(postId);
      if (success) {
        alert("Post deleted successfully.");
        window.location.href = "/";
      } else {
        alert("Failed to delete the post.");
      }
    } catch (error) {
      console.error("Error deleting the post:", error);
      alert("Error deleting the post.");
    }
  }
}
