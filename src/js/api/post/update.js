import { API_KEY } from "../constants";

export async function updatePost(postId, postBody, apiUrl) {
  const token = localStorage.getItem("token");

  // Create the complete request body
  const requestBody = {
    ...postBody, // Spread the properties from postBody
    // You can add additional properties if needed, like tags
  };

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(requestBody), // Only stringify the requestBody
    });
    return response;
  } catch (error) {
    console.error("Post update failed:", error);
    throw error;
  }
}
