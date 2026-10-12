document.addEventListener("DOMContentLoaded", () => {
	const dataEl = document.getElementById("projectsData");
	const modal = document.getElementById("projectModal");
	if (!dataEl || !modal) {
		return;
	}

	const projects = JSON.parse(dataEl.textContent);
	const modalTrack = document.getElementById("projectModalTrack");
	const modalCaption = document.getElementById("projectModalCaption");
	const modalEyebrow = document.getElementById("projectModalEyebrow");
	const modalTitle = document.getElementById("projectModalTitle");
	const modalTags = document.getElementById("projectModalTags");
	const modalLinks = document.getElementById("projectModalLinks");
	const modalBody = document.getElementById("projectModalBody");
	const modalDots = document.getElementById("projectModalDots");
	const prevBtn = modal.querySelector(".project-modal-prev");
	const nextBtn = modal.querySelector(".project-modal-next");
	const certPrevBtn = modal.querySelector(".project-modal-cert-prev");
	const certNextBtn = modal.querySelector(".project-modal-cert-next");

	let activeItemIndex = 0;
	let activeImageIndex = 0;
	let lastFocused = null;

	function activeItem() {
		return projects[activeItemIndex];
	}

	function imageSrc(project, image) {
		return "/assets/images/projects/" + project.slug + "/" + image.file;
	}

	function updateImagePosition() {
		const item = activeItem();
		const image = item.images[activeImageIndex];

		modalTrack.style.transform = "translateX(-" + activeImageIndex * 100 + "%)";
		modalCaption.innerHTML = image.caption;

		modalDots.querySelectorAll(".project-modal-dot").forEach((dot, i) => {
			dot.classList.toggle("is-active", i === activeImageIndex);
		});
	}

	function linksHtml(item) {
		return (
			(item.githubUrl ? '<a href="' + item.githubUrl + '" target="_blank" rel="noopener noreferrer" class="project-link"><i class="bi bi-github"></i>GitHub</a>' : "") +
			(item.liveUrl ? '<a href="' + item.liveUrl + '" target="_blank" rel="noopener noreferrer" class="project-link"><i class="bi bi-box-arrow-up-right"></i>Live</a>' : "") +
			(item.demoCredentials ? '<span class="project-modal-demo"><i class="bi bi-key"></i>' + item.demoCredentials + "</span>" : "")
		);
	}

	function renderProject() {
		const item = activeItem();
		activeImageIndex = 0;

		modalEyebrow.textContent = item.type + " — " + item.year;
		modalTitle.textContent = item.title;
		modalTags.innerHTML = item.tags.map((tag) => '<span class="project-tag">' + tag + "</span>").join("");
		modalLinks.innerHTML = linksHtml(item);
		modalBody.innerHTML =
			"<h4>The Problem</h4><p>" + item.problem + "</p>" +
			"<h4>The Approach</h4><p>" + item.approach + "</p>" +
			"<h4>Outcome</h4><p>" + item.outcome + "</p>" +
			"<h4>Key Highlights</h4><ul>" + item.highlights.map((h) => "<li>" + h + "</li>").join("") + "</ul>";

		modalTrack.innerHTML = item.images
			.map((image) => {
				const alt = image.caption.replace(/<[^>]*>/g, "");
				return (
					'<div class="project-modal-slide">' +
						'<img class="project-modal-img" src="' + imageSrc(item, image) + '" alt="' + alt + '" />' +
						'<div class="project-modal-placeholder" hidden>' + image.kind + "</div>" +
					"</div>"
				);
			})
			.join("");
		modalTrack.style.transition = "none";

		modalTrack.querySelectorAll(".project-modal-slide").forEach((slide) => {
			const img = slide.querySelector(".project-modal-img");
			const placeholder = slide.querySelector(".project-modal-placeholder");
			img.addEventListener("error", () => {
				img.hidden = true;
				placeholder.hidden = false;
			}, { once: true });
		});

		modalDots.innerHTML = item.images
			.map((_, i) => '<button type="button" class="project-modal-dot' + (i === 0 ? " is-active" : "") + '" data-index="' + i + '" aria-label="Show image ' + (i + 1) + '"></button>')
			.join("");
		modalDots.hidden = item.images.length <= 1;

		modalDots.querySelectorAll(".project-modal-dot").forEach((dot) => {
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

		certPrevBtn.hidden = projects.length <= 1;
		certNextBtn.hidden = projects.length <= 1;
	}

	function openModal(index, trigger) {
		activeItemIndex = index;
		lastFocused = trigger || document.activeElement;
		renderProject();

		modal.hidden = false;
		modal.querySelector(".project-modal-close").focus();
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

	function showPrevProject() {
		activeItemIndex = (activeItemIndex - 1 + projects.length) % projects.length;
		renderProject();
	}

	function showNextProject() {
		activeItemIndex = (activeItemIndex + 1) % projects.length;
		renderProject();
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

	function wireRowThumbnail(thumb) {
		const project = projects.find((p) => p.slug === thumb.dataset.slug);
		const img = thumb.querySelector("img");
		if (!project || !img) {
			return;
		}

		let attempt = 0;
		img.addEventListener("error", function onError() {
			if (attempt < project.images.length) {
				img.src = imageSrc(project, project.images[attempt]);
				attempt += 1;
			} else {
				img.remove();
				thumb.classList.add("project-thumb-empty");
			}
		});
	}

	document.querySelectorAll(".project-thumb").forEach(wireRowThumbnail);

	document.querySelectorAll(".project-thumb, .project-title-btn").forEach((trigger) => {
		trigger.addEventListener("click", () => {
			const index = projects.findIndex((p) => p.slug === trigger.dataset.slug);
			if (index >= 0) {
				openModal(index, trigger);
			}
		});
	});

	modal.querySelectorAll("[data-close]").forEach((el) => {
		el.addEventListener("click", closeModal);
	});

	modal.querySelector(".project-modal-panel").addEventListener("click", (event) => {
		event.stopPropagation();
	});

	prevBtn.addEventListener("click", showPrevImage);
	nextBtn.addEventListener("click", showNextImage);
	certPrevBtn.addEventListener("click", showPrevProject);
	certNextBtn.addEventListener("click", showNextProject);

	const frame = modal.querySelector(".project-modal-frame");
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
