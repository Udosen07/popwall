// src/js/api/post/read.js

import { getToken } from "../../utilities/token";
import { API_KEY, API_SOCIAL_POSTS } from "../constants";
import { headers } from "../headers";

const token = getToken();

export async function readPost(id) {
  try {
    console.log("About to read post with id:", id);
    const response = await fetch(
      `${API_SOCIAL_POSTS}/${id}?_author=true&_comments=true&_reactions=true`,
      {
        method: "GET",
        headers: {
          ...headers(),
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }

    const responseData = await response.json();

    return responseData.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

export async function readPosts(limit = 12, page = 1, tag) {
  let url = `${API_SOCIAL_POSTS}?limit=${limit}&page=${page}`;
  if (tag) {
    url += `&tag=${tag}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...headers(),
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function readPostsByUser(username, limit = 12, page = 1, tag) {
  let url = `${API_SOCIAL_POSTS}?username=${username}&limit=${limit}&page=${page}`;
  if (tag) {
    url += `&tag=${tag}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...headers(),
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts for user");
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error("Error fetching posts for user:", error);
    throw error;
  }
}
