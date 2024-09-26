import { getToken } from "../../utilities/token";
import { API_KEY, API_SOCIAL_POSTS } from "../constants";

export async function reactPost(postId, symbol) {
  const apiUrl = `${API_SOCIAL_POSTS}/${postId}/react/${symbol}`;
  const token = getToken();

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });
    console.log("Response status:", response.status); // Log response status
    if (!response.ok) {
      console.error(`Error: ${response.statusText}`); // Log error details
      throw new Error(`Failed to react to post: ${response.statusText}`);
    }

    return response; // Return the full response object
  } catch (error) {
    console.error("Error reacting to post:", error);
  }
}
