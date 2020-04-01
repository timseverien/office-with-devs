import 'https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.3/howler.min.js';

function createSound(file) {
    const howl = new Howl({
        src: [file],
        pool: 1,
    });
    
    return  {
        isPlaying() {
            return howl.playing();
        },

        play() {
            return howl.play();
        },

        setVolume(volume) {
            return howl.volume(volume);
        },
    };
}

function createSounds(list, options = {}) {
    const sounds = list.map(file => createSound(file));
    let scheduleCount = 0;

    const optionParallel = options.parallel || 1;

    return {
        play() {
            const index = Math.floor(Math.random() * sounds.length);
            const volume = lerp(options.volume[0], options.volume[1], Math.random());
            
            sounds[index].setVolume(volume);
            sounds[index].play();
        },

        isPlaying() {
            return (scheduleCount + this.getPlayCount()) >= Math.min(sounds.length, optionParallel);
        },

        schedule() {
            const delay = 1000 * lerp(options.delay[0], options.delay[1], Math.random());

            setTimeout(() => {
                scheduleCount--;
                this.play();
            }, delay);

            scheduleCount++;
        },

        trySchedule() {
            if (this.isPlaying()) {
                return;
            }

            this.schedule();
        },

        getPlayCount() {
            return sounds.reduce((count, s) => count + (s.isPlaying() ? 1 : 0), 0);
        },
    };
}

function lerp(a, b, t = 0) {
    return a + t * (b - a);
}

const sounds = {
    keyboard: createSounds([
        'assets/audio/Keyboard mechanical 1.mp3',
        'assets/audio/Keyboard mechanical 2.mp3',
        'assets/audio/Keyboard mechanical 3.mp3',
    ], {
        delay: [1, 5],
        parallel: 2,
        volume: [0.01, 0.2],
    }),

    mouse: createSounds([
        'assets/audio/Mouse click regular 1.mp3',
        'assets/audio/Mouse click regular 2.mp3',
        'assets/audio/Mouse click right 1.mp3',
        'assets/audio/Mouse click right 2.mp3',
    ], {
        delay: [2, 5],
        volume: [0.01, 0.1],
    }),

    people: createSounds([
        'assets/audio/Sigh 1.mp3',
        'assets/audio/Sigh 2.mp3',
    ], {
        delay: [10, 15],
        volume: [0.01, 0.05],
    }),

    peopleActions: createSounds([
        'assets/audio/Pen fidgiting 1.mp3',
    ], {
        delay: [10, 15],
        volume: [0.05, 0.1],
    }),
};

const buttonStart = document.getElementById('button-start');
const elementDebug = document.getElementById('debug');

buttonStart.addEventListener('click', () => {
    buttonStart.hidden = true;

    setInterval(() => {
        sounds.keyboard.trySchedule();
        sounds.mouse.trySchedule();
        sounds.people.trySchedule();
        sounds.peopleActions.trySchedule();

        elementDebug.innerText = `keyboard
  count: ${sounds.keyboard.getPlayCount()}
mouse
  count: ${sounds.mouse.getPlayCount()}
people
  count: ${sounds.people.getPlayCount()}
people actions
  count: ${sounds.peopleActions.getPlayCount()}`;
    }, 250);
}, { once: true });