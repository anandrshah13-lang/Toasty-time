/**
 * TOASTY TIME - A cozy hug app for Seema
 *
 * TO CUSTOMIZE:
 * Edit config.js to change names, messages, and durations.
 * Change recipientName, dogName, and message arrays to personalize.
 */

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new ToastyTime();
    app.init();
});

class ToastyTime {
    constructor() {
        this.config = window.TOASTY_CONFIG || this.getDefaultConfig();
        this.settings = this.loadSettings();
        this.progress = this.loadProgress();

        // State for hold interactions
        this.holdState = {
            isHolding: false,
            startTime: null,
            elapsed: 0,
            warmth: 0,
            promptIndex: 0,
            animationFrame: null,
            promptInterval: null
        };

        // Audio context for simple tones
        this.audioContext = null;
        this.backgroundOscillator = null;
    }

    getDefaultConfig() {
        // Fallback if config.js fails to load
        return {
            recipientName: 'Friend',
            dogName: 'Toasty',
            homeSubheaders: ['Toasty is here for you.'],
            hugHoldPrompts: ['Breathe in… Toasty\'s got you.'],
            hugCompletePrompts: ['You did it. Toasty is proud of you.'],
            anandNotes: ['You\'re loved.'],
            danceMessages: ['Ready to dance?'],
            durations: {
                quickHugSeconds: 60,
                hugModeMaxSeconds: 120
            },
            featureFlags: {
                enableSound: false,
                enableReduceMotionToggle: true
            }
        };
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.applySettings();
        this.updateHomeScreen();
        this.updateLevelDisplay();
        this.showScreen('home-screen');
    }

    cacheElements() {
        // Screens
        this.screens = {
            home: document.getElementById('home-screen'),
            quickHug: document.getElementById('quick-hug-screen'),
            quickComplete: document.getElementById('quick-complete-screen'),
            hugMode: document.getElementById('hug-mode-screen'),
            hugComplete: document.getElementById('hug-complete-screen'),
            dance: document.getElementById('dance-mode-screen')
        };

        // Home elements
        this.homeHeader = document.getElementById('home-header');
        this.homeSubheader = document.getElementById('home-subheader');

        // Level elements
        this.levelTitle = document.getElementById('level-title');
        this.levelStats = document.getElementById('level-stats');
        this.levelProgressFill = document.getElementById('level-progress-fill');
        this.levelIcon = document.querySelector('.level-icon');

        // Buttons
        this.quickHugBtn = document.getElementById('quick-hug-btn');
        this.hugModeBtn = document.getElementById('hug-mode-btn');
        this.danceModeBtn = document.getElementById('dance-mode-btn');
        this.soundToggle = document.getElementById('sound-toggle');
        this.motionToggle = document.getElementById('motion-toggle');

        // Quick Hug elements
        this.quickToastyHold = document.getElementById('quick-toasty-hold');
        this.quickProgressRing = document.getElementById('quick-progress-ring');
        this.quickTimer = document.getElementById('quick-timer');
        this.quickPrompt = document.getElementById('quick-prompt');
        this.quickBackBtn = document.getElementById('quick-back-btn');

        // Quick Complete elements
        this.quickCompleteMessage = document.getElementById('quick-complete-message');
        this.quickAnandNote = document.getElementById('quick-anand-note');
        this.sendHugBackBtn = document.getElementById('send-hug-back-btn');
        this.quickCompleteHomeBtn = document.getElementById('quick-complete-home-btn');

        // Hug Mode elements
        this.hugToastyHold = document.getElementById('hug-toasty-hold');
        this.hugProgressRing = document.getElementById('hug-progress-ring');
        this.warmthCounter = document.getElementById('warmth-counter');
        this.warmthReaction = document.getElementById('warmth-reaction');
        this.hugBackBtn = document.getElementById('hug-back-btn');

        // Hug Complete elements
        this.finalWarmth = document.getElementById('final-warmth');
        this.hugCompleteMessage = document.getElementById('hug-complete-message');
        this.hugAnandNote = document.getElementById('hug-anand-note');
        this.hugCompleteHomeBtn = document.getElementById('hug-complete-home-btn');

        // Dance elements
        this.danceBtn = document.getElementById('dance-btn');
        this.danceMessage = document.getElementById('dance-message');
        this.danceBackBtn = document.getElementById('dance-back-btn');

        // Confetti container
        this.confettiContainer = document.getElementById('confetti-container');
    }

