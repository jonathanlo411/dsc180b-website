<script lang='ts'>
  export let name: string;
  export let title: string;
  export let gh: string;
  export let pfp: string;
</script>

<a href="https://github.com/{gh}" target="_blank" rel='norefferer'>
  <div id='pfp'><img src="https://avatars.githubusercontent.com/u/{pfp}" alt='{name} pfp'></div>
  <div id='desc'>
    <h1>{name}</h1>
    <span>{title}</span>
  </div>
</a>

<style>
  a, a:visited {
    color: var(--font-color);
    text-decoration: none;
    background-color: var(--secondary);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 1em 2em;
    border-radius: 8px;
    border: 1px solid var(--border);
    width: min(400px, 30%);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 10px;
    transition: 0.25s;
  }
  a:hover {
    box-shadow: rgba(0, 0, 0, 0.445) 0px 10px 18px;
  }

  #pfp {
    border-radius: 1000px;
    overflow: hidden;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
  }
  #pfp img {
    height: 5rem;
    width: auto;
  }

  #desc {
    text-align: center;
  }
  #desc h1 {
    font-size: 1.5rem;
  }
  #desc span {
    font-weight: bold;
    color: grey;
  }

  /* Mobile */
  @media only screen and (max-width: 1000px) {
    a, a:visited {
      width: 95%;
      margin: 0.5em auto;
    }
  }
</style>