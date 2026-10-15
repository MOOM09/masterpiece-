
const carouselStage = document.querySelector(".cityCarouselStage");
const carouselCards = [...document.querySelectorAll(".cityCarouselCard")];

if (carouselStage && carouselCards.length > 0) {
    let activeIndex = 0;
    let touchStartX = 0;

    function updateCarousel() {
        const totalCards = carouselCards.length;
        const isMobile = window.innerWidth <= 600;
        const cardSpacing = isMobile ? 110 : 190;

        carouselCards.forEach((card, index) => {
            let distance = (index - activeIndex + totalCards) % totalCards;

            if (distance > totalCards / 2) {
                distance -= totalCards;
            }

            const depth = Math.abs(distance);
            const isVisible = depth <= 3;
            const isActive = distance === 0;

            const translateX = distance * cardSpacing;
            const scale = Math.max(0.55, 1 - depth * 0.13);
            const rotateY = distance === 0 ? 0 : -Math.sign(distance) * 28;
            const translateZ = -depth * 100;

            card.style.transform = `
                translate(-50%, -50%)
                translateX(${translateX}px)
                translateZ(${translateZ}px)
                rotateY(${rotateY}deg)
                scale(${scale})
            `;

            card.style.zIndex = totalCards - depth;
            card.style.opacity = isVisible ? Math.max(0.3, 1 - depth * 0.25) : 0;
            card.style.filter = isActive ? "brightness(1)" : "brightness(0.65)";
            card.style.visibility = isVisible ? "visible" : "hidden";
            card.style.pointerEvents = isVisible ? "auto" : "none";
            card.tabIndex = isVisible ? 0 : -1;

            card.classList.toggle("isActive", isActive);
        });
    }

   function moveCarousel(direction) {
    activeIndex = (
        activeIndex + direction + carouselCards.length
    ) % carouselCards.length;

    updateCarousel();
}

const cityPrevBtn = document.getElementById("cityPrevBtn");
const cityNextBtn = document.getElementById("cityNextBtn");

cityPrevBtn.addEventListener("click", () => {
    moveCarousel(-1);
});

cityNextBtn.addEventListener("click", () => {
    moveCarousel(1);
});

    carouselCards.forEach((card, index) => {
        card.addEventListener("click", (event) => {
            if (index !== activeIndex) {
                event.preventDefault();
                activeIndex = index;
                updateCarousel();
            }
        });
    });

    carouselStage.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            moveCarousel(1);
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveCarousel(-1);
        }
    });

    carouselStage.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    carouselStage.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) {
            moveCarousel(difference > 0 ? 1 : -1);
        }
    }, { passive: true });

    window.addEventListener("resize", updateCarousel);

    updateCarousel();
}
