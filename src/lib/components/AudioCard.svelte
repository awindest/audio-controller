<script lang="ts">
  import { audioStore, type AudioEntry, type CategoryInfo } from '$lib/stores/audioStore.svelte';

  interface Props {
    entry: AudioEntry;
    categoryInfo: CategoryInfo;
    index: number;
  }

  let { entry, categoryInfo, index }: Props = $props();

  let playing = $derived(audioStore.isPlaying(entry.id));

  function handleToggle() {
    if (playing) {
      audioStore.stop(entry.id);
    } else {
      audioStore.play(entry.id);
    }
  }

  // Get file extension for badge
  const ext = entry.file.split('.').pop()?.toUpperCase() ?? '';
</script>

<button
  class="audio-card"
  class:is-playing={playing}
  style="--accent: {categoryInfo.color}; --glow: {categoryInfo.glowColor}; animation-delay: {index * 60}ms"
  onclick={handleToggle}
  id="audio-card-{entry.id}"
  aria-label="{playing ? 'Stop' : 'Play'} {entry.name}"
>
  <!-- Play/Stop indicator -->
  <div class="card-indicator">
    {#if playing}
      <div class="waveform" aria-hidden="true">
        <span class="bar" style="--i: 0"></span>
        <span class="bar" style="--i: 1"></span>
        <span class="bar" style="--i: 2"></span>
        <span class="bar" style="--i: 3"></span>
        <span class="bar" style="--i: 4"></span>
      </div>
    {:else}
      <svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M8 5.14v14.72a1 1 0 0 0 1.5.86l11.14-7.36a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" fill="currentColor"/>
      </svg>
    {/if}
  </div>

  <!-- Content -->
  <div class="card-content">
    <div class="card-header">
      <h3 class="card-title">{entry.name}</h3>
      <div class="card-badges">
        {#if entry.loop}
          <span class="badge badge-loop">LOOP</span>
        {/if}
        <span class="badge badge-format">{ext}</span>
      </div>
    </div>
    <p class="card-description">{entry.description}</p>
  </div>

  <!-- Playing glow ring -->
  {#if playing}
    <div class="glow-ring" aria-hidden="true"></div>
  {/if}
</button>

<style>
  .audio-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background var(--transition-base),
      border-color var(--transition-base),
      transform var(--transition-fast),
      box-shadow var(--transition-base);
    animation: slide-up 500ms cubic-bezier(0.4, 0, 0.2, 1) both;
    animation-delay: var(--delay, 0ms);
    overflow: hidden;
    text-align: left;
    width: 100%;
    font-family: inherit;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  .audio-card:hover {
    background: var(--bg-card-hover);
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-card), 0 0 20px var(--glow);
  }

  .audio-card:active {
    transform: translateY(0px) scale(0.98);
  }

  .audio-card.is-playing {
    border-color: var(--accent);
    box-shadow: var(--shadow-card), 0 0 24px var(--glow);
    background: var(--bg-card-hover);
  }

  /* --- Indicator --- */
  .card-indicator {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    transition: all var(--transition-base);
  }

  .audio-card:hover .card-indicator,
  .audio-card.is-playing .card-indicator {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--accent);
  }

  .play-icon {
    color: var(--text-secondary);
    transition: color var(--transition-base), transform var(--transition-fast);
  }

  .audio-card:hover .play-icon {
    color: var(--accent);
    transform: scale(1.1);
  }

  /* --- Waveform --- */
  .waveform {
    display: flex;
    align-items: center;
    gap: 3px;
    height: 24px;
  }

  .bar {
    display: block;
    width: 3px;
    height: 4px;
    background: var(--accent);
    border-radius: var(--radius-full);
    animation: waveform 0.6s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.1s);
    --wave-height: 20px;
  }

  .bar:nth-child(1) { --wave-height: 14px; }
  .bar:nth-child(2) { --wave-height: 22px; }
  .bar:nth-child(3) { --wave-height: 18px; }
  .bar:nth-child(4) { --wave-height: 24px; }
  .bar:nth-child(5) { --wave-height: 12px; }

  /* --- Content --- */
  .card-content {
    flex: 1;
    min-width: 0;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .card-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 0.03em;
    transition: color var(--transition-base);
  }

  .audio-card:hover .card-title,
  .audio-card.is-playing .card-title {
    color: var(--accent);
  }

  .card-badges {
    display: flex;
    gap: var(--space-xs);
  }

  .badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .badge-format {
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-muted);
    border: 1px solid var(--border-subtle);
  }

  .badge-loop {
    background: rgba(168, 85, 247, 0.15);
    color: var(--color-music);
    border: 1px solid rgba(168, 85, 247, 0.3);
  }

  .card-description {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 4px;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* --- Glow ring animation --- */
  .glow-ring {
    position: absolute;
    inset: -2px;
    border-radius: var(--radius-md);
    border: 2px solid var(--accent);
    opacity: 0;
    animation: glow-pulse 2s ease-in-out infinite;
    pointer-events: none;
  }
</style>
