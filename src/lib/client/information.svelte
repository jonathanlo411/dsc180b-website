<script lang='ts'>
  export let hoverText: string = "Sample Hover Text";

  let shown = false;
  function toggleShow() {
    shown = !shown;
  }
</script>

<div id="main">
  <div
    id='info'
    on:mouseenter={toggleShow}
    on:mouseleave={toggleShow}
    aria-label="Toggle Popup"
    aria-roledescription="display popup"
    role="button"
    tabindex="0"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2z"/></svg>
  </div>
  {#if shown}
  <div id='popup'>
    {hoverText}
  </div>
  {/if}
</div>

<style>
  #main {
    position: relative;
  }

  /* Info */
  #info {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  
  /* Popup Styling */
  #popup {
    transition: 0.3s;
    position: absolute;
    top: 100%; 
    z-index: 1;
    background-color: var(--primary);
    border: 1px solid var(--border);
    padding: 0.5rem;
    display: inline-block; 
    width: 200px;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 10px;
  }
</style>
