let particleCount = 20;
let gravityMode = false;
let animationSpeed = 'normal';
let particles = [];
let isLoading = false;

// Global DOM elements (cached for performance)
const particleContainer = document.getElementById('particleContainer');
const modalOverlay = document.getElementById('modalOverlay');
const loadingSpinner = document.getElementById('loadingSpinner');


function getRandomNumber(min, max) {
    // LOCAL SCOPE: result only exists within this function
    const result = Math.random() * (max - min) + min;
    return result; // RETURN VALUE: sends data back to caller
}


function generateRandomColor() {
    // LOCAL SCOPE: these variables only exist here
    const r = Math.floor(getRandomNumber(100, 255));
    const g = Math.floor(getRandomNumber(100, 255));
    const b = Math.floor(getRandomNumber(100, 255));
    
    return `rgb(${r}, ${g}, ${b})`; // RETURN VALUE: formatted color string
}


function delay(milliseconds) {
    return new Promise(resolve => {
        // LOCAL SCOPE: setTimeout callback has access to resolve
        setTimeout(resolve, milliseconds);
    });
}


function updateStatusIndicator(elementId, value, color = '#45b7d1') {
    // LOCAL SCOPE: element only exists within this function
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
        element.style.color = color;
    }
}


function calculateParticlePosition(containerWidth, containerHeight) {
    // LOCAL SCOPE: position object created here
    const position = {
        x: getRandomNumber(20, containerWidth - 20),
        y: getRandomNumber(20, containerHeight - 20)
    };
    
    return position; // RETURN VALUE: object with x, y coordinates
}


function createParticleElement(x, y) {
    // LOCAL SCOPE: particle element only exists here
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Set position and random color
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.background = generateRandomColor();
    
    // Add random animation delay for variety
    const animationDelay = getRandomNumber(0, 2);
    particle.style.animationDelay = animationDelay + 's';
    
    return particle; // RETURN VALUE: DOM element
}


async function showLoading() {
    // ACCESS GLOBAL SCOPE: isLoading variable
    isLoading = true;
    loadingSpinner.classList.add('show');
    
    // Simulate processing time
    await delay(1000);
    
    loadingSpinner.classList.remove('show');
    isLoading = false;
}


async function generateParticles(count) {
    // Show loading animation
    await showLoading();
    
    // Clear existing particles (GLOBAL SCOPE access)
    clearAllParticles();
    
    // LOCAL SCOPE: container dimensions
    const containerRect = particleContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Generate particles using loop
    for (let i = 0; i < count; i++) {
        // LOCAL SCOPE: position calculated for each particle
        const position = calculateParticlePosition(containerWidth, containerHeight);
        const particle = createParticleElement(position.x, position.y);
        
        // Add to DOM and tracking array (GLOBAL SCOPE)
        particleContainer.appendChild(particle);
        particles.push(particle);
        
        // Stagger creation for visual effect
        await delay(50);
    }
    
    // Update status (GLOBAL SCOPE access)
    updateStatusIndicator('particleStatus', particles.length, '#4ecdc4');
}

function clearAllParticles() {
    // ACCESS GLOBAL SCOPE: particles array
    particles.forEach(particle => {
        if (particle && particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    });
    
    // Clear the array (GLOBAL SCOPE modification)
    particles = [];
    updateStatusIndicator('particleStatus', '0', '#e74c3c');
}


async function createParticleExplosion() {
    if (isLoading || particles.length === 0) {
        showNotification('No Particles!', 'Generate some particles first');
        return;
    }
    
    // Apply explosion animation to all particles
    particles.forEach((particle, index) => {
        // LOCAL SCOPE: delay calculation for each particle
        const explosionDelay = index * 100;
        
        setTimeout(() => {
            if (particle && particle.parentNode) {
                // TRIGGER CSS ANIMATION by adding class
                particle.classList.add('explode');
                
                // Remove particle after animation completes
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }
        }, explosionDelay);
    });
    
    // Clear particles array after explosion (GLOBAL SCOPE)
    setTimeout(() => {
        particles = [];
        updateStatusIndicator('particleStatus', '0', '#e74c3c');
    }, particles.length * 100 + 1000);
    
    showNotification('Explosion!', '✨ Particles exploded with style!');
}


function toggleGravityMode() {
    // TOGGLE GLOBAL SCOPE variable
    gravityMode = !gravityMode;
    
    // Apply/remove gravity class to all particles
    particles.forEach(particle => {
        if (gravityMode) {
            // ADD CSS class to trigger animation
            particle.classList.add('gravity');
        } else {
            // REMOVE CSS class to stop animation
            particle.classList.remove('gravity');
        }
    });
    
    // Update status display
    const statusText = gravityMode ? 'ON' : 'OFF';
    const statusColor = gravityMode ? '#4ecdc4' : '#e74c3c';
    updateStatusIndicator('gravityStatus', statusText, statusColor);
    
    const message = gravityMode ? 
        'Gravity activated! Watch particles fall!' : 
        'Gravity disabled! Particles float freely!';
    showNotification('Gravity Toggle', message);
}


async function resetParticles() {
    if (isLoading) return;
    
    showNotification('Reset', 'Regenerating particle universe...');
    
    // Reset global state
    gravityMode = false;
    updateStatusIndicator('gravityStatus', 'OFF', '#e74c3c');
    
    // Regenerate particles with current count
    await generateParticles(particleCount);
}


function triggerScreenShake() {
    // ADD CSS class to trigger keyframe animation
    particleContainer.classList.add('shake');
    
    // Remove class after animation completes
    setTimeout(() => {
        particleContainer.classList.remove('shake');
    }, 500);
    
    showNotification('Screen Shake', 'The universe trembles! 📳');
}

function updateParticleCount(newCount) {
    // LOCAL SCOPE: parameter newCount
    const count = parseInt(newCount);
    
    // UPDATE GLOBAL SCOPE variable
    particleCount = count;
    
    // Update display
    document.getElementById('countDisplay').textContent = count;
    
    // Auto-regenerate if particles exist
    if (particles.length > 0 && !isLoading) {
        generateParticles(particleCount);
    }
}


function showNotification(title, message) {
  
    const titleElement = document.getElementById('modalTitle');
    const messageElement = document.getElementById('modalMessage');
    
    titleElement.textContent = title;
    messageElement.textContent = message;
    

    modalOverlay.classList.add('show');
}

function closeModal() {
    modalOverlay.classList.remove('show');
}


window.addEventListener('load', async function() {
    showNotification('Welcome!', 'Interactive Particle Universe is ready!');
    
    await generateParticles(particleCount);
});

modalOverlay.addEventListener('click', function(event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
});