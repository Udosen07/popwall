import { getToken } from "../../utilities/token";
import { API_KEY, API_SOCIAL_POSTS } from "../constants";
import { headers } from "../headers";

const token = getToken();
export async function submitComment(postId, commentBody) {
  console.log(postId, commentBody);
  const apiUrl = `${API_SOCIAL_POSTS}/${postId}/comment`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ body: commentBody }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
}

export async function fetchComments(postId) {
  const apiUrl = `${API_SOCIAL_POSTS}/${postId}/comments`;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        ...headers(),
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}
