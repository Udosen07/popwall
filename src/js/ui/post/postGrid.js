import { reactToPost } from "./reactToPost";

// Helper function to check if the current user is following the author
function checkIfFollowing(authorName) {
  const followingList = JSON.parse(
    localStorage.getItem("followingList") || "[]"
  );
  return followingList.includes(authorName);
}

export function renderPosts(data, handleFollowButtonClick) {
  const gridList = document.getElementById("gridMainPost");
  gridList.innerHTML = "";

  if (data.length === 0) {
    gridList.innerHTML = "<h3>No posts available</h3>";
    return;
  }

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "gridPost";

    const formattedDate = new Date(item.created).toLocaleString();
    const imageUrl = item.author.avatar.url
      ? item.author.avatar.url
      : "https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png";

    // Check if the current user is following the author
    const isFollowing = checkIfFollowing(item.author.name);

    // Render post content with dynamic follow/unfollow button
    div.innerHTML = `
      <div class="gridPostHeader">
        <div class="gridProfile">
          <div class="profile-pic-container-post">
            <img src="${imageUrl}" alt="Profile Picture" class="profile-pic">
          </div>
          <div>
            <h2 class="profileName-post">${item.author.name}</h2>
            <p class="profileMail">${formattedDate}</p>
          </div>
        </div>
        <button class="gridPostHeaderBtn" id="followBtn">${
          isFollowing ? "Unfollow" : "Follow"
        }</button>
      </div>
      <p class="gridPostText">${item.body}</p>
      <div class="gridPostImg">
        <img src="${
          item.media?.url ||
          "https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4="
        }" alt="Image" />
      </div>
      <div class="gridPostReactions">
        <div><i class="fa-regular fa-thumbs-up" id="reaction" data-symbol="👍"></i> <span class="reaction-count">${
          item._count.reactions
        }</span></div>
        <div><i class="fa-solid fa-message"></i> ${item._count.comments}</div>
      </div>
    `;

    // Handle follow/unfollow button click
    const followButton = div.querySelector("#followBtn");
    followButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering post click event
      handleFollowButtonClick(followButton, item.author.name).then(() => {
        const newStatus = checkIfFollowing(item.author.name); // Re-check after the action
        followButton.textContent = newStatus ? "Unfollow" : "Follow"; // Update button text
      });
    });

    // Handle post reactions
    const thumbsUpIcon = div.querySelector("#reaction");
    thumbsUpIcon.addEventListener("click", async (event) => {
      event.stopPropagation();
      const postId = item.id;
      const symbol = thumbsUpIcon.getAttribute("data-symbol");
      const reactionCountElement = thumbsUpIcon.nextElementSibling;

      const reactionResult = await reactToPost(postId, symbol);

      if (reactionResult && reactionResult.success) {
        reactionCountElement.textContent = reactionResult.count;
      }
    });

    // Redirect to post details on post click
    div.addEventListener("click", () => {
      window.location.href = `./post/?id=${item.id}`;
    });

    // Append the post to the grid
    gridList.appendChild(div);
  });
}
