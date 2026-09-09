document.addEventListener("DOMContentLoaded", () => {
	const panels = document.querySelectorAll(".hobby-panel");
	const dots = document.querySelectorAll(".hobby-dot");

	if (!panels.length || !dots.length) {
		return;
	}

	dots.forEach((dot) => {
		dot.addEventListener("click", () => {
			const target = dot.dataset.target;

			panels.forEach((panel) => {
				panel.classList.toggle("is-active", panel.dataset.hobby === target);
			});

			dots.forEach((item) => {
				const isActive = item === dot;
				item.classList.toggle("is-active", isActive);
				item.setAttribute("aria-selected", isActive ? "true" : "false");
			});
		});
	});

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
