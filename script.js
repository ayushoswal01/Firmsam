// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Contact form validation
const contactForm = document.querySelector("#contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        let name = document.querySelector("#name").value.trim();
        let email = document.querySelector("#email").value.trim();
        let message = document.querySelector("#message").value.trim();

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email.");
            return;
        }

        alert("Thank you! Your message has been sent.");
        contactForm.reset();
    });
}

// Fade-in animation when scrolling
const fadeElems = document.querySelectorAll(".fade-in");
window.addEventListener("scroll", () => {
    fadeElems.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add("visible");
        }
    });
});
