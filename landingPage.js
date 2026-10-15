"use strict";

// Trending Now — glassy 3D coverflow with infinite navigation.
const carousel = document.getElementById("trendingCarousel");
const carouselStage = document.getElementById("trendingSlider");
const previousButton = document.getElementById("trendingPrevBtn");
const nextButton = document.getElementById("trendingNextBtn");
const carouselCounter = document.getElementById("trendingCounter");

if (carousel && carouselStage && previousButton && nextButton && carouselCounter) {
    const cards = Array.from(carouselStage.querySelectorAll(".glassCard"));
    let activeIndex = 0;
    let swipeStartX = null;
    let lastSwipeAt = 0;

    // Keep the cards arranged around the center, even when cycling past the end.
    function getRelativePosition(cardIndex) {
        let position = cardIndex - activeIndex;
        const halfway = cards.length / 2;

        if (position > halfway) {
            position -= cards.length;
        }

        if (position < -halfway) {
            position += cards.length;
        }

        return position;
    }

    function renderCarousel() {
        const isMobile = window.innerWidth <= 520;
        const step = isMobile
            ? Math.min(window.innerWidth * 0.40, 145)
            : Math.min(carouselStage.clientWidth * 0.20, 248);

        cards.forEach(function (card, index) {
            const position = getRelativePosition(index);
            const distance = Math.abs(position);
            const isActive = position === 0;
            const isVisible = distance <= (isMobile ? 2 : 3);
            const scale = Math.max(0.57, 1 - distance * 0.14);
            const rotate = position * -11;
            const translateX = position * step;
            const translateY = distance * 12;

            card.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) rotateY(${rotate}deg) scale(${scale})`;
            card.style.opacity = isVisible ? String(Math.max(0.35, 1 - distance * 0.22)) : "0";
            card.style.filter = isActive ? "none" : `brightness(${Math.max(0.42, 1 - distance * 0.17)})`;
            card.style.zIndex = String(10 - distance);
            card.style.pointerEvents = isVisible ? "auto" : "none";
            card.tabIndex = isActive ? 0 : -1;
            card.classList.toggle("isActive", isActive);

            if (isActive) {
                card.setAttribute("aria-current", "true");
            } else {
                card.removeAttribute("aria-current");
            }
        });

        carouselCounter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    }

    function navigateBy(amount) {
        activeIndex = (activeIndex + amount + cards.length) % cards.length;
        renderCarousel();
    }

    previousButton.addEventListener("click", function () {
        navigateBy(-1);
    });

    nextButton.addEventListener("click", function () {
        navigateBy(1);
    });

    // Clicking a side card first brings it to the center; clicking the center opens it.
    cards.forEach(function (card, index) {
        card.addEventListener("click", function (event) {
            if (Date.now() - lastSwipeAt < 350) {
                event.preventDefault();
                return;
            }

            if (index !== activeIndex) {
                event.preventDefault();
                activeIndex = index;
                renderCarousel();
            }
        });
    });

    carousel.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            navigateBy(event.key === "ArrowRight" ? 1 : -1);
        }
    });

    carouselStage.addEventListener("touchstart", function (event) {
        swipeStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    carouselStage.addEventListener("touchend", function (event) {
        if (swipeStartX === null) {
            return;
        }

        const swipeDistance = event.changedTouches[0].clientX - swipeStartX;
        swipeStartX = null;

        if (Math.abs(swipeDistance) > 45) {
            lastSwipeAt = Date.now();
            navigateBy(swipeDistance < 0 ? 1 : -1);
        }
    }, { passive: true });

    window.addEventListener("resize", renderCarousel);

    if (cards.length > 0) {
        renderCarousel();
    }
}
