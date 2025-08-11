// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Contact form validation
const contactForm = document.querySelector("#contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const message = document.querySelector("#message").value.trim();

        if (!name || !email || !message) {
            return Swal.fire("Oops!", "Please fill in all fields.", "warning");
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return Swal.fire("Invalid!", "Please enter a valid email.", "error");
        }

        Swal.fire("Success!", "Your message has been sent.", "success");
        contactForm.reset();
    });
}

// Fade-in animation on scroll
const fadeElems = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

fadeElems.forEach(el => observer.observe(el));

// Navbar scroll effect
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.style.background = "linear-gradient(90deg, #002b6f, #004aad)";
        nav.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    } else {
        nav.style.background = "linear-gradient(90deg, #0b3d91, #004aad)";
        nav.style.boxShadow = "none";
    }
});
