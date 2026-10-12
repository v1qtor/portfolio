document.addEventListener("DOMContentLoaded", () => {
	const dataEl = document.getElementById("achievementsData");
	const modal = document.getElementById("achievementModal");
	if (!dataEl || !modal) {
		return;
	}

	const achievements = JSON.parse(dataEl.textContent);
	const modalTrack = document.getElementById("achievementModalTrack");
	const modalIssuer = document.getElementById("achievementModalIssuer");
	const modalTitle = document.getElementById("achievementModalTitle");
	const modalBody = document.getElementById("achievementModalBody");
	const modalDots = document.getElementById("achievementModalDots");
	const prevBtn = modal.querySelector(".achievement-modal-prev");
	const nextBtn = modal.querySelector(".achievement-modal-next");
	const certPrevBtn = modal.querySelector(".achievement-modal-cert-prev");
	const certNextBtn = modal.querySelector(".achievement-modal-cert-next");

	let activeItemIndex = 0;
	let activeImageIndex = 0;
	let lastFocused = null;

	function activeItem() {
		return achievements[activeItemIndex];
	}

	function updateImagePosition() {
		modalTrack.style.transform = "translateX(-" + activeImageIndex * 100 + "%)";

		modalDots.querySelectorAll(".achievement-modal-dot").forEach((dot, i) => {
			dot.classList.toggle("is-active", i === activeImageIndex);
		});
	}

	function renderCertificate() {
		const item = activeItem();
		activeImageIndex = 0;

		modalIssuer.textContent = item.issuer;
		modalTitle.textContent = item.title;
		modalBody.innerHTML =
			"<p>" + item.summary + "</p>" +
			"<h4>Context</h4>" + item.context +
			"<h4>What It Represents</h4>" + item.representation;

		modalTrack.innerHTML = item.images
			.map((image) => '<img class="achievement-modal-img" src="' + image.src + '" alt="' + image.alt + '" />')
			.join("");
		modalTrack.style.transition = "none";

		modalDots.innerHTML = item.images
			.map((_, i) => '<button type="button" class="achievement-modal-dot' + (i === 0 ? " is-active" : "") + '" data-index="' + i + '" aria-label="Show photo ' + (i + 1) + '"></button>')
			.join("");
		modalDots.hidden = item.images.length <= 1;

		modalDots.querySelectorAll(".achievement-modal-dot").forEach((dot) => {
			dot.addEventListener("click", () => {
				activeImageIndex = Number(dot.dataset.index);
				updateImagePosition();
			});
		});

		updateImagePosition();
		// Force layout so the reset transform above applies before re-enabling
		// the transition — otherwise the first image would visibly slide in.
		modalTrack.offsetHeight;
		modalTrack.style.transition = "";

		certPrevBtn.hidden = achievements.length <= 1;
		certNextBtn.hidden = achievements.length <= 1;
	}

	function openModal(index, trigger) {
		activeItemIndex = index;
		lastFocused = trigger || document.activeElement;
		renderCertificate();

		modal.hidden = false;
		modal.querySelector(".achievement-modal-close").focus();
		document.addEventListener("keydown", onKeydown);
	}

	function closeModal() {
		modal.hidden = true;
		document.removeEventListener("keydown", onKeydown);
		if (lastFocused) {
			lastFocused.focus();
		}
	}

	function showPrevImage() {
		const count = activeItem().images.length;
		activeImageIndex = (activeImageIndex - 1 + count) % count;
		updateImagePosition();
	}

	function showNextImage() {
		const count = activeItem().images.length;
		activeImageIndex = (activeImageIndex + 1) % count;
		updateImagePosition();
	}

	function showPrevCertificate() {
		activeItemIndex = (activeItemIndex - 1 + achievements.length) % achievements.length;
		renderCertificate();
	}

	function showNextCertificate() {
		activeItemIndex = (activeItemIndex + 1) % achievements.length;
		renderCertificate();
	}

	function onKeydown(event) {
		if (event.key === "Escape") {
			closeModal();
		} else if (event.key === "ArrowLeft") {
			showPrevImage();
		} else if (event.key === "ArrowRight") {
			showNextImage();
		}
	}

	document.querySelectorAll(".achievement-thumb, .achievement-title-btn").forEach((trigger) => {
		trigger.addEventListener("click", () => {
			const index = achievements.findIndex((a) => a.id === trigger.dataset.id);
			if (index >= 0) {
				openModal(index, trigger);
			}
		});
	});

	modal.querySelectorAll("[data-close]").forEach((el) => {
		el.addEventListener("click", closeModal);
	});

	modal.querySelector(".achievement-modal-panel").addEventListener("click", (event) => {
		event.stopPropagation();
	});

	prevBtn.addEventListener("click", showPrevImage);
	nextBtn.addEventListener("click", showNextImage);
	certPrevBtn.addEventListener("click", showPrevCertificate);
	certNextBtn.addEventListener("click", showNextCertificate);

	const frame = modal.querySelector(".achievement-modal-frame");
	let touchStartX = 0;
	let touchStartY = 0;

	frame.addEventListener("touchstart", (event) => {
		touchStartX = event.touches[0].clientX;
		touchStartY = event.touches[0].clientY;
	}, { passive: true });

	frame.addEventListener("touchend", (event) => {
		const dx = event.changedTouches[0].clientX - touchStartX;
		const dy = event.changedTouches[0].clientY - touchStartY;

		if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) {
			return;
		}

		if (dx < 0) {
			showNextImage();
		} else {
			showPrevImage();
		}
	}, { passive: true });
});
