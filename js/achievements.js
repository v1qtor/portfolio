document.addEventListener("DOMContentLoaded", () => {
	const tabs = document.querySelectorAll(".filter-tab");
	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			tabs.forEach((item) => {
				item.classList.remove("active");
				item.setAttribute("aria-selected", "false");
			});
			tab.classList.add("active");
			tab.setAttribute("aria-selected", "true");

			const filter = tab.dataset.filter;
			document.querySelectorAll(".achievement-card").forEach((card) => {
				const show = filter === "all" || card.dataset.category === filter;
				card.classList.toggle("hidden", !show);
			});
		});
	});

	if (typeof GLightbox !== "undefined") {
		const createLightbox = () => GLightbox({
			selector: ".achievement-details-lightbox",
			width: "90%",
			height: "90vh",
			preload: false,
			touchNavigation: true,
			loop: true,
			closeButton: true,
			keyboardNavigation: true,
			closeOnOutsideClick: true
		});

		let achievementLightbox = createLightbox();

		const resetLightboxInstance = () => {
			document.body.classList.remove(
				"glightbox-open",
				"glightbox-mobile",
				"glightbox-touch",
				"glightbox-closing"
			);

			document.querySelectorAll(".glightbox-container").forEach((container) => {
				container.remove();
			});

			if (typeof achievementLightbox.destroy === "function") {
				achievementLightbox.destroy();
			}

			achievementLightbox = createLightbox();
			bindLightboxLifecycle(achievementLightbox);
			window.achievementLightbox = achievementLightbox;
		};

		const closeAndFinalize = () => {
			if (typeof achievementLightbox.close === "function") {
				achievementLightbox.close();
			}

			window.setTimeout(() => {
				if (document.body.classList.contains("glightbox-open") || document.querySelector(".glightbox-container")) {
					resetLightboxInstance();
				}
			}, 420);
		};

		const bindLightboxLifecycle = (instance) => {
			instance.on("close", () => {
				window.setTimeout(() => {
					if (instance !== achievementLightbox) {
						return;
					}

					if (typeof achievementLightbox.destroy === "function") {
						achievementLightbox.destroy();
					}

					achievementLightbox = createLightbox();
					bindLightboxLifecycle(achievementLightbox);
					window.achievementLightbox = achievementLightbox;
				}, 0);
			});
		};

		bindLightboxLifecycle(achievementLightbox);
		window.achievementLightbox = achievementLightbox;

		document.addEventListener("click", (event) => {
			if (event.target.closest(".gclose")) {
				closeAndFinalize();
			}
		});

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && document.body.classList.contains("glightbox-open")) {
				closeAndFinalize();
			}
		});
	}
});
