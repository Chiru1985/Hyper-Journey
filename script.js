// Loading screen
const loadingScreen = document.getElementById('loading-screen');
const scene = document.querySelector('a-scene');
scene.addEventListener('loaded', () => loadingScreen.classList.add('hidden'));

class JourneyExperience {
  constructor() {
    this.cameraRig = null;
    this.currentMilestone = 0;
    this.isMoving = false;
    this.speed = 0.05;
    this.currentPosition = -5;

    // Milestone positions
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

    // Milestone display names
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

    // Add click listeners to milestone/module icons
    const clickableIds = [
      'milestone-1', 'milestone-2', 'milestone-3', 'milestone-4',
      'module-leadership', 'module-frontend', 'module-agile',
      'module-react', 'module-figma', 'module-backend',
      'module-client', 'module-webxr'
    ];
    clickableIds.forEach(id => {
      const icon = document.querySelector(`#${id}-icon`);
      const panel = document.querySelector(`#${id}-panel`);
      if (icon && panel) {
        icon.addEventListener('click', () => {
          panel.setAttribute('visible', true);
          setTimeout(() => panel.setAttribute('visible', false), 8000);
        });
      }
    });

    // UI and animation
    this.createUI();
    this.generateClouds();
    this.startJourney();
    this.animate();

    document.getElementById('start-btn').addEventListener('click', () => {
      this.isMoving = true;
    });
    document.getElementById('pause-btn').addEventListener('click', () => {
      this.isMoving = false;
    });
  }

  createUI() {
    // Title
    const title = document.createElement('div');
    title.className = 'experience-title';
    title.textContent = 'The Journey of Change';
    document.body.appendChild(title);

    // Progress bar
    const pContainer = document.createElement('div');
    pContainer.className = 'progress-container';
    pContainer.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(pContainer);
    this.progressBar = pContainer.querySelector('.progress-bar');

    // Notification
    const notif = document.createElement('div');
    notif.className = 'milestone-notification';
    document.body.appendChild(notif);
    this.milestoneNotification = notif;

    // Instructions
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.innerHTML = `🖱️ Mouse: Look around<br>⌨️ WASD: Move<br>📱 Tap to move<br>🥽 VR mode`;
    document.body.appendChild(instructions);
  }

  generateClouds() {
    const cContainer = document.querySelector('#clouds-container');
    for (let i = 0; i < 15; i++) {
      const cloud = document.createElement('a-sphere');
      cloud.setAttribute('radius', Math.random() * 2 + 1);
      cloud.setAttribute('color', '#fff');
      cloud.setAttribute('position', `${(Math.random() - 0.5) * 100} ${Math.random() * 20 + 15} ${Math.random() * 200 - 20}`);
      cloud.setAttribute('material', 'opacity: 0.7');
      cContainer.appendChild(cloud);
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
}

// Start the experience
document.addEventListener('DOMContentLoaded', () => new JourneyExperience());
