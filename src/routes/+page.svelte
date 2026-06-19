<script lang="ts">
  import { onMount } from 'svelte';
  import { audioStore, categories } from '$lib/stores/audioStore.svelte';
  import MuteButton from '$lib/components/MuteButton.svelte';
  import CategorySection from '$lib/components/CategorySection.svelte';

  onMount(() => {
    audioStore.init();
  });

  // Gather entries for each category
  const categoryData = categories.map(cat => ({
    info: cat,
    entries: audioStore.getEntriesByCategory(cat.id),
  }));

  // Count currently playing sounds
  let activeCount = $derived(
    audioStore.audioEntries.filter(e => audioStore.isPlaying(e.id)).length
  );
</script>

<div class="page">
  <!-- Header -->
  <header class="header" id="page-header">
    <div class="header-inner">
      <div class="header-left">
        <div class="logo-group">
          <span class="logo-icon" aria-hidden="true">👾</span>
          <div class="logo-text">
            <h1 class="title">Audio Controller</h1>
            <p class="subtitle">Space Invaders Sound System</p>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="status-pill" class:has-active={activeCount > 0}>
          <span class="status-dot" class:is-active={activeCount > 0}></span>
          <span class="status-text">
            {#if activeCount > 0}
              {activeCount} PLAYING
            {:else}
              IDLE
            {/if}
          </span>
        </div>
        <button
          class="stop-all-btn"
          onclick={() => audioStore.stopAll()}
          id="stop-all-button"
          aria-label="Stop all audio"
          title="Stop all sounds"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
          STOP ALL
        </button>
        <MuteButton />
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main" id="main-content">
    <div class="content-wrapper">
      {#each categoryData as { info, entries }, i (info.id)}
        <div style="animation-delay: {i * 100}ms">
          <CategorySection categoryInfo={info} {entries} />
        </div>
      {/each}
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <p class="footer-text">
      <span class="footer-icon" aria-hidden="true">🔊</span>
      {audioStore.audioEntries.length} audio files · Click any card to play · Global mute available
    </p>
  </footer>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* --- Header --- */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);
    background: rgba(5, 6, 15, 0.8);
    border-bottom: 1px solid var(--border-subtle);
  }

  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-md) var(--space-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .logo-group {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .logo-icon {
    font-size: 1.8rem;
    line-height: 1;
    animation: icon-pop 2s ease-in-out infinite;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 1.15rem;
    font-weight: 800;
    background: linear-gradient(135deg, #a855f7, #6366f1, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.03em;
  }

  .subtitle {
    font-size: 0.65rem;
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  /* --- Status Pill --- */
  .status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    transition: all var(--transition-base);
  }

  .status-pill.has-active {
    border-color: rgba(16, 185, 129, 0.4);
    color: #10b981;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-muted);
    transition: all var(--transition-base);
  }

  .status-dot.is-active {
    background: #10b981;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
    animation: glow-pulse 1.5s ease-in-out infinite;
    --glow-color: rgba(16, 185, 129, 0.4);
  }

  .status-text {
    white-space: nowrap;
  }

  /* --- Stop All Button --- */
  .stop-all-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: var(--space-sm) var(--space-md);
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: var(--radius-full);
    cursor: pointer;
    color: rgba(239, 68, 68, 0.8);
    font-family: 'Orbitron', sans-serif;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    transition: all var(--transition-base);
    -webkit-tap-highlight-color: transparent;
  }

  .stop-all-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.5);
    color: #ef4444;
    box-shadow: 0 0 16px rgba(239, 68, 68, 0.15);
    transform: translateY(-1px);
  }

  .stop-all-btn:active {
    transform: scale(0.96);
  }

  /* --- Main --- */
  .main {
    flex: 1;
    padding: var(--space-xl) var(--space-lg);
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  /* --- Footer --- */
  .footer {
    padding: var(--space-lg);
    text-align: center;
    border-top: 1px solid var(--border-subtle);
  }

  .footer-text {
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  .footer-icon {
    font-size: 0.85rem;
  }

  /* --- Responsive --- */
  @media (max-width: 640px) {
    .header-inner {
      padding: var(--space-sm) var(--space-md);
    }

    .title {
      font-size: 0.95rem;
    }

    .main {
      padding: var(--space-md) var(--space-sm);
    }

    .status-pill {
      display: none;
    }

    .logo-icon {
      font-size: 1.4rem;
    }
  }
</style>
