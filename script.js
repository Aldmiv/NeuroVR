const revealElements = document.querySelectorAll("[data-reveal]");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navigationEntry = performance.getEntriesByType("navigation")[0];

if (navigationEntry?.type === "reload") {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("load", () => {
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });
  });
}

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -64px 0px",
    },
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    observer.observe(element);
  });
}

if (navToggle && siteNav) {
  const mobileNavQuery = window.matchMedia("(max-width: 720px)");

  const setNavState = (isOpen) => {
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Закрыть навигацию" : "Открыть навигацию",
    );
    siteNav.classList.toggle("is-open", isOpen);
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavState(!isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNavQuery.matches) {
        setNavState(false);
      }
    });
  });

  mobileNavQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      setNavState(false);
    }
  });
}
