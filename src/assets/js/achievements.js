document.addEventListener("DOMContentLoaded", () => {
	const dataEl = document.getElementById("achievementsData");
	const modal = document.getElementById("achievementModal");
	if (!dataEl || !modal) {
		return;
	}

	const achievements = JSON.parse(dataEl.textContent);
	const modalImage = document.getElementById("achievementModalImage");
	const modalIssuer = document.getElementById("achievementModalIssuer");
	const modalTitle = document.getElementById("achievementModalTitle");
	const modalBody = document.getElementById("achievementModalBody");
	const prevBtn = modal.querySelector(".achievement-modal-prev");
	const nextBtn = modal.querySelector(".achievement-modal-next");

	let activeItem = null;
	let activeIndex = 0;
	let lastFocused = null;

	function renderImage() {
		const image = activeItem.images[activeIndex];
		modalImage.src = image.src;
		modalImage.alt = image.alt;
		prevBtn.hidden = activeIndex <= 0;
		nextBtn.hidden = activeIndex >= activeItem.images.length - 1;
	}

	function openModal(item, trigger) {
		activeItem = item;
		activeIndex = 0;
		lastFocused = trigger || document.activeElement;

		modalIssuer.textContent = item.issuer;
		modalTitle.textContent = item.title;
		modalBody.innerHTML =
			"<p>" + item.summary + "</p>" +
			"<h4>Context</h4>" + item.context +
			"<h4>What It Represents</h4>" + item.representation;
		renderImage();

		modal.hidden = false;
		modal.querySelector(".achievement-modal-close").focus();
		document.addEventListener("keydown", onKeydown);
	}

	function closeModal() {
		modal.hidden = true;
		activeItem = null;
		document.removeEventListener("keydown", onKeydown);
		if (lastFocused) {
			lastFocused.focus();
		}
	}

	function onKeydown(event) {
		if (event.key === "Escape") {
			closeModal();
		} else if (event.key === "ArrowLeft" && activeIndex > 0) {
			activeIndex -= 1;
			renderImage();
		} else if (event.key === "ArrowRight" && activeItem && activeIndex < activeItem.images.length - 1) {
			activeIndex += 1;
			renderImage();
		}
	}

	document.querySelectorAll(".achievement-thumb").forEach((thumb) => {
		thumb.addEventListener("click", () => {
			const item = achievements.find((a) => a.id === thumb.dataset.id);
			if (item) {
				openModal(item, thumb);
			}
		});
	});

	modal.querySelectorAll("[data-close]").forEach((el) => {
		el.addEventListener("click", closeModal);
	});

	modal.querySelector(".achievement-modal-panel").addEventListener("click", (event) => {
		event.stopPropagation();
	});

	prevBtn.addEventListener("click", () => {
		if (activeIndex > 0) {
			activeIndex -= 1;
			renderImage();
		}
	});

	nextBtn.addEventListener("click", () => {
		if (activeItem && activeIndex < activeItem.images.length - 1) {
			activeIndex += 1;
			renderImage();
		}
	});
});
