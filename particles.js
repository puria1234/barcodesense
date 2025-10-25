// Particle effect for home screen
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    
    // Random size
    const size = Math.random() * 3 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation duration
    const duration = Math.random() * 10 + 15;
    particle.style.animationDuration = duration + 's';
    
    // Random delay
    const delay = Math.random() * 5;
    particle.style.animationDelay = delay + 's';
    
    container.appendChild(particle);
  }
}

// Initialize particles when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createParticles);
} else {
  createParticles();
}
