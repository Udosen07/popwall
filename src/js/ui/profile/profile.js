export function renderProfile(data) {
  const profileGrid = document.getElementById("gridProfileContainer");

  let imageUrl;

  if (data.avatar instanceof File) {
    imageUrl = URL.createObjectURL(data.avatar);
  } else {
    imageUrl = data.avatar?.url
      ? data.avatar.url
      : "https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png";
  }

  // Render the profile details
  const profileItems = `
      <div class="gridProfile">
        <div class="profile-pic-container-nav">
          <img src="${imageUrl}" alt="${
    data.avatar?.alt || "Profile Picture"
  }" class="profile-pic">
        </div>
        <div>
          <h2 class="profileName">${data.name || "Anonymous User"}</h2>
          <p class="profileMail">${data.email || "Email not available"}</p>
        </div>
      </div>
    `;

  // Update the grid with the profile items
  profileGrid.innerHTML = profileItems;

  // Update the navigation bar profile picture
  const navProfilePic = document.querySelector(".profile-pic-container img");
  if (navProfilePic) {
    navProfilePic.src = imageUrl;
  }
}
