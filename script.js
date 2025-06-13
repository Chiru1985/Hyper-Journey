// Loading screen management
const loadingScreen = document.getElementById('loading-screen');
const scene = document.querySelector('a-scene');

scene.addEventListener('loaded', () => {
    loadingScreen.classList.add('hidden');
});

// The Journey of Change - WebXR Experience Logic
class JourneyExperience {
    constructor() {
        this.cameraRig = null;
        this.backpack = null;
        this.animatedCharacter = null;
        this.currentMilestone = 0;
        this.isMoving = false;
        this.speed = 0.05;
        this.currentPosition = -5;

        this.milestonePositions = [
            { z: -10, id: 'milestone-1', name: '2019 - Arrival in Stockholm' },
            { z: -25, id: 'milestone-2', name: '2019-2024 - Indian Grocery Store' },
            { z: -40, id: 'milestone-3', name: 'July 2024 - Career Shift' },
            { z: -55, id: 'milestone-4', name: 'August 2024 - Hyper Island' },
            { z: -70, id: 'module-leadership', name: 'Leadership Module' },
            { z: -85, id: 'module-frontend', name: 'HTML/CSS/JS Module' },
            { z: -100, id: 'module-agile', name: 'Agile Module' },
            { z: -115, id: 'module-react', name: 'React Module' },
            { z: -130, id: 'module-figma', name: 'Figma & UX Module' },
            { z: -145, id: 'module-backend', name: 'Backend/SEO/Accessibility Module' },
            { z: -160, id: 'module-client', name: 'Client Project Module' },
            { z: -175, id: 'module-webxr', name: 'WebXR Module' },
            { z: -190, id: 'final-portal', name: 'Final Destination' }
        ];

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
        const scene = document.querySelector('a-scene');
        if (scene.hasLoaded) {
            this.onSceneReady();
        } else {
            scene.addEventListener('loaded', () => this.onSceneReady());
        }
    }

    onSceneReady() {
        this.cameraRig = document.querySelector('#cameraRig');
        this.backpack = document.querySelector('#backpack');
        this.animatedCharacter = document.querySelector('#animated-character');
   // Add interaction for Milestone 1 text → show panel
const milestone1Text = document.querySelector('#milestone-1-text');
const milestone1Panel = document.querySelector('#milestone-1-panel');

milestone1Text.addEventListener('click', () => {
    milestone1Panel.setAttribute('visible', true);

    // Auto-hide panel after 5 seconds
    setTimeout(() => {
        milestone1Panel.setAttribute('visible', false);
    }, 5000);
});


        this.createUI();
        this.generateClouds();
        this.startJourney();

        this.animate();

        // Add button listeners
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');

        startBtn.addEventListener('click', () => {
            this.isMoving = true;
        });

        pauseBtn.addEventListener('click', () => {
            this.isMoving = false;
        });
    }

    createUI() {
        const title = document.createElement('div');
        title.className = 'experience-title';
        title.textContent = 'The Journey of Change';
        document.body.appendChild(title);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = '<div class="progress-bar"></div>';
        document.body.appendChild(progressContainer);
        this.progressBar = progressContainer.querySelector('.progress-bar');

        this.milestoneNotification = document.createElement('div');
        this.milestoneNotification.className = 'milestone-notification';
        document.body.appendChild(this.milestoneNotification);

        const instructions = document.createElement('div');
        instructions.className = 'instructions';
        instructions.innerHTML = `
🖱️ Mouse: Look around<br>
⌨️ WASD: Move<br>
📱 Touch: Tap to move<br>
🥽 VR: Enter VR mode (if available)
        `;
        document.body.appendChild(instructions);
    }

    generateClouds() {
        const cloudsContainer = document.querySelector('#clouds-container');
        const cloudCount = 15;
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('a-sphere');
            cloud.setAttribute('radius', Math.random() * 2 + 1);
            cloud.setAttribute('color', '#ffffff');
            cloud.setAttribute('position', `
                ${(Math.random() - 0.5) * 100} 
                ${Math.random() * 20 + 15} 
                ${Math.random() * 200 - 20}
            `);
            cloud.setAttribute('material', 'opacity: 0.7');
            cloudsContainer.appendChild(cloud);
        }
    }

    startJourney() {
        setTimeout(() => {
            const firstMilestone = document.querySelector('#milestone-1');
            if (firstMilestone) {
                firstMilestone.setAttribute('visible', true);
            }
        }, 2000);
    }

    animate() {
        if (this.isMoving && this.cameraRig) {
            // Move cameraRig forward along z-axis
            this.currentPosition -= this.speed;
            this.cameraRig.setAttribute('position', `0 1.6 ${this.currentPosition}`);

            // No need to manually move animatedCharacter → it is inside cameraRig, it moves with it!

            // Update progress bar
            const progress = Math.min((-this.currentPosition + 5) / 195 * 100, 100);
            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;
            }

            this.checkMilestones();
        }
        requestAnimationFrame(() => this.animate());
    }

    checkMilestones() {
        for (let i = this.currentMilestone; i < this.milestonePositions.length; i++) {
            const milestone = this.milestonePositions[i];
            if (this.currentPosition <= milestone.z + 3) {
                this.triggerMilestone(milestone, i);
                this.currentMilestone = i + 1;
                break;
            }
        }
    }

    triggerMilestone(milestone, index) {
        const milestoneElement = document.querySelector(`#${milestone.id}`);
        if (milestoneElement) {
            milestoneElement.setAttribute('visible', true);
        }

        if (milestone.id === 'milestone-4' && this.backpack) {
            this.backpack.setAttribute('visible', true);
        }

        if (milestone.id === 'milestone-2') {
            this.floatItemIntoBackpack('4 1 -25', '#ff6b6b');
        }

        if (milestone.id === 'final-portal') {
            this.isMoving = false;
            const portalText = document.querySelector('#final-portal a-text');
            if (portalText) {
                portalText.setAttribute('value', 'Towards the Future');
            }
        }

        this.showMilestoneNotification(milestone.name);
    }

    floatItemIntoBackpack(position, color = '#ffffff') {
        const scene = document.querySelector('a-scene');
        const item = document.createElement('a-sphere');
        item.setAttribute('position', position);
        item.setAttribute('radius', 0.2);
        item.setAttribute('color', color);
        item.setAttribute('material', 'opacity: 0.9');
        scene.appendChild(item);

        const backpack = document.querySelector('#backpack');
        const backpackPos = backpack.object3D.getWorldPosition(new THREE.Vector3());

        item.setAttribute('animation__move', {
            property: 'position',
            to: `${backpackPos.x} ${backpackPos.y} ${backpackPos.z}`,
            dur: 2000,
            easing: 'easeInOutCubic'
        });

        setTimeout(() => item.remove(), 3000);
    }

    showMilestoneNotification(name) {
        if (!this.milestoneNotification) return;
        this.milestoneNotification.innerHTML = `<h3>${name}</h3>`;
        this.milestoneNotification.classList.add('show');
        setTimeout(() => {
            this.milestoneNotification.classList.remove('show');
        }, 3000);
    }
}

// Initialize experience
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new JourneyExperience());
} else {
    new JourneyExperience();
}
