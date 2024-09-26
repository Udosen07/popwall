export function scrollToTop() {
  const mainBody = document.querySelector(".mainBody");
  if (mainBody) {
    mainBody.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
