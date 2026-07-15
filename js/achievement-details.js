document.addEventListener("DOMContentLoaded", () => {
	const slider = document.querySelector(".achievement-details-slider");
	if (!slider || typeof Swiper === "undefined") {
		return;
	}

	const slideCount = slider.querySelectorAll(".swiper-slide").length;
	if (slideCount <= 1) {
		slider.classList.add("single-slide");
	}

	new Swiper(slider, {
		initialSlide: 0,
		speed: 400,
		loop: slideCount > 1,
		autoplay: slideCount > 1
			? {
				delay: 6000,
				disableOnInteraction: false,
				pauseOnMouseEnter: false
			}
			: false,
		pagination: {
			el: ".achievement-details-media .swiper-pagination",
			type: "bullets",
			clickable: true
		},
		on: {
			init(swiper) {
				swiper.slideToLoop(0, 0, false);
			}
		}
	});
});
