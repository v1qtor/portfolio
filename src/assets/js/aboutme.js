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
});
