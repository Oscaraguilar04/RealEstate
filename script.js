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

  function scrollToId(id) {
    var target = document.querySelector(id);
    if (!target) return;
    var offset = header ? header.offsetHeight - 1 : 0;
    var top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      if (!document.querySelector(id)) return;
      event.preventDefault();
      scrollToId(id);
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
    if (current === "stories") current = "process";

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

  var journeys = {
    buy: [
      {
        title: "Discovery call",
        copy: "A twenty-minute conversation to understand neighborhood, budget, timing, and what a successful move actually looks like for your household.",
        points: [
          "Confirm must-haves versus nice-to-haves",
          "Map school, commute, and daily-life constraints",
          "Set a search window and a decision cadence"
        ],
        cta: "Book a buyer consultation",
        intent: "buying"
      },
      {
        title: "Search & private tours",
        copy: "Esme builds a short list, including off-market opportunities when they fit. Tours are scheduled in a single block so you can compare homes in one afternoon.",
        points: [
          "Live inventory plus quiet listings",
          "On-site notes after every showing",
          "A weekly recap so nothing gets lost"
        ],
        cta: "Request a private tour",
        intent: "tour"
      },
      {
        title: "Offer strategy",
        copy: "When the right home appears, you get a pricing range, a term sheet, and a clear recommendation — including when walking away is the stronger move.",
        points: [
          "Comparable sales, not guesswork",
          "Contingencies written to protect you",
          "A negotiation plan before the offer goes in"
        ],
        cta: "Talk through an offer",
        intent: "buying"
      },
      {
        title: "Due diligence",
        copy: "Inspections, appraisal, and repair requests are sequenced so dates do not slip. You always know what is still open and what is already resolved.",
        points: [
          "Trusted inspectors and vendors",
          "Repair requests in writing",
          "A calendar through closing day"
        ],
        cta: "Ask about the process",
        intent: "buying"
      },
      {
        title: "Close & keys",
        copy: "Final walkthrough, signing, and a handoff that includes utilities, vendors, and the small details that make the first week feel settled.",
        points: [
          "Walkthrough checklist",
          "Closing timeline you can share",
          "Introductions for the first 30 days"
        ],
        cta: "Begin as a buyer",
        intent: "buying"
      }
    ],
    sell: [
      {
        title: "Home valuation",
        copy: "A private pricing conversation grounded in recent sales, the condition of your home, and the timing you actually need — not a number designed to win the listing.",
        points: [
          "On-site walkthrough and comparable set",
          "Net-sheet so you see proceeds, not just price",
          "A recommended list date"
        ],
        cta: "Get a home valuation",
        intent: "selling"
      },
      {
        title: "Prepare to list",
        copy: "What to repair, what to leave, and how the home should photograph. The work is specific, so you are not staging for a catalog that does not match the house.",
        points: [
          "Punch list with cost versus return",
          "Photography and copy in one sequence",
          "Disclosures gathered before launch"
        ],
        cta: "Plan a listing",
        intent: "selling"
      },
      {
        title: "Launch & show",
        copy: "The home goes live with a showing plan. Feedback is collected after every tour so pricing and presentation can be adjusted without drama.",
        points: [
          "Broker preview and public launch",
          "Showings in defined windows",
          "Written feedback within 24 hours"
        ],
        cta: "Discuss a launch date",
        intent: "selling"
      },
      {
        title: "Review offers",
        copy: "Each offer is scored on price, terms, certainty, and timeline. You see the tradeoffs plainly, then choose with a recommendation attached.",
        points: [
          "Side-by-side offer comparison",
          "Counter-strategy before you reply",
          "Protection around appraisal and inspection"
        ],
        cta: "Review seller strategy",
        intent: "selling"
      },
      {
        title: "Close & move",
        copy: "Escrow, buyer requests, and your next housing step stay on one calendar. If you are also buying, the two closings are sequenced on purpose.",
        points: [
          "Repair and credit negotiations",
          "Move-out timeline",
          "Option to pair with a purchase"
        ],
        cta: "Begin as a seller",
        intent: "selling"
      }
    ]
  };

  var journeyState = { path: "buy", step: 0, timer: null };
  var stepsEl = document.getElementById("journey-steps");
  var indexEl = document.getElementById("journey-index");
  var titleEl = document.getElementById("journey-title");
  var copyEl = document.getElementById("journey-copy");
  var pointsEl = document.getElementById("journey-points");
  var ctaEl = document.getElementById("journey-cta");
  var panelEl = document.getElementById("journey-panel");
  var prevBtn = document.getElementById("journey-prev");
  var nextBtn = document.getElementById("journey-next");
  var playBtn = document.getElementById("journey-play");
  var intentField = document.getElementById("intent");
  var messageField = document.getElementById("message");

  function stopJourneyPlay() {
    if (journeyState.timer) {
      window.clearInterval(journeyState.timer);
      journeyState.timer = null;
      if (playBtn) playBtn.textContent = "Play the full journey";
    }
  }

  function renderJourney() {
    if (!stepsEl) return;
    var steps = journeys[journeyState.path];
    var current = steps[journeyState.step];
    var n = journeyState.step + 1;
    var pad = n < 10 ? "0" + n : String(n);

    stepsEl.innerHTML = "";
    steps.forEach(function (step, i) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "journey-step";
      if (i === journeyState.step) btn.classList.add("is-active");
      if (i < journeyState.step) btn.classList.add("is-complete");
      btn.setAttribute("aria-pressed", i === journeyState.step ? "true" : "false");
      btn.innerHTML =
        '<span class="journey-step-num">0' +
        (i + 1) +
        "</span>" +
        '<span class="journey-step-label"></span>';
      btn.querySelector(".journey-step-label").textContent = step.title;
      btn.addEventListener("click", function () {
        stopJourneyPlay();
        journeyState.step = i;
        renderJourney();
      });
      li.appendChild(btn);
      stepsEl.appendChild(li);
    });

    indexEl.textContent = pad;
    titleEl.textContent = current.title;
    copyEl.textContent = current.copy;
    pointsEl.innerHTML = "";
    current.points.forEach(function (point) {
      var item = document.createElement("li");
      item.textContent = point;
      pointsEl.appendChild(item);
    });

    ctaEl.textContent = current.cta;
    ctaEl.setAttribute("data-intent", current.intent);
    prevBtn.disabled = journeyState.step === 0;
    nextBtn.disabled = journeyState.step === steps.length - 1;
    panelEl.setAttribute("aria-labelledby", journeyState.path === "buy" ? "tab-buy" : "tab-sell");
  }

  function setJourneyPath(path, step) {
    journeyState.path = path;
    journeyState.step = typeof step === "number" ? step : 0;
    document.querySelectorAll(".journey-tab").forEach(function (tab) {
      var active = tab.getAttribute("data-path") === path;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    renderJourney();
  }

  document.querySelectorAll(".journey-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      stopJourneyPlay();
      setJourneyPath(tab.getAttribute("data-path"), 0);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      stopJourneyPlay();
      if (journeyState.step > 0) {
        journeyState.step -= 1;
        renderJourney();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      stopJourneyPlay();
      if (journeyState.step < journeys[journeyState.path].length - 1) {
        journeyState.step += 1;
        renderJourney();
      }
    });
  }

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      if (journeyState.timer) {
        stopJourneyPlay();
        return;
      }
      journeyState.step = 0;
      renderJourney();
      playBtn.textContent = "Stop walkthrough";
      journeyState.timer = window.setInterval(function () {
        if (journeyState.step >= journeys[journeyState.path].length - 1) {
          stopJourneyPlay();
          return;
        }
        journeyState.step += 1;
        renderJourney();
      }, 2200);
    });
  }

  function prefillContact(intent, message) {
    if (intentField && intent) intentField.value = intent;
    if (messageField && message) {
      if (!messageField.value.trim()) messageField.value = message;
    }
  }

  if (ctaEl) {
    ctaEl.addEventListener("click", function () {
      var intent = ctaEl.getAttribute("data-intent");
      if (!intent) intent = journeyState.path === "buy" ? "buying" : "selling";
      var title = journeys[journeyState.path][journeyState.step].title;
      prefillContact(intent, "I would like to begin at: " + title + ".");
    });
  }

  document.querySelectorAll("[data-journey]").forEach(function (card) {
    card.addEventListener("click", function () {
      var path = card.getAttribute("data-journey");
      stopJourneyPlay();
      setJourneyPath(path, 0);
    });
  });

  document.querySelectorAll(".listing-cta").forEach(function (link) {
    link.addEventListener("click", function () {
      var listing = link.getAttribute("data-listing") || "a current listing";
      prefillContact("tour", "I would like a private tour of " + listing + ".");
    });
  });

  if (stepsEl) renderJourney();

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
      var intent = form.elements.namedItem("intent");
      var message = form.elements.namedItem("message");
      var valid = true;
      var fields = [name, email, intent, message];

      fields.forEach(function (input) {
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

      statusEl.textContent = "Thank you. Esme will follow up to confirm next steps.";
      form.reset();
      fields.forEach(function (input) {
        setFieldError(input, false);
      });
    });

    form.querySelectorAll("input, textarea, select").forEach(function (input) {
      input.addEventListener("input", function () {
        setFieldError(input, false);
        if (statusEl && statusEl.textContent.indexOf("Please") === 0) {
          statusEl.textContent = "";
        }
      });
      input.addEventListener("change", function () {
        setFieldError(input, false);
      });
    });
  }
})();
