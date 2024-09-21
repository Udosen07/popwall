import {
  API_KEY,
  API_SOCIAL_POSTS,
  API_SOCIAL_PROFILES,
} from "../../api/constants";
import { headers } from "../../api/headers";

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Get the post ID from the query parameters
const postId = getQueryParameter("id");

// Function to fetch the blog post details
function fetchBlogPost(postId) {
  const apiUrl = `${API_SOCIAL_POSTS}/${postId}?_author=true&_comments=true&_reactions=true`;
  const token = localStorage.getItem("token");
  const currentUserName = localStorage.getItem("username"); // Get the current user's username

  async function fetchPostDetails() {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          ...headers(),
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });
      const data = await response.json();
      const post = data.data;
      const id = post.id;
      const title = post.title;
      const body = post.body;
      const imageUrl = post.media?.url;
      const authorName = post.author.name;
      const date = new Date(post.created).toLocaleString();
      const reactions = post._count.reactions;
      const comments = post._count.comments;
      const commentsArray = post.comments;

      // Conditionally render the edit and delete buttons based on username
      const isPostOwner = currentUserName === authorName;
      const editDeleteButtons = isPostOwner
        ? `
      <a href="/post/edit/?id=${id}">
        <button class="gridPostHeaderBtn">
          <i class="fa-solid fa-pen"></i>
        </button>
      </a>
      <button class="gridPostHeaderBtn" id="delete-post">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `
        : "";

      // Display post details
      const postDetail = document.getElementById("blogMainPost");
      postDetail.innerHTML = `
        <div class="blogPost">
          <h1 class="blogPostHeader">${title}</h1>
          <div class="gridBlogPostHeader">
            <div class="gridProfile">
              <div class="profile-pic-container-post">
                <img src="https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png" alt="Profile Picture" class="profile-pic">
              </div>
              <div>
                <h2 class="profileName-post">${authorName}</h2>
                <p class="profileMail">${date}</p>
              </div>
            </div>
            <div class="gridPostHeaderBtnContainer">
              <button class="gridPostHeaderBtn" id="followBtn">Follow</button>
              ${editDeleteButtons} <!-- Show edit/delete if the user is the author -->
            </div>
          </div>
          <p class="gridBlogPostText">${body}</p>
          <div class="gridBlogPostImg">
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="Post Image"/>`
                : `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s" alt="Default Image"/>`
            }
          </div>
          <div class="gridPostReactions">
            <div><i class="fa-regular fa-thumbs-up" id="reaction" data-symbol="👍"></i> <span className="reaction-count">${reactions}</span></div>
            <div><i class="fa-solid fa-message"></i> ${comments}</div>
          </div>
          <div class="blogPostComment">
            <h4>All comments</h4>
            <div id="commentsSection"></div> <!-- Placeholder for the comments -->
            <!-- Add Comment Section -->
           <form id="addCommentSection">
            <textarea id="newComment" placeholder="Add a comment..." rows="3" required></textarea>
          <button id="submitComment">Submit</button>
          </form>
        </div>
      `;

      // Event listener for delete button
      if (isPostOwner) {
        document.getElementById("delete-post").addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this post?")) {
            fetch(apiUrl, {
              method: "DELETE",
              headers: {
                ...headers(),
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
              },
            })
              .then((response) => {
                if (response.ok) {
                  alert("Post deleted successfully.");
                  window.location.href = "/";
                } else {
                  alert("Failed to delete the post.");
                }
              })
              .catch((error) => {
                console.error("Error deleting the post:", error);
                alert("Error deleting the post.");
              });
          }
        });
      }

      // Attach event listener to submit comment button
      document
        .getElementById("submitComment")
        .addEventListener("click", (e) => {
          const commentBody = document
            .getElementById("newComment")
            .value.trim();
          if (commentBody) {
            submitComment(postId, commentBody, e); // Submit comment to the post
          } else {
            alert("Please enter a comment.");
          }
        });

      // Add event listener to Follow button within the context of the item
      const followButton = document.getElementById("followBtn");
      if (followButton) {
        followButton.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent triggering parent click events
          handleFollowButtonClick(followButton, authorName);
        });
      }

      generateComments(commentsArray);

      // Add event listener to thumbs-up icon
      const thumbsUpIcon = document.querySelector("#reaction");
      if (thumbsUpIcon) {
        thumbsUpIcon.addEventListener("click", async (event) => {
          event.stopPropagation();
          const postId = id;
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
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  }

  fetchPostDetails();
}

if (postId) {
  fetchBlogPost(postId);
} else {
  document.getElementById("blogMainPost").innerText =
    "Invalid post ID or username.";
}

// Function to generate the comments and replies dynamically
function generateComments(commentsArray) {
  const commentsSection = document.getElementById("commentsSection");
  commentsSection.innerHTML = ""; // Clear existing comments

  // Create a map to track comments by their ID
  const commentMap = new Map();

  // First, loop through the comments and group them by their commentId (or replyToId)
  commentsArray.forEach((comment) => {
    // If it's a reply, add it under the corresponding parent comment
    if (comment.replyToId) {
      const parentComment = commentMap.get(comment.replyToId);
      if (parentComment) {
        // If parent exists, add the reply to it
        parentComment.replies = parentComment.replies || [];
        parentComment.replies.push(comment);
      }
    } else {
      // If it's a top-level comment, add it to the map
      commentMap.set(comment.id, comment);
    }
  });

  // Now render the comments with replies nested underneath
  commentMap.forEach((comment) => {
    const commentDate = new Date(comment.created).toLocaleString();
    const commentHtml = `
    <div class="blogProfile">
      <div class="profile-pic-container-blog">
        <img src="${comment.author.avatar.url}" alt="${comment.author.avatar.alt}" class="profile-pic">
      </div>
      <div>
        <div class="commentSec">
          <h2 class="commentProfileName">${comment.author.name}</h2>
          <p class="comment">${comment.body}</p>
          <p>${commentDate}</p>
          <textarea class="replyInput" id="replyInput-${comment.id}" placeholder="Reply to this comment..." rows="2"></textarea>
          <button class="replyButton" data-comment-id="${comment.id}">Reply</button>
        </div>
      </div>
    </div>
    `;

    // Append the comment to the comments section
    commentsSection.innerHTML += commentHtml;

    // Now, check if this comment has any replies and render them nested
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach((reply) => {
        const replyDate = new Date(reply.created).toLocaleString();
        const replyHtml = `
        <div class="blogProfile reply">
          <div class="profile-pic-container-blog">
            <img src="${reply.author.avatar.url}" alt="${reply.author.avatar.alt}" class="profile-pic">
          </div>
          <div>
            <div class="replySec">
              <h2 class="replyProfileName">${reply.author.name}</h2>
              <p class="replyComment">${reply.body}</p>
              <p>${replyDate}</p>
            </div>
          </div>
        </div>
        `;
        // Append the reply to the comments section but indent it
        commentsSection.innerHTML += `<div class="replyContainer">${replyHtml}</div>`;
      });
    }
    // Attach event listeners to all reply buttons
    const replyButtons = document.querySelectorAll(".replyButton");
    replyButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const commentId = event.target.dataset.commentId;
        const replyBody = document
          .getElementById(`replyInput-${commentId}`)
          .value.trim();
        if (replyBody) {
          replyToComment(postId, commentId, replyBody); // Submit reply for the comment
        } else {
          alert("Please enter a reply.");
        }
      });
    });
  });
}

// Function to handle comment submission
async function submitComment(postId, commentBody, e) {
  e.preventDefault();
  const apiUrl = `${API_SOCIAL_POSTS}/${postId}/comment`;
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ body: commentBody }), // Send the comment body
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Comment added:", data);
      fetchBlogPost(postId); // Fetch the updated post with new comments
    } else {
      console.error("Failed to add comment.");
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
}

// Handle replying to a comment
async function replyToComment(postId, commentId, replyBody) {
  const apiUrl = `${API_SOCIAL_POSTS}/${postId}/comment`;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ body: replyBody, replyToId: Number(commentId) }), // Send the reply body
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Reply added:", data);
      fetchBlogPost(postId); // Refresh comments after reply
    } else {
      console.error("Failed to reply to comment.");
    }
  } catch (error) {
    console.error("Error replying to comment:", error);
  }
}

// Function to handle follow/unfollow
async function handleFollowButtonClick(followButton, authorName) {
  const isFollowing = followButton.textContent.trim() === "Unfollow"; // Check current state

  const url = isFollowing ? `${authorName}/unfollow` : `${authorName}/follow`;
  const token = localStorage.getItem("token");

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
    followButton.textContent = isFollowing ? "Follow" : "Unfollow";
  } catch (error) {
    console.error("Error following/unfollowing profile:", error);
  }
}

async function reactToPost(postId, symbol) {
  const url = `https://v2.api.noroff.dev/social/posts/${postId}/react/${symbol}`;
  const token = localStorage.getItem("token");
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
