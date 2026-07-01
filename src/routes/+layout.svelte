<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/invader-green-black-eyes.png";

  let { children } = $props();
</script>

<svelte:head>
  <title>Space Invaders Audio Controller</title>
  <meta name="description" content="Interactive audio controller for Space Invaders game sound effects and music. Play, stop, and manage all game audio organized by game state." />
  <meta name="theme-color" content="#05060f" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="app-shell">
  {@render children()}
</div>

<style>
  .app-shell {
    position: relative;
    z-index: 1;
    min-height: 100vh;
  }
</style>
