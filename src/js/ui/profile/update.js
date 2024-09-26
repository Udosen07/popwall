import { readProfile } from "../../api/profile/read";
import { updateProfile } from "../../api/profile/update";

export async function onUpdateProfile(event) {
  const form = document.getElementById("updateProfileForm");

  const username = localStorage.getItem("username");

  // Fetch profile data
  async function fetchProfileData() {
    try {
      const responseData = await readProfile(username);
      populateForm(responseData);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  // Populate form with profile data
  function populateForm(data) {
    const usernameDisplay = document.getElementById("name");
    const bioDisplay = document.getElementById("userbio");
    const pixDisplay = document.getElementById("profilePic");
    const postDisplay = document.getElementById("fpost");
    const followersDisplay = document.getElementById("ffollowers");
    const followingDisplay = document.getElementById("ffollowing");

    if (usernameDisplay) usernameDisplay.textContent = data.data.name;
    if (bioDisplay) bioDisplay.textContent = data.data.bio;
    if (postDisplay) postDisplay.textContent = data.data._count.posts;
    if (followersDisplay)
      followersDisplay.textContent = data.data._count.followers;
    if (followingDisplay)
      followingDisplay.textContent = data.data._count.following;

    // Update the profile picture
    if (pixDisplay && data.data.avatar && data.data.avatar.url) {
      pixDisplay.src = data.data.avatar.url;
    } else {
      pixDisplay.src =
        "https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png";
    }
  }

  // Handle form submission
  async function handleFormSubmit(event) {
    event.preventDefault();

    const avatarFile = document.querySelector("#avatar").value;
    const bioText = document.querySelector("#bio").value;

    const profileData = {
      bio: bioText,
      avatar: avatarFile ? avatarFile : null,
    };

    try {
      await updateProfile(username, profileData);
      alert("Profile updated successfully!");
      fetchProfileData();
      form.reset();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  }

  // Add event listener to form for submission
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  // Fetch profile data when the form loads
  fetchProfileData();
}
