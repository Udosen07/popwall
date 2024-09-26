import { API_KEY, API_SOCIAL_PROFILES } from "../constants";
import { headers } from "../headers";
import { getToken } from "../../utilities/token";

export async function handleFollowButtonClick(button, profileName) {
  const token = getToken();

  const isFollowing = button.textContent.trim() === "Unfollow";
  const url = isFollowing ? `${profileName}/unfollow` : `${profileName}/follow`;

  try {
    const response = await fetch(`${API_SOCIAL_PROFILES}/${url}`, {
      method: "PUT",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.errors && errorData.errors.length > 0
          ? errorData.errors[0].message
          : "Failed to follow/unfollow profile";

      throw new Error(errorMessage);
    }

    // Update button text based on the new state
    button.textContent = isFollowing ? "Follow" : "Unfollow";

    // Update localStorage to reflect the new follow status
    updateFollowStatus(profileName, !isFollowing);
  } catch (error) {
    console.error(error.message);
    alert(`Error: ${error.message}`);
  }
}

// Helper function to update follow status in localStorage
function updateFollowStatus(profileName, isFollowing) {
  let followingList = JSON.parse(localStorage.getItem("followingList") || "[]");

  if (isFollowing) {
    // Add to the following list if following
    if (!followingList.includes(profileName)) {
      followingList.push(profileName);
    }
  } else {
    // Remove from the following list if unfollowing
    followingList = followingList.filter((name) => name !== profileName);
  }

  localStorage.setItem("followingList", JSON.stringify(followingList));
}
