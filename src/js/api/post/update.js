//src/js/api/post/update.js

import { getToken } from "../../utilities/token";
import { API_KEY, API_SOCIAL_POSTS } from "../constants";
import { headers } from "../headers";

export async function updatePost(id, { title, body, tags, media }) {
  try {
    const token = getToken();
    const postData = {
      title,
      body,
      tags,
      media: { url: media.url },
    };

    const response = await fetch(`${API_SOCIAL_POSTS}/${id}`, {
      method: "PUT",
      headers: {
        ...headers(),
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to update the post");
    }

    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}
