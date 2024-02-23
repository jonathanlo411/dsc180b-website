<script lang='ts'>
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme'; 

  // Subscribe to theme updates
  onMount(() => {
    theme.subscribe(({ current }) => {
      if (typeof document !== 'undefined') { // Check if document is defined
        const root = document.documentElement;
        if (current === 'dark') {
          root.style.setProperty('--primary', '#2a2729');
          root.style.setProperty('--secondary', '#302c2e');
          root.style.setProperty('--border', 'rgb(55,52,59)');
          root.style.setProperty('--highlight', 'rgb(212, 107, 169)');
          root.style.setProperty('--highlight-diff', 'rgb(185, 95, 149)');
          root.style.setProperty('--fastest', 'rgb(174, 62, 201)');
          root.style.setProperty('--font-color', 'white');
          root.style.setProperty('--subdued', 'rgb(101, 93, 98)');
        } else {
          root.style.setProperty('--primary', '#ffffff');
          root.style.setProperty('--secondary', 'hsl(325, 55%, 97%');
          root.style.setProperty('--border', 'rgb(55,52,59)');
          root.style.setProperty('--highlight', 'rgb(212, 107, 169)');
          root.style.setProperty('--highlight-diff', 'rgb(185, 95, 149)');
          root.style.setProperty('--fastest', 'rgb(174, 62, 201)');
          root.style.setProperty('--font-color', 'black'); // Change this if needed
          root.style.setProperty('--subdued', 'rgb(101, 93, 98)');
        }
      }
    });
  });

</script>
<div id="base">
  <slot></slot>
</div>

<style>
  /* General Styling */
  @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
  :global(*) {
    box-sizing: border-box;
    margin: 0;
  }

  /* Site wide scrollbars */
  :global(::-webkit-scrollbar) {
    height: 0.3rem;
    width: 0.3rem;
  }
  :global(::-webkit-scrollbar-track) {
    background: none;
  }

  /* Handle */
  :global(::-webkit-scrollbar-thumb) {
    border-radius: 100px;
    background-color: #ccc;
    transition: 0.2s;
  }

  /* Handle on hover */
  :global(::-webkit-scrollbar-thumb:hover) {
    background: #b4b4b4;
  }

  /* General Styling */
  :global(body) {
    font-family: 'Montserrat';
    color: var(--font-color);
    background-color: var(--primary);
    transition: 0.3s;
  }
</style>
