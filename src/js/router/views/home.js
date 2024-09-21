import { authGuard } from "../../utilities/authGuard";
import {
  API_KEY,
  API_SOCIAL_POSTS,
  API_SOCIAL_PROFILES,
} from "../../api/constants";
import { headers } from "../../api/headers";

authGuard();

const token = localStorage.getItem("token");
const name = localStorage.getItem("username");
let currentPage = 1;
const postsPerPage = 12;

const hamburger = document.getElementById("hamburger");
if (hamburger) {
  // Check if the hamburger menu exists
  hamburger.addEventListener("click", function () {
    const menu = document.getElementById("navLinks");
    if (menu) {
      menu.classList.toggle("active"); // Toggle the active class on the menu
    }
  });
}

// Function to handle follow/unfollow
async function handleFollowButtonClick(button, profileName) {
  const isFollowing = button.textContent.trim() === "Unfollow"; // Check current state

  const url = isFollowing ? `${profileName}/unfollow` : `${profileName}/follow`;

  try {
    const response = await fetch(`${API_SOCIAL_PROFILES}/${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to follow/unfollow profile");
    }

    // Update button text based on the new state
    button.textContent = isFollowing ? "Follow" : "Unfollow";
  } catch (error) {
    console.error("Error following/unfollowing profile:", error);
  }
}

async function profileData() {
  const profileGrid = document.getElementById("gridProfileContainer");

  try {
    const response = await fetch(`${API_SOCIAL_PROFILES}/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const responseData = await response.json();
    console.log("Fetched data:", responseData);
    const data = responseData.data;

    profileGrid.innerHTML = "";
    // Build the profile information dynamically
    const imageUrl = data.avatar?.url
      ? data.avatar.url
      : "https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png";

    const profileItems = `
      <div class="gridProfile">
        <div class="profile-pic-container-nav">
          <img src="${imageUrl}" alt="${
      data.avatar?.alt || "Profile Picture"
    }" class="profile-pic">
        </div>
        <div>
          <h2 class="profileName">${data.name}</h2>
          <p class="profileMail">${data.email}</p>
        
        </div>
      </div>
    `;

    profileGrid.innerHTML = profileItems;
  } catch (error) {
    console.error("Error fetching data:", error);
    profileGrid.innerHTML = "<h3>Error loading data.........</h3>";
  }
}

// API fetch function to get grid data
async function fetchGridData(page = 1) {
  const gridList = document.getElementById("gridMainPost");

  if (!gridList) {
    console.error("Error: gridMainPost element not found");
    return;
  }

  try {
    const response = await fetch(
      `${API_SOCIAL_POSTS}?_author=true&_comments=true&_reactions=true&limit=${postsPerPage}&page=${page}`,
      {
        method: "GET",
        headers: {
          ...headers(),
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const responseData = await response.json();
    const data = responseData.data;

    gridList.innerHTML = "";

    if (data.length === 0) {
      gridList.innerHTML = "<h3>No posts available</h3>";
      return;
    }

    const gridItems = data.map((item) => {
      const div = document.createElement("div");
      div.className = "gridPost";

      const formattedDate = new Date(item.created).toLocaleString();
      const imageUrl = item.author.avatar.url
        ? item.author.avatar.url
        : "https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png";

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
            <button class="gridPostHeaderBtn" id="followBtn">Follow</button>
          </div>
          <p class="gridPostText">${item.body}</p>
          <div class="gridPostImg">
          <img src="${
            item.media?.url ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s"
          }" alt="${item.media?.alt || "Default Image"}"/>
          </div>

          <div class="gridPostReactions">
            <div><i class="fa-regular fa-thumbs-up" id="reaction" data-symbol="👍"></i> <span className="reaction-count">${
              item._count.reactions
            }</span></div>
            <div><i class="fa-solid fa-message"></i> ${
              item._count.comments
            }</div>
          </div>
        `;
      // Add event listener to Follow button within the context of the item
      const followButton = div.querySelector("#followBtn");
      if (followButton) {
        followButton.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent triggering parent click events
          handleFollowButtonClick(followButton, item.author.name);
        });
      }

      // Add event listener to thumbs-up icon
      const thumbsUpIcon = div.querySelector("#reaction");
      if (thumbsUpIcon) {
        thumbsUpIcon.addEventListener("click", async (event) => {
          event.stopPropagation();
          const postId = item.id;
          const symbol = thumbsUpIcon.getAttribute("data-symbol");
          const reactionCountElement = thumbsUpIcon.nextElementSibling;

          if (!reactionCountElement) {
            console.error("Reaction count element not found");
            return;
          }
          const reactionResult = await reactToPost(postId, symbol);

          if (reactionResult && reactionResult.success) {
            reactionCountElement.textContent = reactionResult.count;
          }
        });
      }

      div.addEventListener("click", () => {
        window.location.href = `./post/?id=${item.id}`;
      });

      return div;
    });

    gridList.innerHTML = ""; // Clear any previous content
    gridItems.forEach((div) => gridList.appendChild(div));

    updatePaginationControls(responseData.meta);
  } catch (error) {
    console.error("Error fetching data:", error);
    gridList.innerHTML = "<h3>Error loading data.........</h3>";
  }
}

async function reactToPost(postId, symbol) {
  const url = `https://v2.api.noroff.dev/social/posts/${postId}/react/${symbol}`;
  try {
    console.log(symbol);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to react to post");
    }

    const reactionData = await response.json();
    console.log("Reaction successful:", reactionData);

    // Return the new count based on the reaction data
    const count =
      reactionData.data.reactions.length > 0
        ? reactionData.data.reactions[0].count
        : 0; // Count will be 0 if there are no reactions

    return { success: true, count };
  } catch (error) {
    console.error("Error reacting to post:", error);
    return { success: false };
  }
}

function scrollToTop() {
  const mainBody = document.querySelector(".mainBody");
  if (mainBody) {
    mainBody.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: Adds smooth scrolling animation
    });
  }
}

function updatePaginationControls(meta) {
  const paginationControls = document.getElementById("paginationControls");

  if (!paginationControls) return;

  paginationControls.innerHTML = ""; // Clear existing controls

  // Previous button
  if (!meta.isFirstPage) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => {
      currentPage--;
      fetchGridData(currentPage).then(scrollToTop);
    });
    paginationControls.appendChild(prevButton);
  }

  // Next button
  if (!meta.isLastPage) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      currentPage++;
      fetchGridData(currentPage).then(scrollToTop);
    });
    paginationControls.appendChild(nextButton);
  }
}

// Add logout functionality
const logoutLink = document.querySelector("#logout");
logoutLink.addEventListener("click", function () {
  // Clear local storage and reload the page
  localStorage.removeItem("username");
  localStorage.removeItem("token"); // Optional if you're using tokens
  window.location.href = "/auth/login/"; // Refresh the page to reflect changes
});

fetchGridData();
profileData();
