document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initChat();
    initStats();
});

/* --- Particle Network Animation (Gold Theme) --- */
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(212, 175, 55, 0.4)'; // Gold particles
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect nearby particles
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 - dist / 1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }

    animate();
}

/* --- Simualated AI Chat --- */
function initChat() {
    const input = document.getElementById('user-input');
    const btn = document.getElementById('send-btn');
    const log = document.getElementById('chat-log');

    function addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.textContent = text;
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
    }

    async function processCommand(cmd) {
        addMessage(cmd, 'user');
        input.value = '';

        const delay = Math.random() * 800 + 400;

        setTimeout(() => {
            let response = "Searching trust database...";
            const lower = cmd.toLowerCase();

            if (lower.includes('hello') || lower.includes('hi')) {
                response = "Namaste! Welcome to Dhanalakshmi Trust. How may I help you today?";
            } else if (lower.includes('donate') || lower.includes('qr') || lower.includes('pay')) {
                response = "You can donate securely using the QR code on the right panel. We accept UPI, NEFT, and RTGS. All donations are 80G tax-exempt.";
            } else if (lower.includes('food') || lower.includes('feed')) {
                response = "Our 'Annadanam' program feeds 500+ people daily in Chennai. ₹1000 can sponsor a meal for 20 people.";
            } else if (lower.includes('education') || lower.includes('school')) {
                response = "We support 5 rural schools with books, uniforms, and digital aid. Check the Activity Feed for our latest school drive!";
            } else {
                const randoms = [
                    "Checking latest relief campaings...",
                    "Did you know? ₹500 provides a school kit for one child.",
                    "Connecting you to our volunteer network specifics...",
                    "We are 100% transparent. Every rupee goes to the cause."
                ];
                response = randoms[Math.floor(Math.random() * randoms.length)];
            }

            addMessage(response, 'ai');
        }, delay);
    }

    btn.addEventListener('click', () => {
        if (input.value.trim()) processCommand(input.value);
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) processCommand(input.value);
    });

    // Initial Greeting
    setTimeout(() => {
        addMessage("Jai Hind. I am the Dhanalakshmi Trust Virtual Assistant. Ask me about our projects!", 'ai');
    }, 800);
}

/* --- Dynamic Stats & Feed Logic --- */
function initStats() {
    // Stats Animation (Already CSS driven, just logic updates if needed)
}

/* --- Simulate Uploading New Event --- */
window.simulateUpload = function () {
    const grid = document.getElementById('gallery-grid');

    // Create a new item
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.style.animation = 'fadeIn 0.5s ease';

    // Randomly pick one of the existing images to "re-upload" for demo
    // In a real app, this would be the uploaded file
    const imgs = [
        "../../brain/54b8aebf-1ae3-4138-85d4-c0bc1d375fe1/charity_food_distribution_1767961558874.png",
        "../../brain/54b8aebf-1ae3-4138-85d4-c0bc1d375fe1/charity_education_class_1767961576926.png"
    ];
    const randomImg = imgs[Math.floor(Math.random() * imgs.length)];

    div.innerHTML = `
        <img src="${randomImg}" alt="New Event">
        <div class="gallery-caption">Just Now: New Event Uploaded!</div>
    `;

    // Prepend to grid
    grid.insertBefore(div, grid.firstChild);

    // Scroll to start
    grid.scrollLeft = 0;

    alert("New Event Photo Uploaded Successfully to Feed!");
}
