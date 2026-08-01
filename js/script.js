/**
 * ==========================================================
 * Jennifer Francis-Nkpornwi Portfolio
 * Production JavaScript
 * ----------------------------------------------------------
 * Features
 * - Mobile navigation toggle
 * - Auto-close mobile menu
 * - Active navigation highlighting
 * - Sticky header support
 * - Smooth scrolling
 * - Fade-up animations
 * - Dynamic scroll-to-top button
 * - Keyboard accessibility
 * - Modern ES6+
 * ==========================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializePortfolio();
});

function initializePortfolio() {
    setupMobileNavigation();
    setupActiveNavigation();
    setupStickyHeader();
    setupSmoothScrolling();
    setupFadeAnimations();
    setupScrollToTop();
}

/* ==========================================================
   Mobile Navigation
========================================================== */

function setupMobileNavigation() {
    const navToggle =
        document.querySelector(".nav-toggle") ||
        document.querySelector(".menu-toggle") ||
        document.querySelector("[data-nav-toggle]");

    const navigation =
        document.querySelector(".nav-links") ||
        document.querySelector(".navigation") ||
        document.querySelector("nav ul");

    if (!navToggle || !navigation) return;

    const toggleMenu = () => {
        const expanded = navToggle.getAttribute("aria-expanded") === "true";

        navToggle.setAttribute("aria-expanded", String(!expanded));

        navigation.classList.toggle("active");

        document.body.classList.toggle("menu-open");
    };

    navToggle.setAttribute("aria-expanded", "false");

    navToggle.addEventListener("click", toggleMenu);

    navToggle.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleMenu();
        }
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            navigation.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        }
    });
}

/* ==========================================================
   Active Navigation
========================================================== */

function setupActiveNavigation() {
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const links = document.querySelectorAll("nav a");

    links.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href) return;

        if (
            href === currentPage ||
            (currentPage === "" && href === "index.html") ||
            (currentPage === "/" && href === "index.html")
        ) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}

/* ==========================================================
   Sticky Header
========================================================== */

function setupStickyHeader() {
    const header =
        document.querySelector("header") ||
        document.querySelector(".site-header");

    if (!header) return;

    const updateHeader = () => {
        if (window.scrollY > 20) {
            header.classList.add("is-sticky");
        } else {
            header.classList.remove("is-sticky");
        }
    };

    updateHeader();

    window.addEventListener(
        "scroll",
        () => {
            requestAnimationFrame(updateHeader);
        },
        { passive: true }
    );
}

/* ==========================================================
   Smooth Scrolling
========================================================== */

function setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetID = link.getAttribute("href");

            if (!targetID || targetID === "#") return;

            const target = document.querySelector(targetID);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            target.setAttribute("tabindex", "-1");
            target.focus({
                preventScroll: true
            });
        });
    });
}

/* ==========================================================
   Fade-Up Animation
========================================================== */

function setupFadeAnimations() {
    const animatedElements = document.querySelectorAll(`
        section,
        article,
        .card,
        .project-card,
        .timeline-item,
        .skill-card,
        .feature-card,
        .stat-card
    `);

    if (!animatedElements.length) return;

    animatedElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(32px)";
        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";
    });

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                obs.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    animatedElements.forEach((element) => observer.observe(element));
}

/* ==========================================================
   Scroll To Top
========================================================== */

function setupScrollToTop() {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "scroll-top-btn";
    button.setAttribute("aria-label", "Scroll to top");

    button.innerHTML = "↑";

    Object.assign(button.style, {
        position: "fixed",
        right: "24px",
        bottom: "24px",
        width: "48px",
        height: "48px",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "1.25rem",
        opacity: "0",
        visibility: "hidden",
        transition: "all .3s ease",
        zIndex: "9999"
    });

    document.body.appendChild(button);

    const updateButton = () => {
        if (window.scrollY > 400) {
            button.style.opacity = "1";
            button.style.visibility = "visible";
        } else {
            button.style.opacity = "0";
            button.style.visibility = "hidden";
        }
    };

    updateButton();

    window.addEventListener(
        "scroll",
        () => {
            requestAnimationFrame(updateButton);
        },
        { passive: true }
    );

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    });
}
