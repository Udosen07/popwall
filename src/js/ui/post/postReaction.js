import { reactToPost } from "./reactToPost";

export function setupReactionListener(postId) {
  const thumbsUpIcon = document.querySelector("#reaction");
  if (thumbsUpIcon) {
    thumbsUpIcon.addEventListener("click", async (event) => {
      event.stopPropagation();
      const symbol = thumbsUpIcon.getAttribute("data-symbol");
      const reactionCountElement = thumbsUpIcon.nextElementSibling;

      if (!reactionCountElement) {
        console.error("Reaction count element not found");
        return;
      }

      const reactionResult = await reactToPost(postId, symbol);
      if (reactionResult?.success) {
        reactionCountElement.textContent = reactionResult.count;
      }
    });
  }
}
