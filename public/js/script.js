// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
});

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 20) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }
});

// ✅ Unified Navbar Collapse Control (Final Fixed)
document.addEventListener("DOMContentLoaded", () => {
  const collapse = document.getElementById("mainNavCollapse");
  const toggler = document.querySelector(".navbar-toggler");
  const navbar = document.querySelector(".navbar");

  if (!collapse || typeof bootstrap === "undefined") return;

  // Create Bootstrap Collapse instance
  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse, { toggle: false });

  // 🧱 1️⃣ Prevent auto-opening on refresh
  collapse.classList.remove("show", "collapsing");
  bsCollapse.hide();
  if (toggler) {
    toggler.classList.add("collapsed");
    toggler.setAttribute("aria-expanded", "false");
  }

  // 🧱 2️⃣ Let Bootstrap handle toggling normally
  if (toggler) {
    toggler.addEventListener("click", () => {
      const isShown = collapse.classList.contains("show");
      if (isShown) {
        bsCollapse.hide();
        toggler.classList.add("collapsed");
        toggler.setAttribute("aria-expanded", "false");
      } else {
        bsCollapse.show();
        toggler.classList.remove("collapsed");
        toggler.setAttribute("aria-expanded", "true");
      }
    });
  }

  // 🧱 3️⃣ Hide menu when scrolling
  let lastScroll = window.scrollY;
  window.addEventListener("scroll", () => {
    if (collapse.classList.contains("show") && Math.abs(window.scrollY - lastScroll) > 5) {
      bsCollapse.hide();
      toggler.classList.add("collapsed");
      toggler.setAttribute("aria-expanded", "false");
    }
    lastScroll = window.scrollY;
  });

  // 🧱 4️⃣ Close menu when clicking a link (mobile)
  collapse.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (collapse.classList.contains("show")) {
        bsCollapse.hide();
        toggler.classList.add("collapsed");
        toggler.setAttribute("aria-expanded", "false");
      }
    });
  });

  // 🧱 5️⃣ Fix z-index for mobile menu
  collapse.addEventListener("show.bs.collapse", () => {
    navbar.style.zIndex = "2100";
  });
  collapse.addEventListener("hidden.bs.collapse", () => {
    navbar.style.zIndex = "1050";
  });

  // 🧱 6️⃣ Defensive: fix state when page is restored
  window.addEventListener("pageshow", () => {
    if (collapse.classList.contains("show")) {
      bsCollapse.hide();
      toggler.classList.add("collapsed");
      toggler.setAttribute("aria-expanded", "false");
    }
  });
});