    attachEventListeners() {
        // Navigation
        this.quickHugBtn.addEventListener('click', () => this.startQuickHug());
        this.hugModeBtn.addEventListener('click', () => this.startHugMode());
        this.danceModeBtn.addEventListener('click', () => this.startDanceMode());

        // Settings
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        this.motionToggle.addEventListener('click', () => this.toggleMotion());

        // Quick Hug interactions (both touch and mouse)
        this.quickToastyHold.addEventListener('mousedown', (e) => this.startHold(e, 'quick'));
        this.quickToastyHold.addEventListener('touchstart', (e) => this.startHold(e, 'quick'));
        document.addEventListener('mouseup', (e) => this.endHold(e, 'quick'));
        document.addEventListener('touchend', (e) => this.endHold(e, 'quick'));

        // Hug Mode interactions
        this.hugToastyHold.addEventListener('mousedown', (e) => this.startHold(e, 'hug'));
        this.hugToastyHold.addEventListener('touchstart', (e) => this.startHold(e, 'hug'));

        // Back buttons
        this.quickBackBtn.addEventListener('click', () => this.goHome());
        this.quickCompleteHomeBtn.addEventListener('click', () => this.goHome());
        this.hugBackBtn.addEventListener('click', () => this.goHome());
        this.hugCompleteHomeBtn.addEventListener('click', () => this.goHome());
        this.danceBackBtn.addEventListener('click', () => this.goHome());

        // Special actions
        this.sendHugBackBtn.addEventListener('click', () => this.sendHugBack());
        this.danceBtn.addEventListener('click', () => this.triggerDance());
    }

    // String formatting helper
    format(str) {
        return str
            .replace(/\{recipientName\}/g, this.config.recipientName)
            .replace(/\{dogName\}/g, this.config.dogName);
    }

