<script lang="ts">
  import { audioStore } from '$lib/stores/audioStore.svelte';

  let muted = $derived(audioStore.muted);
</script>

<button
  class="mute-button"
  class:is-muted={muted}
  onclick={() => audioStore.toggleMute()}
  id="mute-toggle"
  aria-label={muted ? 'Unmute all audio' : 'Mute all audio'}
  title={muted ? 'Unmute' : 'Mute'}
>
  <div class="mute-icon-wrapper">
    {#if muted}
      <!-- Muted icon -->
      <svg class="mute-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    {:else}
      <!-- Unmuted icon -->
      <svg class="mute-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    {/if}
  </div>
  <span class="mute-label">{muted ? 'MUTED' : 'SOUND ON'}</span>
</button>

<style>
  .mute-button {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-accent);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition-base);
    color: var(--text-primary);
    font-family: 'Orbitron', sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  .mute-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--color-ui);
    box-shadow: 0 0 16px var(--color-ui-glow);
    transform: translateY(-1px);
  }

  .mute-button:active {
    transform: scale(0.96);
  }

  .mute-button.is-muted {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.4);
  }

  .mute-button.is-muted:hover {
    background: rgba(239, 68, 68, 0.15);
    box-shadow: 0 0 16px rgba(239, 68, 68, 0.2);
  }

  .mute-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
  }

  .mute-icon {
    transition: color var(--transition-base);
  }

  .mute-button.is-muted .mute-icon {
    color: #ef4444;
  }

  .mute-label {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    white-space: nowrap;
  }

  .mute-button.is-muted .mute-label {
    color: #ef4444;
  }
</style>
