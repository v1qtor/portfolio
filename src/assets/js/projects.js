document.querySelectorAll(".project-tab").forEach((tab) => {
	tab.addEventListener("click", () => {
		document.querySelectorAll(".project-tab").forEach((item) => {
			item.classList.remove("active");
			item.setAttribute("aria-selected", "false");
		});
		tab.classList.add("active");
		tab.setAttribute("aria-selected", "true");
		const target = tab.dataset.target;
		document.querySelectorAll(".project-panel").forEach((panel) => {
			panel.classList.toggle("active", panel.id === target);
		});
	});
});
