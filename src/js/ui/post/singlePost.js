import { readPost } from "../../api/post/read";
import { handleFollowButtonClick } from "../../api/profile/follow";
import { onDeletePost } from "./delete";
import { onGenerateComments, onSubmitComment } from "./postComment";
import { setupReactionListener } from "./postReaction";

// Helper function to check if the current user is following the author
async function checkIfFollowing(authorName) {
  const followingList = JSON.parse(
    localStorage.getItem("followingList") || "[]"
  );
  return followingList.includes(authorName);
}

export async function renderPost(postId) {
  const postDetail = document.getElementById("blogMainPost");

  try {
    const post = await readPost(postId);
    const { id, title, body, media, author, _count, comments } = post;

    const imageUrl =
      media?.url ||
      "https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4=";
    const date = new Date(post.created).toLocaleString();
    const reactions = post._count.reactions;
    const currentUserName = localStorage.getItem("username");

    // Conditionally render the edit and delete buttons based on username
    const isPostOwner = currentUserName === author.name;
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

    // Check if the current user is already following the author
    const isFollowing = await checkIfFollowing(author.name); // Call to a function that checks following status

    // Render the post details
    postDetail.innerHTML = `
      <div class="blogPost">
        <h1 class="blogPostHeader">${title}</h1>
        <div class="gridBlogPostHeader">
          <div class="gridProfile">
            <div class="profile-pic-container-post">
              <img src="https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png" alt="Profile Picture" class="profile-pic">
            </div>
            <div>
              <h2 class="profileName-post">${author.name}</h2>
              <p class="profileMail">${date}</p>
            </div>
          </div>
          <div class="gridPostHeaderBtnContainer">
              <button class="gridPostHeaderBtn" id="followBtn">${
                isFollowing ? "Unfollow" : "Follow"
              }</button>
              ${editDeleteButtons}
            </div>
        </div>
        <p class="gridBlogPostText">${body}</p>
        <div class="gridBlogPostImg">
          <img src="${imageUrl}" alt="Post Image"/>
        </div>
        <div class="gridPostReactions">
          <div><i class="fa-regular fa-thumbs-up" id="reaction" data-symbol="👍"></i> <span class="reaction-count">${reactions}</span></div>
          <div><i class="fa-solid fa-message"></i> ${_count.comments}</div>
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
      </div>
    `;

    if (isPostOwner) {
      document
        .getElementById("delete-post")
        .addEventListener("click", (event) => {
          onDeletePost(id);
        });
    }

    // Handle follow/unfollow button click
    const followBtn = document.getElementById("followBtn");
    followBtn.addEventListener("click", async (e) => {
      await handleFollowButtonClick(followBtn, author.name);
      const newStatus = await checkIfFollowing(author.name); // Re-check after the action
      followBtn.textContent = newStatus ? "Unfollow" : "Follow"; // Update button text
    });

    document.getElementById("submitComment").addEventListener("click", (e) =>
      onSubmitComment(postId, e).then((res) => {
        if (res.data) {
          renderPost(postId);
        }
      })
    );

    setupReactionListener(id);
    onGenerateComments(comments);
  } catch (error) {
    console.error(error);
  }
}
