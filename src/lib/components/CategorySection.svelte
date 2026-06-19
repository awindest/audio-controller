<script lang="ts">
  import { audioStore, type CategoryInfo, type AudioEntry } from '$lib/stores/audioStore.svelte';
  import AudioCard from './AudioCard.svelte';

  interface Props {
    categoryInfo: CategoryInfo;
    entries: AudioEntry[];
  }

  let { categoryInfo, entries }: Props = $props();

  let collapsed = $state(false);

  // Check if any sound in this category is playing
  let anyPlaying = $derived(entries.some(e => audioStore.isPlaying(e.id)));
</script>

<section
  class="category-section"
  style="--cat-color: {categoryInfo.color}; --cat-glow: {categoryInfo.glowColor}"
  id="category-{categoryInfo.id}"
>
  <button
    class="category-header"
    class:has-active={anyPlaying}
    onclick={() => collapsed = !collapsed}
    aria-expanded={!collapsed}
    aria-controls="category-content-{categoryInfo.id}"
  >
    <div class="category-left">
      <span class="category-icon" aria-hidden="true">{categoryInfo.icon}</span>
      <h2 class="category-label">{categoryInfo.label}</h2>
      <span class="category-count">{entries.length}</span>
    </div>
    <div class="category-right">
      {#if anyPlaying}
        <span class="active-indicator" aria-label="Audio playing in this category">
          <span class="active-dot"></span>
          ACTIVE
        </span>
      {/if}
      <svg
        class="chevron"
        class:is-collapsed={collapsed}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  </button>

  {#if !collapsed}
    <div
      class="category-content"
      id="category-content-{categoryInfo.id}"
    >
      <div class="cards-grid">
        {#each entries as entry, i (entry.id)}
          <AudioCard {entry} {categoryInfo} index={i} />
        {/each}
      </div>
    </div>
  {/if}
</section>

<style>
  .category-section {
    animation: slide-up 500ms cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--space-md) var(--space-lg);
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    color: var(--text-primary);
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  .category-header:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: var(--cat-color);
    box-shadow: 0 0 16px var(--cat-glow);
  }

  .category-header.has-active {
    border-color: var(--cat-color);
    background: rgba(255, 255, 255, 0.03);
  }

  .category-left {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .category-icon {
    font-size: 1.3rem;
    line-height: 1;
  }

  .category-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--cat-color);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .category-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-muted);
    border: 1px solid var(--border-subtle);
  }

  .category-right {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .active-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--cat-color);
    letter-spacing: 0.1em;
  }

  .active-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--cat-color);
    animation: glow-pulse 1.5s ease-in-out infinite;
    --glow-color: var(--cat-glow);
    box-shadow: 0 0 8px var(--cat-glow);
  }

  .chevron {
    color: var(--text-muted);
    transition: transform var(--transition-base), color var(--transition-base);
  }

  .chevron.is-collapsed {
    transform: rotate(-90deg);
  }

  .category-header:hover .chevron {
    color: var(--cat-color);
  }

  /* --- Content --- */
  .category-content {
    padding: var(--space-md) 0 0 0;
    animation: fade-in 300ms ease-out;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-sm);
  }

  @media (max-width: 640px) {
    .cards-grid {
      grid-template-columns: 1fr;
    }

    .category-header {
      padding: var(--space-sm) var(--space-md);
    }

    .category-label {
      font-size: 0.78rem;
    }
  }
</style>
