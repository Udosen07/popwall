import { handleFollowButtonClick } from "../../api/profile/follow";

export async function onFollowButtonClick(event, authorName) {
  const followButton = event.target;
  const isFollowing = followButton.textContent === "Unfollow";

  try {
    await handleFollowButtonClick(followButton, authorName);
    followButton.textContent = isFollowing ? "Follow" : "Unfollow";
  } catch (error) {
    alert(`Failed to ${isFollowing ? "unfollow" : "follow"}: ${error.message}`);
  }
}
