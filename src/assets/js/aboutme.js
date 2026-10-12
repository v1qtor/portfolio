document.addEventListener("DOMContentLoaded", () => {
	const carousel = document.querySelector(".hobby-carousel");
	const track = document.querySelector(".hobby-track");
	const panels = document.querySelectorAll(".hobby-panel");
	const dots = document.querySelectorAll(".hobby-dot");

	if (!panels.length || !dots.length || !track) {
		return;
	}

	const order = [...panels].map((panel) => panel.dataset.hobby);
	let activeIndex = order.indexOf(document.querySelector(".hobby-panel.is-active").dataset.hobby);
	if (activeIndex < 0) {
		activeIndex = 0;
	}

	function showHobby(target) {
		const index = order.indexOf(target);
		if (index < 0) {
			return;
		}
		activeIndex = index;
		track.style.transform = "translateX(-" + index * 100 + "%)";

		panels.forEach((panel) => {
			panel.classList.toggle("is-active", panel.dataset.hobby === target);
		});
		dots.forEach((dot) => {
			const isActive = dot.dataset.target === target;
			dot.classList.toggle("is-active", isActive);
			dot.setAttribute("aria-selected", isActive ? "true" : "false");
		});
	}

	function showByOffset(offset) {
		const next = (activeIndex + offset + order.length) % order.length;
		showHobby(order[next]);
	}

	dots.forEach((dot) => {
		dot.addEventListener("click", () => showHobby(dot.dataset.target));
	});

	if (carousel) {
		let touchStartX = 0;
		let touchStartY = 0;

		carousel.addEventListener("touchstart", (event) => {
			touchStartX = event.touches[0].clientX;
			touchStartY = event.touches[0].clientY;
		}, { passive: true });

		carousel.addEventListener("touchend", (event) => {
			const dx = event.changedTouches[0].clientX - touchStartX;
			const dy = event.changedTouches[0].clientY - touchStartY;

			if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) {
				return;
			}

			showByOffset(dx < 0 ? 1 : -1);
		}, { passive: true });
	}

	initResumePreview();
});

function initResumePreview() {
	const canvas = document.getElementById("resumeCanvas");
	const fallback = document.getElementById("resumeFallback");
	if (!canvas || typeof pdfjsLib === "undefined") {
		return;
	}

	pdfjsLib.GlobalWorkerOptions.workerSrc =
		"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

	let pdfPage = null;
	let renderTimer = null;

	async function renderAtCurrentWidth() {
		if (!pdfPage) {
			return;
		}

		const containerWidth = canvas.parentElement.clientWidth;
		const unscaledViewport = pdfPage.getViewport({ scale: 1 });
		const dpr = window.devicePixelRatio || 1;
		const scale = (containerWidth / unscaledViewport.width) * dpr;
		const viewport = pdfPage.getViewport({ scale });

		canvas.width = viewport.width;
		canvas.height = viewport.height;

		const context = canvas.getContext("2d");
		await pdfPage.render({ canvasContext: context, viewport }).promise;
	}

	function scheduleRender() {
		clearTimeout(renderTimer);
		renderTimer = setTimeout(renderAtCurrentWidth, 150);
	}

	pdfjsLib
		.getDocument("/assets/files/cv.pdf")
		.promise.then((pdf) => pdf.getPage(1))
		.then((page) => {
			pdfPage = page;
			return renderAtCurrentWidth();
		})
		.then(() => {
			window.addEventListener("resize", scheduleRender);
		})
		.catch((err) => {
			console.warn("Resume preview failed:", err);
			canvas.hidden = true;
			if (fallback) {
				fallback.hidden = false;
			}
		});
}
