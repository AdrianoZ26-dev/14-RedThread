document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTimer();
    initInteractions();
    initBubbles();
});

/* --- Particle System --- */
function initParticles() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    const colors = ['#ffffff', '#ffd7e9', '#b76e79'];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around screen
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Pulse effect
            this.opacity += (Math.random() - 0.5) * 0.02;
            if (this.opacity < 0.1) this.opacity = 0.1;
            if (this.opacity > 1) this.opacity = 1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        const particleCount = Math.floor((width * height) / 10000); // Density based on screen size
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        init();
    });

    init();
    animate();
}

/* --- Love Counter Logic --- */
function initTimer() {
    // START DATE CONFIGURATION
    // Change this date to your actual anniversary/start date
    const startDate = new Date('2026-01-14T00:00:00');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer(); // Run immediately
}

/* --- Plant Mini-Game Logic --- */
function initInteractions() {
    // Replaced with Plant Game
    initPlantGame();

    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeOverlay');

    closeBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        // Reset game if desired, or just close overlay
        resetGame();
    });
}

function initPlantGame() {
    let growthStage = 0;
    const maxStages = 3;
    const plantStages = document.querySelectorAll('.plant-stage');
    const cloudsContainer = document.getElementById('clouds-container');
    const plantContainer = document.querySelector('.plant-container');
    const overlay = document.getElementById('overlay');
    let gameActive = true;

    // Initialize state
    updatePlantState();

    function updatePlantState() {
        plantStages.forEach((stage, index) => {
            if (index === growthStage) {
                stage.classList.add('visible');
                stage.classList.remove('hidden');
            } else {
                stage.classList.remove('visible');
                stage.classList.add('hidden');
            }
        });
    }

    function spawnCloud() {
        if (!gameActive || document.hidden) return;

        const cloud = document.createElement('div');
        cloud.classList.add('cloud');

        // Random size
        const scale = 0.5 + Math.random() * 0.8;
        cloud.style.width = `${100 * scale}px`;
        cloud.style.height = `${40 * scale}px`;

        // Random position (vertical)
        cloud.style.top = `${10 + Math.random() * 40}%`;

        // Random speed
        const duration = 10 + Math.random() * 10;
        cloud.style.animation = `drift ${duration}s linear forwards`;

        // Click Interaction
        cloud.addEventListener('click', (e) => {
            if (!gameActive) return;

            // Pop effect
            cloud.style.transform = `scale(${scale * 1.2})`;
            setTimeout(() => cloud.style.transform = `scale(${scale})`, 200);

            rainPetals(e.clientX, e.clientY);
            growPlant();

            // Remove cloud after interaction (optional, or let it drift)
            // cloud.style.opacity = 0; 
            // setTimeout(() => cloud.remove(), 500);
        });

        cloudsContainer.appendChild(cloud);

        // Cleanup
        setTimeout(() => {
            cloud.remove();
        }, duration * 1000);
    }

    function rainPetals(x, y) {
        // Get relative position in game container
        const rect = cloudsContainer.getBoundingClientRect();
        // const relativeX = x - rect.left;
        // const relativeY = y - rect.top;

        for (let i = 0; i < 10; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');

            // Random color
            const colors = ['#ffd7e9', '#b76e79', '#ffffff'];
            petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Start at click position (relative to viewport, fixed by container offset if needed)
            // Actually, better to append to game-container or body? 
            // Appending to cloudsContainer is easiest for positioning relative to cloud
            cloudsContainer.appendChild(petal);

            // Position
            // Since petals are in cloudsContainer (absolute), we need to position them correctly.
            // But x,y are viewport. Let's use left/top style on fixed container or calculate relative.
            // Simplified: elementFromPoint approach or just use style.left/top
            // Re-calculating:
            // x is clientX. rect.left is container left.
            petal.style.left = `${x - rect.left}px`;
            petal.style.top = `${y - rect.top}px`;

            // Trajectory toward bottom center (approximate plant location)
            // Plant is at 50% width, bottom 20px.
            const containerWidth = rect.width;
            const containerHeight = rect.height;
            const targetX = (containerWidth / 2) - (x - rect.left) + (Math.random() * 40 - 20);

            petal.style.setProperty('--tx', `${targetX}px`);

            // Remove
            setTimeout(() => petal.remove(), 1000);
        }
    }

    function growPlant() {
        if (growthStage < maxStages) {
            growthStage++;
            updatePlantState();

            if (growthStage === maxStages) {
                // Game Won
                setTimeout(revealSurprise, 1000);
            }
        }
    }

    function revealSurprise() {
        gameActive = false;
        plantContainer.classList.add('bloom-explosion');

        setTimeout(() => {
            overlay.classList.remove('hidden');
        }, 800);
    }

    // Reset function
    window.resetGame = function () {
        gameActive = true;
        growthStage = 0;
        plantContainer.classList.remove('bloom-explosion');
        updatePlantState();
    }

    // Spawn clouds periodically
    setInterval(spawnCloud, 2000);
    // Initial clouds
    spawnCloud();
    setTimeout(spawnCloud, 1000);
}

function fireConfetti() {
    // Deprecated / Replaced by petal rain logic
}

function createCSSConfetti() {
    // Deprecated
}

/* --- Falling Bubbles --- */
function initBubbles() {
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'bubble-container';
    document.body.appendChild(bubbleContainer);

    const images = [
        'imgs/1.jpg', // Galaxy
        'imgs/2.jpg', // Night Sky
        'imgs/3.jpg', // Galaxy 2
        'imgs/4.jpg', // Stars
        'imgs/5.jpg'  // Sparkler
    ];

    function createBubble() {
        if (document.hidden) return; // Don't create if tab hidden

        const bubble = document.createElement('div');
        bubble.classList.add('floating-bubble');

        // Random Size (40px - 80px)
        const size = Math.random() * 40 + 40;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // Random Position (0% - 100%)
        bubble.style.left = `${Math.random() * 100}vw`;

        // Random Duration (8s - 15s) for slow fall
        const duration = Math.random() * 7 + 8;
        bubble.style.animation = `floatDown ${duration}s linear forwards`;

        // Random Image
        const imgSrc = images[Math.floor(Math.random() * images.length)];
        bubble.style.backgroundImage = `url('${imgSrc}')`;

        bubbleContainer.appendChild(bubble);

        // Remove after animation
        setTimeout(() => {
            bubble.remove();
        }, duration * 1000);
    }

    // Create a bubble every 600ms
    setInterval(createBubble, 600);
}
