// Loading screen
const loadingScreen = document.getElementById('loading-screen');
const scene = document.querySelector('a-scene');
scene.addEventListener('loaded', () => loadingScreen.classList.add('hidden'));

class JourneyExperience {
  showFloatingText(id) {
    const icon = document.querySelector(`#${id}-icon`);
    if (!icon) return;

    const pos = icon.getAttribute('position');
    const label = this.milestoneTitles[id] || 'Module Complete';

    const text = document.createElement('a-text');
    text.setAttribute('value', label);
    text.setAttribute('position', `${pos.x} ${pos.y + 1.2} ${pos.z}`);
    text.setAttribute('color', '#FFD700');
    text.setAttribute('align', 'center');
    text.setAttribute('scale', '1.2 1.2 1.2');
    text.setAttribute('opacity', '0');

    text.setAttribute('animation__fadein', {
      property: 'opacity',
      to: '1',
      dur: 400,
      easing: 'easeOutQuad'
    });

    text.setAttribute('animation__fadeout', {
      property: 'opacity',
      to: '0',
      dur: 400,
      delay: 1200,
      easing: 'easeInQuad'
    });

    document.querySelector('a-scene').appendChild(text);

    setTimeout(() => {
      text.parentNode && text.parentNode.removeChild(text);
    }, 2000);
  }

