const roles = ["Analyst", "Strategist", "Builder"];
const roleWord = document.getElementById("roleWord");

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