    // Random picker
    randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Screen management
    showScreen(screenId) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        const targetScreen = Object.values(this.screens).find(s => s.id === screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    updateHomeScreen() {
        this.homeHeader.textContent = this.format(`Hi {recipientName}`);
        this.homeSubheader.textContent = this.format(this.randomFrom(this.config.homeSubheaders));
    }

    goHome() {
        this.resetHoldState();
        this.updateHomeScreen();
        this.updateLevelDisplay();
        this.showScreen('home-screen');
    }

    // Settings
    loadSettings() {
        const saved = localStorage.getItem('toastyTime.settings');
        return saved ? JSON.parse(saved) : {
            soundOn: false,
            reduceMotion: false
        };
    }

    saveSettings() {
        localStorage.setItem('toastyTime.settings', JSON.stringify(this.settings));
    }

    applySettings() {
        // Sound icon
        this.soundToggle.querySelector('.sound-icon').textContent = this.settings.soundOn ? '🔊' : '🔇';

        // Motion toggle
        this.motionToggle.querySelector('.motion-icon').textContent = this.settings.reduceMotion ? '✨' : '✨';
        if (this.settings.reduceMotion) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }

        // Apply audio settings
        if (this.settings.soundOn) {
            this.startBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
    }

    toggleSound() {
        this.settings.soundOn = !this.settings.soundOn;
        this.saveSettings();
        this.applySettings();
    }

    // Simple ambient background music using Web Audio API
    startBackgroundMusic() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Web Audio API not supported');
                return;
            }
        }

        // Resume audio context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (this.backgroundOscillator) return; // Already playing

        // Create a gentle ambient tone (very low volume)
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Two overlapping sine waves for a peaceful sound
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
        osc2.frequency.setValueAtTime(330, this.audioContext.currentTime); // E4

        // Very low volume
        gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);

        // Connect oscillators through gain to output
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        osc1.start();
        osc2.start();

        this.backgroundOscillator = { osc1, osc2, gainNode };
    }

    stopBackgroundMusic() {
        if (this.backgroundOscillator) {
            try {
                this.backgroundOscillator.osc1.stop();
                this.backgroundOscillator.osc2.stop();
            } catch (e) {
                // Already stopped
            }
            this.backgroundOscillator = null;
        }
    }

    playLevelUpSound() {
        if (!this.settings.soundOn || !this.audioContext) return;

        // Create a cheerful ascending arpeggio
        const now = this.audioContext.currentTime;
        const notes = [262, 330, 392, 523]; // C4, E4, G4, C5

        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);

            gain.gain.setValueAtTime(0.1, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
        });
    }

    toggleMotion() {
        this.settings.reduceMotion = !this.settings.reduceMotion;
        this.saveSettings();
        this.applySettings();
    }

    // Progress tracking
    loadProgress() {
        const saved = localStorage.getItem('toastyTime.progress');
        return saved ? JSON.parse(saved) : {
            hugsCompleted: 0,
            warmthTotal: 0,
            lastPlayedISO: null
        };
    }

    saveProgress() {
        localStorage.setItem('toastyTime.progress', JSON.stringify(this.progress));
    }

    // Quick Hug Mode
    startQuickHug() {
        this.resetHoldState();
        this.holdState.mode = 'quick';
        this.holdState.targetDuration = this.config.durations.quickHugSeconds;
        this.quickTimer.textContent = '1:00';
        this.quickPrompt.textContent = this.format(this.randomFrom(this.config.hugHoldPrompts));
        this.quickProgressRing.style.strokeDashoffset = 817;
        this.showScreen('quick-hug-screen');
    }

    // Hug Mode
    startHugMode() {
        this.resetHoldState();
        this.holdState.mode = 'hug';
        this.holdState.targetDuration = this.config.durations.hugModeMaxSeconds;
        this.warmthCounter.textContent = '0';
        this.warmthReaction.textContent = '';
        this.hugProgressRing.style.strokeDashoffset = 817;
        this.showScreen('hug-mode-screen');
    }

    // Hold interaction
    startHold(e, mode) {
        e.preventDefault();

        if (this.holdState.mode !== mode) return;

        this.holdState.isHolding = true;
        this.holdState.startTime = Date.now() - (this.holdState.elapsed * 1000);

        // Visual feedback
        if (mode === 'quick') {
            this.quickToastyHold.classList.add('holding');
        } else if (mode === 'hug') {
            this.hugToastyHold.classList.add('holding');
        }

        // Start animation loop
        this.holdState.animationFrame = requestAnimationFrame(() => this.updateHold());

        // Start prompt rotation (every 8 seconds)
        if (mode === 'quick') {
            this.holdState.promptInterval = setInterval(() => this.rotatePrompt(), 8000);
        }

        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }

    endHold(e, mode) {
        if (!this.holdState.isHolding || this.holdState.mode !== mode) return;

        this.holdState.isHolding = false;

        // Remove visual feedback
        if (mode === 'quick') {
            this.quickToastyHold.classList.remove('holding');
        } else if (mode === 'hug') {
            this.hugToastyHold.classList.remove('holding');
        }

        // Stop animation loop
        if (this.holdState.animationFrame) {
            cancelAnimationFrame(this.holdState.animationFrame);
            this.holdState.animationFrame = null;
        }

        // Stop prompt rotation
        if (this.holdState.promptInterval) {
            clearInterval(this.holdState.promptInterval);
            this.holdState.promptInterval = null;
        }

        // Check completion
        const completed = this.holdState.elapsed >= this.holdState.targetDuration;

        if (mode === 'quick') {
            if (completed) {
                this.completeQuickHug();
            }
            // If not completed, allow resume (don't reset)
        } else if (mode === 'hug') {
            // Hug mode can end anytime
            this.completeHugMode();
        }
    }

    updateHold() {
        if (!this.holdState.isHolding) return;

        const now = Date.now();
        this.holdState.elapsed = Math.min(
            (now - this.holdState.startTime) / 1000,
            this.holdState.targetDuration
        );

        const mode = this.holdState.mode;

        if (mode === 'quick') {
            // Update timer
            const remaining = Math.max(0, this.holdState.targetDuration - this.holdState.elapsed);
            const minutes = Math.floor(remaining / 60);
            const seconds = Math.floor(remaining % 60);
            this.quickTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            // Update progress ring
            const progress = this.holdState.elapsed / this.holdState.targetDuration;
            const circumference = 817;
            const offset = circumference * (1 - progress);
            this.quickProgressRing.style.strokeDashoffset = offset;

            // Check if completed
            if (this.holdState.elapsed >= this.holdState.targetDuration) {
                this.endHold(null, 'quick');
                return;
            }
        } else if (mode === 'hug') {
            // Update warmth
            this.holdState.warmth = Math.floor(this.holdState.elapsed);
            this.warmthCounter.textContent = this.holdState.warmth;

            // Update progress ring
            const progress = this.holdState.elapsed / this.holdState.targetDuration;
            const circumference = 817;
            const offset = circumference * (1 - progress);
            this.hugProgressRing.style.strokeDashoffset = offset;

            // Trigger reactions at thresholds
            this.checkWarmthThresholds();

            // Auto-complete at max duration
            if (this.holdState.elapsed >= this.holdState.targetDuration) {
                this.endHold(null, 'hug');
                return;
            }
        }

        // Continue animation loop
        this.holdState.animationFrame = requestAnimationFrame(() => this.updateHold());
    }

    rotatePrompt() {
        if (!this.holdState.isHolding) return;
        this.holdState.promptIndex = (this.holdState.promptIndex + 1) % this.config.hugHoldPrompts.length;
        this.quickPrompt.textContent = this.format(this.config.hugHoldPrompts[this.holdState.promptIndex]);
    }

    checkWarmthThresholds() {
        const warmth = this.holdState.warmth;
        const lastCheck = this.holdState.lastThreshold || 0;

        if (warmth >= 10 && lastCheck < 10) {
            this.warmthReaction.textContent = '*wag wag*';
            this.holdState.lastThreshold = 10;
        } else if (warmth >= 30 && lastCheck < 30) {
            this.warmthReaction.textContent = '*bounce*';
            this.holdState.lastThreshold = 30;
        } else if (warmth >= 60 && lastCheck < 60) {
            this.warmthReaction.textContent = '✨💖✨';
            this.holdState.lastThreshold = 60;
        }
    }

    completeQuickHug() {
        // Store previous hug count for level check
        const previousHugs = this.progress.hugsCompleted;

        // Update progress
        this.progress.hugsCompleted++;
        this.progress.lastPlayedISO = new Date().toISOString();
        this.saveProgress();

        // Show completion message
        this.quickCompleteMessage.textContent = this.format(this.randomFrom(this.config.hugCompletePrompts));
        this.quickAnandNote.textContent = this.randomFrom(this.config.anandNotes);

        this.showScreen('quick-complete-screen');

        // Check for level up
        this.checkLevelUp(previousHugs);

        // Update level display
        this.updateLevelDisplay();
    }

    completeHugMode() {
        // Store previous hug count for level check
        const previousHugs = this.progress.hugsCompleted;

        // Update progress
        this.progress.hugsCompleted++;
        this.progress.warmthTotal += this.holdState.warmth;
        this.progress.lastPlayedISO = new Date().toISOString();
        this.saveProgress();

        // Show completion message
        this.finalWarmth.textContent = this.holdState.warmth;
        this.hugCompleteMessage.textContent = this.format(this.randomFrom(this.config.hugCompletePrompts));
        this.hugAnandNote.textContent = this.randomFrom(this.config.anandNotes);

        this.showScreen('hug-complete-screen');

        // Check for level up
        this.checkLevelUp(previousHugs);

        // Update level display
        this.updateLevelDisplay();
    }

    sendHugBack() {
        this.createConfetti();

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([50, 100, 50]);
        }

        this.sendHugBackBtn.textContent = 'Hug received! 💖';
        setTimeout(() => {
            this.sendHugBackBtn.textContent = 'Send a hug back';
        }, 2000);
    }

    resetHoldState() {
        if (this.holdState.animationFrame) {
            cancelAnimationFrame(this.holdState.animationFrame);
        }
        if (this.holdState.promptInterval) {
            clearInterval(this.holdState.promptInterval);
        }

        this.holdState = {
            isHolding: false,
            startTime: null,
            elapsed: 0,
            warmth: 0,
            promptIndex: 0,
            animationFrame: null,
            promptInterval: null,
            lastThreshold: 0
        };
    }

    // Dance Mode
    startDanceMode() {
        this.danceMessage.textContent = this.format(this.randomFrom(this.config.danceMessages));
        this.showScreen('dance-mode-screen');
    }

    triggerDance() {
        const messages = this.config.danceMessages;
        this.danceMessage.textContent = this.format(this.randomFrom(messages));

        this.createConfetti();

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([30, 50, 30, 50, 30]);
        }
    }

    // Confetti effect
    createConfetti() {
        const count = 50;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
                this.confettiContainer.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }

    // Level System
    getCurrentLevel() {
        const hugs = this.progress.hugsCompleted;
        const levels = this.config.levels || [];

        // Find the highest level unlocked
        let currentLevel = levels[0];
        for (let i = 0; i < levels.length; i++) {
            if (hugs >= levels[i].hugsRequired) {
                currentLevel = levels[i];
            } else {
                break;
            }
        }
        return currentLevel;
    }

    getNextLevel() {
        const currentLevel = this.getCurrentLevel();
        const levels = this.config.levels || [];
        const currentIndex = levels.findIndex(l => l.id === currentLevel.id);

        if (currentIndex < levels.length - 1) {
            return levels[currentIndex + 1];
        }
        return null; // Max level reached
    }

    updateLevelDisplay() {
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();
        const hugs = this.progress.hugsCompleted;

        // Update level title and icon
        this.levelTitle.textContent = currentLevel.name;
        this.levelIcon.textContent = currentLevel.icon;

        if (nextLevel) {
            // Calculate progress to next level
            const hugsInCurrentLevel = hugs - currentLevel.hugsRequired;
            const hugsNeededForNext = nextLevel.hugsRequired - currentLevel.hugsRequired;
            const progressPercent = (hugsInCurrentLevel / hugsNeededForNext) * 100;

            // Update progress bar
            this.levelProgressFill.style.width = progressPercent + '%';

            // Update stats text
            const remaining = nextLevel.hugsRequired - hugs;
            this.levelStats.textContent = `${remaining} hug${remaining === 1 ? '' : 's'} to next level`;
        } else {
            // Max level reached
            this.levelProgressFill.style.width = '100%';
            this.levelStats.textContent = 'Max level! You\'re legendary! ⭐';
        }
    }

    checkLevelUp(previousHugs) {
        const prevLevel = this.getLevelForHugCount(previousHugs);
        const currentLevel = this.getCurrentLevel();

        if (currentLevel.id > prevLevel.id) {
            // Level up!
            this.celebrateLevelUp(currentLevel);
            return true;
        }
        return false;
    }

    getLevelForHugCount(hugCount) {
        const levels = this.config.levels || [];
        let level = levels[0];
        for (let i = 0; i < levels.length; i++) {
            if (hugCount >= levels[i].hugsRequired) {
                level = levels[i];
            } else {
                break;
            }
        }
        return level;
    }

    celebrateLevelUp(newLevel) {
        // Add celebration animation
        const levelBadge = document.querySelector('.level-badge');
        if (levelBadge) {
            levelBadge.classList.add('level-up-animation');
            setTimeout(() => levelBadge.classList.remove('level-up-animation'), 800);
        }

        // Confetti!
        this.createConfetti();

        // Play level-up sound
        this.playLevelUpSound();

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }

        // Show level-up message (you could make this a modal, but for now we'll use a subtle approach)
        const levelUpMsg = this.format(this.randomFrom(this.config.levelUpMessages || []));
        const levelMsg = this.format(newLevel.message);

        // Update the completion message to include level up
        setTimeout(() => {
            if (this.quickCompleteMessage) {
                this.quickCompleteMessage.textContent = `${levelUpMsg} ${newLevel.icon}`;
            }
            if (this.hugCompleteMessage) {
                this.hugCompleteMessage.textContent = `${levelUpMsg} ${newLevel.icon}`;
            }
        }, 100);

        // Optionally log to console for debugging
        console.log(`🎉 Level Up! Now at: ${newLevel.name} ${newLevel.icon}`);
    }
}
