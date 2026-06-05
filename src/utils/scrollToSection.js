export function scrollToSection(targetId, offset = 96) {
  if (targetId === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  let attempts = 0;

  function tryScroll() {
    const target = document.getElementById(targetId);

    if (target) {
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
      return;
    }

    attempts += 1;
    if (attempts < 20) {
      window.setTimeout(tryScroll, 80);
    }
  }

  tryScroll();
}