  constructor() {
    this.cameraRig = null;
    this.currentMilestone = 0;
    this.isMoving = false;
    this.speed = 0.05;
    this.currentPosition = -5;

    this.milestonePositions = [
      { z: -10, id: 'milestone-1' },
      { z: -25, id: 'milestone-2' },
      { z: -40, id: 'milestone-3' },
      { z: -55, id: 'milestone-4' },
      { z: -70, id: 'module-leadership' },
      { z: -85, id: 'module-frontend' },
      { z: -100, id: 'module-agile' },
      { z: -115, id: 'module-react' },
      { z: -130, id: 'module-figma' },
      { z: -145, id: 'module-backend' },
      { z: -160, id: 'module-client' },
      { z: -175, id: 'module-webxr' },
      { z: -190, id: 'final-portal' }
    ];

    this.milestoneTitles = {
      'milestone-1': '2019 – Arrival in Stockholm',
      'milestone-2': '2019–2024 - Indian Grocery Store',
      'milestone-3': 'July 2024 - Career Shift',
      'milestone-4': 'August 2024 - Joining Hyper Island',
      'module-leadership': 'Leadership Module',
      'module-frontend': 'HTML/CSS/JS Module',
      'module-agile': 'Agile Module',
      'module-react': 'React Module',
      'module-figma': 'Figma & UX Module',
      'module-backend': 'Backend/SEO/Accessibility Module',
      'module-client': 'Client Project Module',
      'module-webxr': 'WebXR Module',
      'final-portal': 'Towards the New Future'
    };

    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl.hasLoaded) this.onSceneReady();
    else sceneEl.addEventListener('loaded', () => this.onSceneReady());
  }

  onSceneReady() {
    this.cameraRig = document.querySelector('#cameraRig');

    Object.keys(this.milestoneTitles).forEach(id => {
      const icon = document.querySelector(`#${id}-icon`);
      const panel = document.querySelector(`#${id}-panel`);
      if (icon && panel) {
        icon.addEventListener('click', () => {
          panel.setAttribute('visible', true);
          setTimeout(() => panel.setAttribute('visible', false), 8000);
        });
      }
    });

    this.createUI();
    this.generateClouds();
    this.startJourney();
    this.animate();

    document.getElementById('start-btn').addEventListener('click', () => this.isMoving = true);
    document.getElementById('pause-btn').addEventListener('click', () => this.isMoving = false);
  }

  createUI() {
    const title = document.createElement('div');
    title.className = 'experience-title';
    title.textContent = 'The Journey of Change';
    document.body.appendChild(title);

    const pContainer = document.createElement('div');
    pContainer.className = 'progress-container';
    pContainer.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(pContainer);
    this.progressBar = pContainer.querySelector('.progress-bar');

    const notif = document.createElement('div');
    notif.className = 'milestone-notification';
    document.body.appendChild(notif);
    this.milestoneNotification = notif;

    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.innerHTML = `🖱️ Mouse: Look around<br>⌨️ WASD: Move<br>📱 Tap to move<br>🥽 VR mode<br><b>🖱️ Click on icons along the path to interact and learn more!</b>`;
    document.body.appendChild(instructions);
  }

  generateClouds() {
    const container = document.querySelector('#clouds-container');
    for (let i = 0; i < 15; i++) {
      const cloud = document.createElement('a-sphere');
      cloud.setAttribute('radius', Math.random() * 2 + 1);
      cloud.setAttribute('color', '#fff');
      cloud.setAttribute('position', `${(Math.random() - 0.5) * 100} ${Math.random() * 20 + 15} ${Math.random() * 200 - 20}`);
      cloud.setAttribute('material', 'opacity: 0.7');
      container.appendChild(cloud);
    }
  }

  startJourney() {
    setTimeout(() => {
      const first = document.querySelector('#milestone-1');
      if (first) first.setAttribute('visible', true);
    }, 2000);
  }

  animate() {
    if (this.isMoving && this.cameraRig) {
      this.currentPosition -= this.speed;
      this.cameraRig.setAttribute('position', `0 1.6 ${this.currentPosition}`);

      const prog = Math.min((-this.currentPosition + 5) / 195 * 100, 100);
      this.progressBar.style.width = `${prog}%`;

      this.checkMilestones();
    }
    requestAnimationFrame(() => this.animate());
  }

  checkMilestones() {
    for (let i = this.currentMilestone; i < this.milestonePositions.length; i++) {
      const m = this.milestonePositions[i];
      if (this.currentPosition <= m.z + 3) {
        const el = document.querySelector(`#${m.id}`);
        if (el) el.setAttribute('visible', true);

        this.isMoving = false;
        this.showMilestoneNotification(m.id);
        this.showFloatingText(m.id);

        // Add module effect for specific modules
        if (m.id.startsWith('module-')) {
          this.createModuleEffect(m.id);
        }

        this.currentMilestone = i + 1;
        break;
      }
    }
  }

  showMilestoneNotification(id) {
    const label = this.milestoneTitles[id] || id;
    this.milestoneNotification.innerHTML = `<h3>${label}</h3>`;
    this.milestoneNotification.classList.add('show');
    setTimeout(() => {
      this.milestoneNotification.classList.remove('show');
    }, 3000);
  }

  createModuleEffect(id) {
    const icon = document.querySelector(`#${id}-icon`);
    if (!icon) return;

    const backpack = document.querySelector('#backpack');
    if (!backpack) {
      console.error('Backpack not found');
      return;
    }

    // Get world position of backpack
    const backpackWorldPos = new THREE.Vector3();
    backpack.object3D.getWorldPosition(backpackWorldPos);
    console.log('Backpack world position:', backpackWorldPos);

    // Get the icon source
    const iconSrc = icon.getAttribute('src');
    const iconWidth = 0.7;
    const iconHeight = 0.7;

    // Get animated character's position and forward direction
    const character = document.querySelector('#animated-character');
    const charWorldPos = new THREE.Vector3();
    character.object3D.getWorldPosition(charWorldPos);
    const charDir = new THREE.Vector3(0, 0, -1); // Default forward in A-Frame
    charDir.applyQuaternion(character.object3D.quaternion);
    // Place the icon 2 units in front of the character
    const startPos = {
      x: charWorldPos.x + charDir.x * 2,
      y: charWorldPos.y + charDir.y * 2 + 1, // slightly above character
      z: charWorldPos.z + charDir.z * 2
    };

    // Create module-specific effect based on ID
    switch(id) {
      case 'module-leadership':
        this.createIconEffect(startPos, backpackWorldPos, iconSrc, iconWidth, iconHeight, '#FFD700');
        break;
      case 'module-frontend':
        this.createIconEffect(startPos, backpackWorldPos, iconSrc, iconWidth, iconHeight, '#00ff00');
        break;
      case 'module-agile':
        this.createIconEffect(startPos, backpackWorldPos, iconSrc, iconWidth, iconHeight, '#ffeb3b');
        break;
      case 'module-react':
        this.createIconEffect(startPos, backpackWorldPos, iconSrc, iconWidth, iconHeight, '#61DAFB');
        break;
      case 'module-figma':
        this.createIconEffect(startPos, backpackWorldPos, iconSrc, iconWidth, iconHeight, '#0ACF83');
        break;
      case 'module-backend':
        this.createIconEffect(startPos, backpackWorldPos, iconSrc, iconWidth, iconHeight, '#2196F3');
        break;
      case 'module-client':
        this.createIconEffect(startPos, backpackWorldPos, iconSrc, iconWidth, iconHeight, '#E91E63');
        break;
      case 'module-webxr':
        this.createIconEffect(startPos, backpackWorldPos, iconSrc, iconWidth, iconHeight, '#9C27B0');
        break;
    }
  }

  createIconEffect(startPos, targetPos, iconSrc, width, height, glowColor) {
    // Create icon clone
    const icon = document.createElement('a-image');
    icon.setAttribute('src', iconSrc);
    icon.setAttribute('width', width);
    icon.setAttribute('height', height);
    icon.setAttribute('position', startPos);
    icon.setAttribute('material', `shader: flat; color: ${glowColor}; opacity: 0.8`);
    
    // Add glow effect
    icon.setAttribute('animation__glow', {
      property: 'material.opacity',
      from: 0.8,
      to: 0.4,
      dur: 1000,
      dir: 'alternate',
      loop: true
    });

    // Add floating animation
    icon.setAttribute('animation__float', {
      property: 'position',
      from: `${startPos.x} ${startPos.y} ${startPos.z}`,
      to: `${targetPos.x} ${targetPos.y} ${targetPos.z}`,
      dur: 2000,
      easing: 'easeInOutQuad'
    });

    // Add rotation animation
    icon.setAttribute('animation__rotate', {
      property: 'rotation',
      from: '0 0 0',
      to: '0 360 0',
      dur: 2000,
      loop: true
    });

    // Add scale animation
    icon.setAttribute('animation__scale', {
      property: 'scale',
      from: '1 1 1',
      to: '0.5 0.5 0.5',
      dur: 2000,
      easing: 'easeInOutQuad'
    });

    document.querySelector('a-scene').appendChild(icon);

    // Remove after animation
    setTimeout(() => {
      icon.parentNode && icon.parentNode.removeChild(icon);
    }, 4000);
  }
}

// ✅ Start the journey
document.addEventListener('DOMContentLoaded', () => new JourneyExperience());
