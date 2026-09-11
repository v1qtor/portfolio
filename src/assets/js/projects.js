document.addEventListener("DOMContentLoaded", () => {
	const dataEl = document.getElementById("projectsData");
	const detail = document.getElementById("projectsDetail");
	const navItems = document.querySelectorAll(".projects-nav-item");
	if (!dataEl || !detail || !navItems.length) {
		return;
	}

	const projects = JSON.parse(dataEl.textContent);
	let activeImageIndex = 0;

	function imageSrc(project, image) {
		return "/assets/images/projects/" + project.slug + "/" + image.file;
	}

	function attachImageFallback(img, placeholder) {
		img.addEventListener("error", () => {
			img.hidden = true;
			placeholder.hidden = false;
		}, { once: true });
	}

	function renderGallery(project) {
		const images = project.images;
		const active = images[activeImageIndex];

		const hasPrev = activeImageIndex > 0;
		const hasNext = activeImageIndex < images.length - 1;

		const thumbsHtml = images
			.map((img, i) => {
				return (
					'<button type="button" class="projects-thumb' +
					(i === activeImageIndex ? " is-active" : "") +
					'" data-index="' + i + '" aria-label="' + img.caption + '">' +
					'<img class="projects-thumb-img" src="' + imageSrc(project, img) + '" alt="" />' +
					'<span class="projects-thumb-placeholder" hidden>' + img.kind + "</span>" +
					"</button>"
				);
			})
			.join("");

		const legendKinds = [...new Set(images.map((img) => img.kind))];
		const legendHtml = legendKinds
			.map((kind) => '<span class="projects-legend-item"><span class="projects-dot projects-dot-' + kind + '"></span>' + kind.charAt(0).toUpperCase() + kind.slice(1) + "</span>")
			.join("");

		return (
			'<div class="projects-gallery">' +
				(hasPrev ? '<button type="button" class="projects-gallery-nav projects-gallery-prev" aria-label="Previous image"><i class="bi bi-chevron-left"></i></button>' : "") +
				(hasNext ? '<button type="button" class="projects-gallery-nav projects-gallery-next" aria-label="Next image"><i class="bi bi-chevron-right"></i></button>' : "") +
				'<span class="projects-gallery-counter">' + (activeImageIndex + 1) + " / " + images.length + "</span>" +
				'<img class="projects-gallery-img" src="' + imageSrc(project, active) + '" alt="" />' +
				'<div class="projects-gallery-placeholder" hidden>' +
					'<span class="projects-gallery-placeholder-label">' + active.kind + "</span>" +
				"</div>" +
			"</div>" +
			'<p class="projects-gallery-caption">' + active.caption + "</p>" +
			'<div class="projects-thumbs">' + thumbsHtml + "</div>" +
			'<div class="projects-legend">' + legendHtml + "</div>"
		);
	}

	function metaBlock(label, text, borderless) {
		return (
			'<div class="projects-meta-block">' +
				'<h4 class="projects-meta-label' + (borderless ? " projects-meta-label-plain" : "") + '">' + label + "</h4>" +
				"<p>" + text + "</p>" +
			"</div>"
		);
	}

	function renderDetail(project) {
		activeImageIndex = 0;

		const tagsHtml = project.tags.map((tag) => '<span class="projects-detail-tag">' + tag + "</span>").join("");
		const highlightsHtml = project.highlights.map((h) => "<li>" + h + "</li>").join("");

		detail.innerHTML =
			'<p class="projects-detail-eyebrow">' + project.type + " · " + project.year + "</p>" +
			'<h1 class="projects-detail-title">' + project.title + "</h1>" +
			'<p class="projects-detail-summary">' + project.summary + "</p>" +
			'<div class="projects-detail-tags">' + tagsHtml + "</div>" +
			'<div id="projectsGalleryWrap">' + renderGallery(project) + "</div>" +
			'<div class="projects-meta-grid">' +
				metaBlock("The Problem", project.problem) +
				metaBlock("Outcome", project.outcome) +
				metaBlock("The Approach", project.approach) +
				'<div class="projects-meta-block">' +
					'<h4 class="projects-meta-label projects-meta-label-plain">Key Highlights</h4>' +
					'<ul class="projects-meta-list">' + highlightsHtml + "</ul>" +
				"</div>" +
			"</div>" +
			'<div class="projects-detail-links">' +
				(project.githubUrl ? '<a href="' + project.githubUrl + '" target="_blank" rel="noopener noreferrer" class="projects-detail-link"><i class="bi bi-github"></i>GitHub</a>' : "") +
				(project.liveUrl ? '<a href="' + project.liveUrl + '" target="_blank" rel="noopener noreferrer" class="projects-detail-link"><i class="bi bi-box-arrow-up-right"></i>Live</a>' : "") +
			"</div>";

		wireImageFallbacks(project);
		wireGalleryControls(project);
	}

	function wireImageFallbacks(project) {
		const heroImg = detail.querySelector(".projects-gallery-img");
		const heroPlaceholder = detail.querySelector(".projects-gallery-placeholder");
		if (heroImg && heroPlaceholder) {
			attachImageFallback(heroImg, heroPlaceholder);
		}

		detail.querySelectorAll(".projects-thumb").forEach((thumb) => {
			const img = thumb.querySelector(".projects-thumb-img");
			const placeholder = thumb.querySelector(".projects-thumb-placeholder");
			if (img && placeholder) {
				attachImageFallback(img, placeholder);
			}
		});
	}

	function wireGalleryControls(project) {
		const wrap = document.getElementById("projectsGalleryWrap");

		const prevBtn = detail.querySelector(".projects-gallery-prev");
		if (prevBtn) {
			prevBtn.addEventListener("click", () => {
				if (activeImageIndex > 0) {
					activeImageIndex -= 1;
					wrap.innerHTML = renderGallery(project);
					wireImageFallbacks(project);
					wireGalleryControls(project);
				}
			});
		}

		const nextBtn = detail.querySelector(".projects-gallery-next");
		if (nextBtn) {
			nextBtn.addEventListener("click", () => {
				if (activeImageIndex < project.images.length - 1) {
					activeImageIndex += 1;
					wrap.innerHTML = renderGallery(project);
					wireImageFallbacks(project);
					wireGalleryControls(project);
				}
			});
		}

		detail.querySelectorAll(".projects-thumb").forEach((thumb) => {
			thumb.addEventListener("click", () => {
				activeImageIndex = Number(thumb.dataset.index);
				wrap.innerHTML = renderGallery(project);
				wireImageFallbacks(project);
				wireGalleryControls(project);
			});
		});
	}

	function selectProject(slug) {
		const project = projects.find((p) => p.slug === slug);
		if (!project) {
			return;
		}

		navItems.forEach((item) => {
			const isActive = item.dataset.slug === slug;
			item.classList.toggle("is-active", isActive);
			item.setAttribute("aria-pressed", isActive ? "true" : "false");
		});

		renderDetail(project);
	}

	navItems.forEach((item) => {
		item.addEventListener("click", () => selectProject(item.dataset.slug));
	});

	selectProject(projects[0].slug);
});
