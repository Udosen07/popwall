import { getToken } from "../../utilities/token";
import { API_KEY, API_SOCIAL_POSTS } from "../constants";
import { headers } from "../headers";

export async function replyToComment(postId, commentId, replyBody) {
  const apiUrl = `${API_SOCIAL_POSTS}/${postId}/comment`;
  const token = getToken();

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ body: replyBody, replyToId: Number(commentId) }),
    });

    if (response.ok) {
      const data = await response.json();

      return data;
      //fetchBlogPost(postId);
    } else {
      console.error("Failed to reply to comment.");
    }
  } catch (error) {
    console.error("Error replying to comment:", error);
  }
}
