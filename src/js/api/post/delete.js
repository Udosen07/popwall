// src/js/api/post/delete.js
import { getToken } from "../../utilities/token";
import { API_KEY, API_SOCIAL_POSTS } from "../constants";
import { headers } from "../headers";

export async function deletePost(id) {
  const apiUrl = `${API_SOCIAL_POSTS}/${id}`;
  const token = getToken();

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        ...headers(),
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}
