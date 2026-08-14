(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("main section[id]");
  var toTop = document.getElementById("to-top");
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function closeMenu() {
    if (!header || !toggle || !mobileNav) return;
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    mobileNav.hidden = true;
    document.body.style.overflow = "";
  }

  function openMenu() {
    header.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    mobileNav.hidden = false;
    document.body.style.overflow = "hidden";
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      if (header.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  function onScrollChrome() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    if (toTop) {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    }
  }

  onScrollChrome();
  window.addEventListener("scroll", onScrollChrome, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      var offset = header ? header.offsetHeight - 1 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  function setActiveLink() {
    var offset = (header ? header.offsetHeight : 80) + 80;
    var current = "home";

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top - offset <= 0) {
        current = section.id;
      }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1].id;
    }

    if (current === "cta") current = "contact";

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el, index) {
      el.style.transitionDelay = Math.min(index % 4, 3) * 80 + "ms";
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setFieldError(input, isError) {
    var field = input.closest(".field");
    if (field) field.classList.toggle("is-error", isError);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.elements.namedItem("name");
      var email = form.elements.namedItem("email");
      var message = form.elements.namedItem("message");
      var valid = true;

      [name, email, message].forEach(function (input) {
        var empty = !input.value.trim();
        setFieldError(input, empty);
        if (empty) valid = false;
      });

      if (email.value.trim() && !isValidEmail(email.value.trim())) {
        setFieldError(email, true);
        valid = false;
      }

      if (!valid) {
        statusEl.textContent = "Please complete the required fields.";
        return;
      }

      statusEl.textContent = "Thank you. Your note has been received.";
      form.reset();
      [name, email, message].forEach(function (input) {
        setFieldError(input, false);
      });
    });

    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        setFieldError(input, false);
        if (statusEl && statusEl.textContent.indexOf("Please") === 0) {
          statusEl.textContent = "";
        }
      });
    });
  }

})();
