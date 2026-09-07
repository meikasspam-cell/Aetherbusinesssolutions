(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header shrink on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Services dropdown (desktop + mobile accordion) ---------- */
  var servicesToggle = document.getElementById("servicesToggle");
  var servicesItem = servicesToggle ? servicesToggle.closest(".nav-item") : null;

  function closeServicesDropdown() {
    if (!servicesItem) return;
    servicesItem.classList.remove("is-open");
    servicesToggle.setAttribute("aria-expanded", "false");
  }

  if (servicesToggle && servicesItem) {
    servicesToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = servicesItem.classList.toggle("is-open");
      servicesToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!servicesItem.contains(e.target)) {
        closeServicesDropdown();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeServicesDropdown();
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) closeServicesDropdown();
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        closeServicesDropdown();
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = (i % 3) * 90;
            setTimeout(function () {
              el.classList.add("is-visible");
            }, delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Contact form ----------
     Submits via FormSubmit (https://formsubmit.co) — a third-party form
     relay, not a custom Aether backend. On the very first submission,
     FormSubmit sends a one-time confirmation email to the destination
     address that has to be clicked before it will deliver live mail.
     A "_honey" hidden field is FormSubmit's documented honeypot: real
     visitors never see or fill it, so a filled value marks the
     submission as a bot and it's dropped server-side. */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");

  if (form) {
    var submitBtn = form.querySelector(".btn-primary");
    var defaultBtnLabel = submitBtn ? submitBtn.textContent : "";
    var defaultNote = note ? note.textContent : "";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) {
        // Likely a bot — pretend success without sending anything.
        note.textContent = "Thanks — we'll be in touch soon.";
        form.reset();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      note.textContent = "Sending your message…";
      note.style.color = "var(--grey)";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed: " + res.status);
          return res.json().catch(function () {
            return {};
          });
        })
        .then(function () {
          note.textContent =
            "Thanks — that's on its way to the Aether inbox. We'll be in touch soon.";
          note.style.color = "var(--ink)";
          submitBtn.textContent = "Message sent ✓";
          form.reset();
        })
        .catch(function () {
          note.textContent =
            "That didn't send — please try again, or email hello@aetherbusinesssolutions.com.au directly.";
          note.style.color = "#b3492f";
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnLabel;
        });
    });
  }
})();
