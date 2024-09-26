import { renderPost } from "../../ui/post/singlePost";
import { authGuard } from "../../utilities/authGuard";

authGuard();

const postId = new URLSearchParams(window.location.search).get("id");

if (postId) {
  renderPost(postId);
} else {
  document.getElementById("blogMainPost").innerText = "Invalid post ID.";
}
