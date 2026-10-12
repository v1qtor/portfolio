function initMobileNav() {
	const menuToggle = document.getElementById("menuToggle");
	const mobileNav = document.getElementById("mobileNav");

	if (!menuToggle || !mobileNav) {
		return;
	}

	const menuIcon = menuToggle.querySelector("i");

	menuToggle.addEventListener("click", () => {
		const isOpen = mobileNav.classList.toggle("open");
		menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
		if (menuIcon) {
			menuIcon.classList.toggle("bi-list", !isOpen);
			menuIcon.classList.toggle("bi-x", isOpen);
		}
	});

	mobileNav.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			mobileNav.classList.remove("open");
			menuToggle.setAttribute("aria-expanded", "false");
			if (menuIcon) {
				menuIcon.classList.add("bi-list");
				menuIcon.classList.remove("bi-x");
			}
		});
	});
}

function initBackToTop() {
	const btn = document.getElementById("backToTop");
	if (!btn) {
		return;
	}

	function toggleVisibility() {
		btn.classList.toggle("is-visible", window.scrollY > 300);
	}

	btn.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});

	window.addEventListener("scroll", toggleVisibility, { passive: true });
	toggleVisibility();
}

document.addEventListener("DOMContentLoaded", () => {
	initMobileNav();
	initBackToTop();
});
