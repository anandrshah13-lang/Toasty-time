/**
 * TOASTY TIME CONFIGURATION
 *
 * Personalize all messages here!
 * Use {recipientName} and {dogName} as placeholders in any message.
 *
 * To customize:
 * 1. Change recipientName and dogName below
 * 2. Edit or add messages to any array
 * 3. Adjust durations if needed
 */

window.TOASTY_CONFIG = {
    // Core names
    recipientName: 'Seema',
    dogName: 'Toasty',

    // Home screen rotating messages (shown under "Hi Seema")
    homeSubheaders: [
        '{dogName} is here for you.',
        'A quick {dogName} hug?',
        'You\'ve got this, {recipientName}. {dogName}\'s on cuddle duty.',
        'Need a moment? {dogName} is waiting.',
        'Your favorite pup is ready.',
        'Garden time in your pocket.',
        '{dogName} says: You\'re doing great.',
        'Breathe. {dogName}\'s here.',
        'A soft pause, whenever you need it.',
        '{dogName} misses you too.'
    ],

    // Messages shown while holding during Quick Hug (rotate every 8-10 seconds)
    hugHoldPrompts: [
        'Breathe in… {dogName}\'s got you, {recipientName}.',
        'Breathe out… good job.',
        'Just this minute, {recipientName}.',
        'Soft shoulders. Gentle breath.',
        '{dogName} is right here.',
        'You\'re safe. This is your minute.',
        'Let your breath slow down.',
        'Feel {dogName}\'s warmth.',
        'Nothing else matters right now.',
        'One breath at a time.',
        'You\'re doing beautifully, {recipientName}.',
        '{dogName} believes in you.',
        'This moment is yours.',
        'Inhale peace. Exhale worry.',
        'You are enough, {recipientName}.',
        '{dogName}\'s tail is wagging for you.',
        'Rest here. Just for now.',
        'The world can wait.'
    ],

    // Completion messages (shown after finishing Quick Hug or Hug Mode)
    hugCompletePrompts: [
        '{recipientName}, you did it. {dogName} is proud of you.',
        'One minute lighter. {dogName} hug delivered.',
        'If today is heavy, you don\'t have to carry it alone, {recipientName}. {dogName}\'s here.',
        'Well done, {recipientName}. {dogName} is so proud.',
        'You took the time. That matters, {recipientName}.',
        '{dogName} thinks you\'re amazing.',
        'One hug closer to feeling better.',
        'You showed up for yourself. {dogName} noticed.',
        '{recipientName}, you\'re stronger than you know.',
        'A moment of peace, delivered by {dogName}.',
        'You did what you needed. {dogName} loves you for it.',
        '{dogName} says: You\'re the best, {recipientName}.',
        'That was brave, {recipientName}.',
        'You deserve this softness.',
        '{dogName}\'s heart is full because of you.'
    ],

    // Notes from Anand (shown on completion screens)
    anandNotes: [
        '— Love you. I\'m with you. — Anand',
        '— You\'re incredible, Seema. — Anand',
        '— I see how hard you\'re working. — Anand',
        '— You make everything better. — Anand',
        '— I\'m so proud of you. — Anand',
        '— You light up our world. — Anand',
        '— Thank you for being you. — Anand',
        '— You\'re my favorite person. — Anand',
        '— We\'re all rooting for you. — Anand',
        '— You\'re amazing at this thing called life. — Anand',
        '— Take your time. We\'ve got this. — Anand',
        '— The kids and I love you so much. — Anand',
        '— You\'re doing a wonderful job. — Anand',
        '— Breathe, love. We\'re here. — Anand',
        '— You deserve all the good things. — Anand',
        '— Riya says you\'re the best mom. (I agree.) — Anand',
        '— Zahin drew you a picture today. He loves you. — Anand',
        '— Zubin asked about you. You\'re his hero. — Anand',
        '— You make our house a home. — Anand',
        '— I\'m grateful for you every day. — Anand',
        '— You\'re never alone, Seema. — Anand',
        '— Let\'s go for a walk when you get home. — Anand',
        '— The garden is waiting for you. — Anand',
        '— I made your favorite tea. Come home soon. — Anand',
        '— You and me. Always. — Anand',
        '— Riya wants to show you something. You\'ll love it. — Anand',
        '— The kids made dinner tonight. (It\'s... interesting.) — Anand',
        '— We miss you. Toasty especially. — Anand',
        '— You\'re the strongest person I know. — Anand',
        '— Let\'s dance in the kitchen later. — Anand'
    ],

    // Dance mode messages
    danceMessages: [
        'Ready to boogie, {recipientName}?',
        '{dogName} is doing the happy dance!',
        'Dance party with {dogName}!',
        'Shake it off with {dogName}!',
        '{recipientName} and {dogName}, dancing duo!',
        'Let\'s get those good vibes going!',
        '{dogName} says: More dancing, less worrying!',
        'Kitchen dance party, coming right up!',
        'You + {dogName} = Best dance team ever',
        'Wiggle wiggle wiggle! — {dogName}',
        '{recipientName}, you\'ve still got the moves!',
        'Dance like {dogName} is watching. (He is.)',
        'Shake those shoulders, {recipientName}!',
        '{dogName} tip: Dancing fixes everything.',
        'Riya would join this dance party!',
        'The kids would love this energy!',
        '{dogName}: Professional dance partner.'
    ],

    // Duration settings (in seconds)
    durations: {
        quickHugSeconds: 60,        // 1 minute for Quick Hug
        hugModeMaxSeconds: 120      // 2 minutes max for Hug Mode (can stop early)
    },

    // Feature toggles
    featureFlags: {
        enableSound: false,                 // Sound effects (currently not implemented)
        enableReduceMotionToggle: true      // Allow users to disable animations
    },

    // Level System - Gamification!
    // Levels unlock as you complete hugs. Each level requires more hugs than the last.
    levels: [
        { id: 1, name: 'Beginner Hugger', icon: '🌱', hugsRequired: 0, message: 'Welcome! Every hug counts.' },
        { id: 2, name: 'Cozy Cuddler', icon: '🌿', hugsRequired: 3, message: '{recipientName}, you\'re building a lovely habit!' },
        { id: 3, name: 'Warmth Seeker', icon: '🌻', hugsRequired: 7, message: '{dogName} notices you showing up for yourself!' },
        { id: 4, name: 'Mindful Hugger', icon: '🌳', hugsRequired: 15, message: 'Look at you, {recipientName}! This is amazing.' },
        { id: 5, name: 'Garden Friend', icon: '🌺', hugsRequired: 25, message: 'You and {dogName} are a great team!' },
        { id: 6, name: 'Peace Keeper', icon: '🦋', hugsRequired: 40, message: 'You\'re making space for yourself. Beautiful.' },
        { id: 7, name: 'Zen Master', icon: '🌸', hugsRequired: 60, message: '{recipientName}, you\'re an inspiration!' },
        { id: 8, name: 'Hug Champion', icon: '🏆', hugsRequired: 90, message: '{dogName} is so proud of you!' },
        { id: 9, name: 'Toasty\'s Best Friend', icon: '💖', hugsRequired: 130, message: 'You\'ve mastered the art of self-care!' },
        { id: 10, name: 'Legendary Hugger', icon: '⭐', hugsRequired: 180, message: '{recipientName}, you are absolutely legendary!' }
    ],

    // Level-up celebration messages (shown when advancing to a new level)
    levelUpMessages: [
        'Level up! {recipientName}, you\'re doing amazing!',
        'New level unlocked! {dogName} is doing a happy dance!',
        'You leveled up! Keep being wonderful!',
        'Achievement unlocked! You\'re incredible, {recipientName}!',
        '{dogName} says: "New level, new cuddles!"',
        'You did it! Next level reached!',
        '{recipientName}, you\'re on fire! Level up!'
    ]
};
