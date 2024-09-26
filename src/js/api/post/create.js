// src/js/api/post/post.js

import { getToken } from "../../utilities/token";
import { API_KEY, API_SOCIAL_POSTS } from "../constants";
import { headers } from "../headers";

export async function createPost(postData) {
  const token = getToken();

  try {
    const response = await fetch(API_SOCIAL_POSTS, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(postData),
    });
    return response;
  } catch (error) {
    console.error("Post Creation failed:", error);
    throw error;
  }
}
