const roles = ["Analyst", "Strategist", "Builder"];
const roleWord = document.getElementById("roleWord");
const heroMedia = document.getElementById("heroMedia");
const heroRippleCard = document.getElementById("heroRippleCard");

if (roleWord) {
	const typingDelay = 65;
	const deletingDelay = 30;
	const holdDelay = 2500;
	const swapDelay = 200;
	let currentWord = roleWord.textContent.trim() || roles[0];
	let roleIndex = roles.indexOf(currentWord);
	if (roleIndex === -1) {
		roleIndex = 0;
		currentWord = roles[0];
	}
	roleWord.textContent = currentWord;

	const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	async function runTypeCycle() {
		while (true) {
			roleWord.classList.remove("is-paused");
			await wait(holdDelay);

			for (let length = currentWord.length - 1; length >= 0; length -= 1) {
				roleWord.textContent = currentWord.slice(0, length);
				await wait(deletingDelay);
			}

			await wait(swapDelay);
			roleIndex = (roleIndex + 1) % roles.length;
			currentWord = roles[roleIndex];

			for (let length = 1; length <= currentWord.length; length += 1) {
				roleWord.textContent = currentWord.slice(0, length);
				await wait(typingDelay);
			}

			roleWord.classList.add("is-paused");
			await wait(0);
		}
	}

	runTypeCycle();
}

window.addEventListener("load", () => {
	if (!heroMedia || !heroRippleCard || !window.jQuery || !jQuery.fn.ripples) {
		return;
	}

	try {
		const rippleCard = jQuery(heroRippleCard);
		rippleCard.ripples({
			resolution: 256,
			dropRadius: 16,
			perturbance: 0.026,
			interactive: false
		});

		let lastDropTime = 0;
		let hoverActive = false;
		let lastPoint = null;

		function emitDrop(clientX, clientY, baseRadius, baseStrength) {
			const interactionRect = heroMedia.getBoundingClientRect();
			if (!interactionRect.width || !interactionRect.height) {
				return;
			}

			const ratioX = (clientX - interactionRect.left) / interactionRect.width;
			const ratioY = (clientY - interactionRect.top) / interactionRect.height;
			if (ratioX < 0 || ratioX > 1 || ratioY < 0 || ratioY > 1) {
				return;
			}

			const localWidth = heroRippleCard.clientWidth || interactionRect.width;
			const localHeight = heroRippleCard.clientHeight || interactionRect.height;
			const leftBleed = Math.min(28, localWidth * 0.055);
			const rightBleed = Math.min(10, localWidth * 0.018);
			const x = Math.min(
				localWidth,
				Math.max(0, ratioX * (localWidth + leftBleed + rightBleed) - leftBleed)
			);
			const y = Math.min(localHeight, Math.max(0, ratioY * localHeight));
			const leftEdgeBoost = ratioX < 0.28 ? 1 + (0.28 - ratioX) * 1.35 : 1;
			const radius = Math.min(22, baseRadius * leftEdgeBoost);
			const strength = Math.min(
				0.07,
				baseStrength * (ratioX < 0.28 ? 1 + (0.28 - ratioX) * 1.6 : 1)
			);

			rippleCard.ripples("drop", x, y, radius, strength);
		}

		heroMedia.addEventListener("pointerenter", (event) => {
			hoverActive = true;
			lastPoint = { x: event.clientX, y: event.clientY };
			emitDrop(event.clientX, event.clientY, 12, 0.028);
		});

		heroMedia.addEventListener("pointermove", (event) => {
			if (!hoverActive) {
				return;
			}

			const now = performance.now();
			const deltaX = lastPoint ? event.clientX - lastPoint.x : 0;
			const deltaY = lastPoint ? event.clientY - lastPoint.y : 0;
			const travel = Math.hypot(deltaX, deltaY);
			if (travel < 10 || now - lastDropTime < 60) {
				lastPoint = { x: event.clientX, y: event.clientY };
				return;
			}

			const radius = Math.min(18, 10 + travel * 0.18);
			const strength = Math.min(0.055, 0.022 + travel * 0.00065);
			emitDrop(event.clientX, event.clientY, radius, strength);
			lastDropTime = now;
			lastPoint = { x: event.clientX, y: event.clientY };
		});

		heroMedia.addEventListener("pointerleave", () => {
			hoverActive = false;
			lastPoint = null;
		});
	} catch (err) {
		console.warn("Image ripple fallback:", err);
	}
});
