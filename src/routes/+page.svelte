<script lang='ts'>
  import UserCard from "$lib/client/userCard.svelte";
  
  async function handleSubmit(e: Event) {
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    const url = '/api'
    const response = await fetch( url, {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData))
    })
    const clean = await response.json()

    console.log(clean)
  }

  const studentData = [
    {name: "Jonathan Lo", pfp: "72477459", gh: "jonathanlo411"},
    {name: "Elsie Wang", pfp: "78770687", gh: "e2wang"},
    {name: "Flynn O'Sullivan", pfp: "62868322", gh: "fosulliv"}
  ]
</script>

<svelte:head>
  <title>Auditing Sentiment Analysis Algorithms for Bias</title>
</svelte:head>

<div id='main'>
  <!-- Main Background Splash -->
  <div id='bg' class='flex'>
    <h1>Auditing Sentiment Analysis Algorithms for Bias</h1>
    <div class="custom-shape-divider-bottom-1708623245">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" class="shape-fill"></path>
      </svg>
  </div>
  </div>

  <!-- Student/Instructor Cards -->
  <div id='card-row' class='flex'>
    {#each studentData as cardInfo}
      <UserCard {...cardInfo} title='Student Researcher' />
    {/each}
  </div>
  <div class='flex'><UserCard
    name='Stuart Geiger'
    title='Mentor'
    pfp='4693439'
    gh='staeiou'
  /></div>

  <!-- Main Paper Content -->
  <section>
    <h2>Introduction</h2>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque fugit pariatur tenetur blanditiis temporibus molestiae in sit consectetur harum delectus dolorem perferendis velit quasi dicta aliquid recusandae voluptates sequi, explicabo, quia eaque deleniti sint maiores. Animi exercitationem, vitae error dignissimos fugit incidunt perspiciatis nostrum minima at quo distinctio inventore voluptate velit veritatis molestias, facere eos ea nemo in illum hic alias? Eum fuga voluptatibus ex neque, eius repudiandae, consequatur explicabo id dolor libero at maiores facilis deleniti! Consectetur fuga eveniet error reprehenderit, porro nobis voluptatum doloribus voluptatem quisquam, fugiat magni molestias illum nemo quibusdam eaque repellat autem temporibus alias at?</p>
  </section>

  <section>
    <h2>Data Review</h2>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque fugit pariatur tenetur blanditiis temporibus molestiae in sit consectetur harum delectus dolorem perferendis velit quasi dicta aliquid recusandae voluptates sequi, explicabo, quia eaque deleniti sint maiores. Animi exercitationem, vitae error dignissimos fugit incidunt perspiciatis nostrum minima at quo distinctio inventore voluptate velit veritatis molestias, facere eos ea nemo in illum hic alias? Eum fuga voluptatibus ex neque, eius repudiandae, consequatur explicabo id dolor libero at maiores facilis deleniti! Consectetur fuga eveniet error reprehenderit, porro nobis voluptatum doloribus voluptatem quisquam, fugiat magni molestias illum nemo quibusdam eaque repellat autem temporibus alias at?</p>
    <div class='flex subheading'>
      <img src='https://phil174.lojot.com/data/fig3.png' alt='alt text'>
      <span>Figure 3. Example subheading showing subheading</span>
    </div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos suscipit neque pariatur! Dolorem saepe repudiandae eaque, deleniti nobis dolor distinctio, harum animi eos commodi praesentium quod asperiores quae. Iste laudantium nostrum natus ex esse numquam perspiciatis voluptate, et aliquid inventore.</p>
  </section>

  <section>
    <h2>Methods</h2>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque fugit pariatur tenetur blanditiis temporibus molestiae in sit consectetur harum delectus dolorem perferendis velit quasi dicta aliquid recusandae voluptates sequi, explicabo, quia eaque deleniti sint maiores. Animi exercitationem, vitae error dignissimos fugit incidunt perspiciatis nostrum minima at quo distinctio inventore voluptate velit veritatis molestias, facere eos ea nemo in illum hic alias? Eum fuga voluptatibus ex neque, eius repudiandae, consequatur explicabo id dolor libero at maiores facilis deleniti! Consectetur fuga eveniet error reprehenderit, porro nobis voluptatum doloribus voluptatem quisquam, fugiat magni molestias illum nemo quibusdam eaque repellat autem temporibus alias at?</p>
  </section>

  <section>
    <h2>Discussion</h2>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque fugit pariatur tenetur blanditiis temporibus molestiae in sit consectetur harum delectus dolorem perferendis velit quasi dicta aliquid recusandae voluptates sequi, explicabo, quia eaque deleniti sint maiores. Animi exercitationem, vitae error dignissimos fugit incidunt perspiciatis nostrum minima at quo distinctio inventore voluptate velit veritatis molestias, facere eos ea nemo in illum hic alias? Eum fuga voluptatibus ex neque, eius repudiandae, consequatur explicabo id dolor libero at maiores facilis deleniti! Consectetur fuga eveniet error reprehenderit, porro nobis voluptatum doloribus voluptatem quisquam, fugiat magni molestias illum nemo quibusdam eaque repellat autem temporibus alias at?</p>
  </section>

  <!-- Demo/Try it yourself -->
  <section>
    <h2>Try it yourself!</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <span>Sentence</span>
      <input name='sentence' type='text'>
      <span>Swap</span>
      <input name='swap' type='text'>
      <button>Submit</button>
    </form>
  </section>
</div>

<style>
  /* Main Styles */
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  section {
    width: min(1500px, 90%);
    margin: 3em auto;
  }
  section h2 {
    font-size: 2rem;
    margin: 0.5rem 0;
  }
  section p {
    font-size: 1.1rem;
  }
  section .subheading {
    flex-direction: column;
    margin: 1rem;
  }
  section .subheading img {
    max-height: 450px;
    max-width: 90%;
    border-radius: 5px;
  }
  section .subheading span { 
    margin: 1rem;
    text-align: center;
    color: grey;
  }
  a, a:visited {
    color: var(--highlight);
  }

  /* Top Splash */
  #bg {
    height: 50vh;
    background-image: url('/imgs/splash.jpeg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    padding-bottom: 5vh;
    text-align: center;
  }
  #bg h1 {
    font-weight: bold;
    font-size: 4rem;
    text-shadow: 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000;
    margin: 5rem;
  }
  #card-row { margin-top: 4rem; justify-content: center !important; }
  .custom-shape-divider-bottom-1708623245 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    transform: rotate(180deg) translateY(-2px);
  }
  .custom-shape-divider-bottom-1708623245 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 4vw;
  }
  .custom-shape-divider-bottom-1708623245 .shape-fill {
    fill: var(--primary);
  }

  /* Demo */
  form {
    background-color: var(--secondary);
    padding: 1rem 2rem;
    width: 50%;
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    border: 1px solid var(--border);
    border-radius: 5px;
  }
  form span {
    font-size: 1.4rem;
    margin-top: 1rem;
  }
  form input, form input:focus {
    font-size: 1.2rem;
    padding: 1%;
    border-radius: 5px;
    outline: none;
  }
  form button {
    width: 100%;
    font-size: 1.2rem;
    padding: 1%;
    background-color: var(--highlight);
    color: var(--font-color);
    font-weight: bold;
    margin: 1rem auto;
    border: none;
    border-radius: 5px;
    transition: 0.25s;
  }
  form button:hover {
    background-color: var(--highlight-diff);
    cursor: pointer;
  }

  /* Mobile View */
  @media only screen and (max-width: 1000px) {
    /* Rework Main Styles */
    section h2 {
      font-size: 2.5rem;
      text-align: center;
    }
    section p {
      font-size: 1.2rem;
    }

    /* Rework Top Splash */
    #bg h1 {
      font-weight: bold;
      font-size: 3rem;
      text-shadow: 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000;
      margin: 1rem;
    }
    #card-row {
      flex-direction: column;
      margin-top: 1rem;
    }

    /* Demo */
    form {
      width: 100%;
      padding: 0.5rem 1rem;
    }
    form span { font-size: 1.6rem; }
    form input, form input:focus {
      font-size: 1.3rem;
      padding: 0.3rem;
    }
    form button {
      padding: 0.3rem;
      font-size: 1.5rem;
    }
  }
</style>