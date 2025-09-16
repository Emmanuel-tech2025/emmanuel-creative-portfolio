// Toggle mobile menu
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Particle effect
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.querySelector('#hero').offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let particles = [];
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 1,
    dy: (Math.random() - 0.5) * 1,
  });
}

// Track mouse
let mouse = { x: null, y: null };
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw particles
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    // Move
    p.x += p.dx;
    p.y += p.dy;

    // Bounce edges
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    // Mouse attraction
    if (mouse.x && mouse.y) {
      let dx = p.x - mouse.x;
      let dy = p.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x += dx * 0.03;
        p.y += dy * 0.03;
      }
    }
  });

  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) { // Only connect close ones
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}
draw();


// Spotlight cursor tracking
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});


// ===== Skills animation (fill bars + count up) =====
// Progress animation
document.addEventListener("DOMContentLoaded", () => {
  const bars = document.querySelectorAll("#skills .progress");

  function animatePercent(bar, target) {
    let count = 0;
    const percentLabel = bar.querySelector(".percent");
    percentLabel.style.opacity = "1";

    const interval = setInterval(() => {
      if (count >= target) {
        clearInterval(interval);
      } else {
        count++;
        percentLabel.textContent = count + "%";
      }
    }, 15); // speed of counting
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = parseInt(bar.dataset.progress, 10);

        // Animate bar
        bar.style.width = target + "%";

        // Animate %
        animatePercent(bar, target);

        observer.unobserve(bar); // only once
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
});



// === FADE-IN ANIMATIONS for services section ===
document.addEventListener("DOMContentLoaded", () => {
  const faders = document.querySelectorAll('.fade-in');

  if (faders.length === 0) return;

  const appearOptions = {
    threshold: 0.2,
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger effect with delay
        entry.target.style.transitionDelay = `${index * 0.2}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});


// RESUME SECTION

const timeline = document.querySelector(".timeline");
const dots = document.querySelectorAll(".timeline-dot");

const lineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      timeline.classList.add("active");

      // Animate dots one by one
      dots.forEach((dot, index) => {
        setTimeout(() => {
          dot.classList.add("active");
        }, index * 600); // delay each dot (600ms apart)
      });

      // Stop observing after first trigger
      lineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

if (timeline) {
  lineObserver.observe(timeline);
}


// ===== TESTIMONIAL CAROUSEL =====
// Testimonials carousel — robust, DOM-ready, creates dots if missing, auto-slide + pause on hover + keyboard
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".testimonial-container");
  if (!carousel) {
    console.warn("Testimonials: .testimonial-carousel not found.");
    return;
  }

  const testimonials = Array.from(carousel.querySelectorAll(".testimonial-card"));
  if (testimonials.length === 0) {
    console.warn("Testimonials: no .testimonial-card elements found.");
    return;
  }

  const prevBtn = document.querySelector(".testimonial-nav .prev");
  const nextBtn = document.querySelector(".testimonial-nav .next");
  let dotsContainer = document.querySelector(".testimonial-dots");

  // If dots container doesn't exist in HTML, create it right after the nav (or after carousel)
  if (!dotsContainer) {
    dotsContainer = document.createElement("div");
    dotsContainer.className = "testimonial-dots";
    // try to place after the nav if present, otherwise after carousel
    const nav = document.querySelector(".testimonial-nav");
    if (nav && nav.parentNode) nav.parentNode.insertBefore(dotsContainer, nav.nextSibling);
    else carousel.parentNode.insertBefore(dotsContainer, carousel.nextSibling);
  } else {
    // clear existing dots so we start fresh
    dotsContainer.innerHTML = "";
  }

  // Build dots and attach click handlers
  const dots = testimonials.map((_, i) => {
    const span = document.createElement("span");
    span.className = "dot";
    span.setAttribute("role", "button");
    span.setAttribute("aria-label", `Show testimonial ${i + 1}`);
    span.addEventListener("click", () => {
      show(i);
      resetAutoSlide();
    });
    dotsContainer.appendChild(span);
    return span;
  });

  let index = 0;
  const AUTO_MS = 5000;
  let intervalId = null;

  function show(i) {
    index = ((i % testimonials.length) + testimonials.length) % testimonials.length; // wrap
    testimonials.forEach((t, idx) => t.classList.toggle("active", idx === index));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === index));
  }

  // Prev / Next guards
  if (nextBtn) nextBtn.addEventListener("click", () => { show(index + 1); resetAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { show(index - 1); resetAutoSlide(); });

  // Auto-slide controls
  function startAutoSlide() {
    if (intervalId) return;
    intervalId = setInterval(() => show(index + 1), AUTO_MS);
  }
  function pauseAutoSlide() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }
  function resetAutoSlide() {
    pauseAutoSlide();
    startAutoSlide();
  }

  // Pause on hover over carousel, nav, or dots
  [carousel, dotsContainer, document.querySelector(".testimonial-nav")].forEach(el => {
    if (!el) return;
    el.addEventListener("mouseenter", pauseAutoSlide);
    el.addEventListener("mouseleave", startAutoSlide);
  });

  // Keyboard navigation (left/right)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { show(index + 1); resetAutoSlide(); }
    if (e.key === "ArrowLeft")  { show(index - 1); resetAutoSlide(); }
  });

  // Initialize
  show(0);
  startAutoSlide();

  console.info(`Testimonials carousel initialized with ${testimonials.length} slides.`);
});

// contact form submission

// contact.js

document.addEventListener("DOMContentLoaded", () => {
  const SERVICE_ID  = "service_kysfuob";
  const TEMPLATE_ID = "template_p297hxa";
  const PUBLIC_KEY  = "CpJ1dvz2oJEzYBcZx";

  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (!form) {
    console.error("❌ contact-form not found in DOM.");
    return;
  }

  // Ensure EmailJS is loaded then init
  if (!window.emailjs) {
    console.error("❌ EmailJS SDK not loaded. Make sure the CDN script is before contact.js");
    setStatus("Email service not loaded. Check script order.", "red");
    return;
  }
  emailjs.init(PUBLIC_KEY);

  function setStatus(msg, color) {
    statusEl.innerText = msg;
    statusEl.style.color = color || "#fff";
    statusEl.style.opacity = "1";
  }

  async function sendForm() {
    try {
      // UI: sending state
      setStatus("⏳ Sending...", "#ffd700");
      if (submitBtn) {
        submitBtn.dataset.originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = "Sending…";
      }

      const result = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
      console.log("✅ EmailJS result:", result);
      setStatus("✅ Message sent successfully!", "limegreen");
      form.reset();

      // fade out status after a moment
      setTimeout(() => (statusEl.style.opacity = "0"), 4000);
    } catch (err) {
      console.error("❌ EmailJS error:", err);
      setStatus(`❌ Send failed: ${err?.text || err?.message || "Unknown error"}`, "red");

      // little shake hint (optional, add .shake CSS from below)
      statusEl.classList.add("shake");
      setTimeout(() => statusEl.classList.remove("shake"), 500);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = submitBtn.dataset.originalText || "Send Message";
      }
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendForm();
  });

  // Optional: quick console tester to bypass the form
  window.TEST_EMAILJS = async function () {
    try {
      setStatus("⏳ Testing EmailJS…", "#ffd700");
      const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: "Test Sender",
        reply_to: "test@example.com",
        message: "Hello from TEST_EMAILJS()",
      });
      console.log("✅ Test result:", result);
      setStatus("✅ Test email sent (check your inbox).", "limegreen");
    } catch (err) {
      console.error("❌ Test failed:", err);
      setStatus(`❌ Test failed: ${err?.text || err?.message}`, "red");
    }
  };
});



