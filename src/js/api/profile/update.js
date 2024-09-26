import { getToken } from "../../utilities/token";
import { API_KEY, API_SOCIAL_PROFILES } from "../constants";
import { headers } from "../headers";

export async function updateProfile(username, { avatar, bio }) {
  try {
    const token = getToken();

    // Create the avatar object
    const avatarObject = {
      url: avatar,
      alt: "User Avatar",
    };

    const profileData = {
      bio,
      avatar: avatarObject,
    };

    const response = await fetch(`${API_SOCIAL_PROFILES}/${username}`, {
      method: "PUT",
      headers: {
        ...headers(),
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update the profile");
    }

    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
