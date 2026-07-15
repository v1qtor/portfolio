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

document.addEventListener("DOMContentLoaded", () => {
	initMobileNav();
});
