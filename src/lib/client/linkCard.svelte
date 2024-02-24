<script lang='ts'>
  export let title: string = 'Sample Title';
  export let link: string = 'Sample Link';
  
  const shortLink: string = link.replace('https://', '')
</script>

<a href="{link}" target="_blank" rel="norefferer">
  <h1>{title}</h1>
  <span>{shortLink}</span>
</a>

<style>
  a, a:visited {
    background-color: var(--secondary);
    border: 1px solid var(--border);
    padding: 1rem;
    margin: 0.5rem;
    text-decoration: none;
    color: var(--font);
    text-align: center;
    transition: 0.3s;
    border-radius: 5px;
  }
  a:hover {
    background-color: var(--primary);
    cursor: pointer;
  }

  h1 {
    font-size: 1rem;
  }
  span {
    color: var(--highlight);
    font-size: 0.8rem;
  }
</style>