import { Howl, Howler } from 'howler';

// --- Types ---
export type Category = 'music' | 'gamestate' | 'player' | 'enemies' | 'special' | 'ui';

export interface AudioEntry {
  id: string;
  name: string;
  file: string;
  category: Category;
  loop: boolean;
  description: string;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
  color: string;
  glowColor: string;
}

// --- Category Metadata ---
export const categories: CategoryInfo[] = [
  { id: 'music', label: 'Music', icon: '🎵', color: 'var(--color-music)', glowColor: 'var(--color-music-glow)' },
  { id: 'gamestate', label: 'Game State', icon: '🕹️', color: 'var(--color-gamestate)', glowColor: 'var(--color-gamestate-glow)' },
  { id: 'player', label: 'Player Actions', icon: '🚀', color: 'var(--color-player)', glowColor: 'var(--color-player-glow)' },
  { id: 'enemies', label: 'Enemies', icon: '👾', color: 'var(--color-enemies)', glowColor: 'var(--color-enemies-glow)' },
  { id: 'special', label: 'Special', icon: '✨', color: 'var(--color-special)', glowColor: 'var(--color-special-glow)' },
  { id: 'ui', label: 'UI', icon: '🎮', color: 'var(--color-ui)', glowColor: 'var(--color-ui-glow)' },
];

// --- Audio Registry ---
export const audioEntries: AudioEntry[] = [
  // Music
  { id: 'background-music', name: 'Background Music', file: '/audio/BackgroundMusic.wav', category: 'music', loop: true, description: 'Looping background track during gameplay' },
  // Game State
  { id: 'game-over', name: 'Game Over', file: '/audio/GameOver.mp3', category: 'gamestate', loop: false, description: 'Plays when the player loses all lives' },
  { id: 'start', name: 'Start', file: '/audio/start.mp3', category: 'gamestate', loop: false, description: 'Game start trigger sound' },
  { id: 'insert-coin', name: 'Insert Coin', file: '/audio/insert-coin-fx_C_major.wav', category: 'gamestate', loop: false, description: 'Attract screen / title screen coin insert' },
  // Player Actions
  { id: 'player-missile', name: 'Player Missile', file: '/audio/PlayerMissile.wav', category: 'player', loop: false, description: 'Fired when the player shoots' },
  { id: 'player-explosion', name: 'Player Explosion', file: '/audio/PlayerExplosion.wav', category: 'player', loop: false, description: 'Player ship destroyed' },
  { id: 'shoot', name: 'Shoot', file: '/audio/shoot.wav', category: 'player', loop: false, description: 'Alternate shooting sound effect' },
  // Enemies
  { id: 'invader-shoot', name: 'Invader Shoot', file: '/audio/InvaderShoot.wav', category: 'enemies', loop: false, description: 'Invader fires a projectile' },
  { id: 'invader-walk', name: 'Invader Walk', file: '/audio/InvaderWalk.wav', category: 'enemies', loop: false, description: 'Step/march tick as invaders move' },
  { id: 'explode', name: 'Explode', file: '/audio/explode.wav', category: 'enemies', loop: false, description: 'Invader destroyed explosion' },
  { id: 'bomb', name: 'Bomb', file: '/audio/bomb.mp3', category: 'enemies', loop: false, description: 'Bomb drop or impact' },
  // Special
  { id: 'spaceship', name: 'Spaceship', file: '/audio/Spaceship.wav', category: 'special', loop: false, description: 'Mystery ship / UFO flyby' },
  { id: 'bonus', name: 'Bonus', file: '/audio/bonus.mp3', category: 'special', loop: false, description: 'Bonus item collected' },
  // UI
  { id: 'select', name: 'Select', file: '/audio/select.mp3', category: 'ui', loop: false, description: 'Menu selection / button press' },
];

// --- Store ---
function createAudioStore() {
  let muted = $state(false);
  let playingStates = $state<Record<string, boolean>>({});
  let howls: Record<string, Howl> = {};

  // Initialize Howl instances
  function init() {
    for (const entry of audioEntries) {
      const howl = new Howl({
        src: [entry.file],
        loop: entry.loop,
        volume: entry.id === 'background-music' ? 0.4 : 0.7,
        preload: true,
        onplay: () => {
          playingStates = { ...playingStates, [entry.id]: true };
        },
        onend: () => {
          if (!entry.loop) {
            playingStates = { ...playingStates, [entry.id]: false };
          }
        },
        onstop: () => {
          playingStates = { ...playingStates, [entry.id]: false };
        },
        onpause: () => {
          playingStates = { ...playingStates, [entry.id]: false };
        },
      });
      howls[entry.id] = howl;
    }
  }

  function play(id: string) {
    const howl = howls[id];
    if (!howl) return;
    // If already playing, stop first (restart)
    if (howl.playing()) {
      howl.stop();
    }
    howl.play();
  }

  function stop(id: string) {
    const howl = howls[id];
    if (!howl) return;
    howl.stop();
  }

  function stopAll() {
    for (const id of Object.keys(howls)) {
      howls[id].stop();
    }
  }

  function toggleMute() {
    muted = !muted;
    Howler.mute(muted);
  }

  function isPlaying(id: string): boolean {
    return playingStates[id] ?? false;
  }

  function getEntriesByCategory(category: Category): AudioEntry[] {
    return audioEntries.filter(e => e.category === category);
  }

  function getCategoryInfo(category: Category): CategoryInfo | undefined {
    return categories.find(c => c.id === category);
  }

  return {
    get muted() { return muted; },
    get playingStates() { return playingStates; },
    init,
    play,
    stop,
    stopAll,
    toggleMute,
    isPlaying,
    getEntriesByCategory,
    getCategoryInfo,
    categories,
    audioEntries,
  };
}

export const audioStore = createAudioStore();
