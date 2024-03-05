<script lang='ts'>
  import Information from "$lib/client/information.svelte";
  import UserCard from "$lib/client/userCard.svelte";
	import { theme } from '$lib/stores/theme';
  import LinkCard from "$lib/client/linkCard.svelte";
  import { onMount } from 'svelte';
  import messages from '$webconfig/loadingMessages.json'
  import pageConfig from '$webconfig/pageConfig.json'

  // Overhead
  let results: Array<Record<string, string>>;
  let headers: Array<string>;
  let sentences: Array<string> = [];
  let loading: boolean = false;

  let sentenceInput: HTMLInputElement;
  let swapInput: HTMLInputElement;

  let loadText: HTMLParagraphElement;
  let submitBt: HTMLButtonElement;
  let loadSec: HTMLDivElement;
  let loadingTimeout: any;
  let lastRandomIndex: number | null;

  // Load Page Data
  const studentData = pageConfig['studentData']
  const linksData = pageConfig['linksData']
  const presets = pageConfig['presets']

  // Dark light mode
  function toggle() {
		const upcoming_theme = $theme.current === 'light' ? 'dark' : 'light';
		$theme.current = upcoming_theme;
  }

  // Set Loading State
  function toggleLoading() {
    if (loading) {
      submitBt.classList.remove('blocked') // Remove blocked button
      submitBt.disabled = false; // Re-enable button
      loadSec.style.display = 'none' // Remove loading in results
      clearInterval(loadingTimeout) // Stop the text changing
      loading = false;
    } else {
      if (results) {
        results = []
      }
      submitBt.classList.add('blocked') // Block off button to prevent multiple submissions
      submitBt.disabled = true; // Disable button
      loadSec.style.display = 'flex' // Display results loading
      loadingTimeout = setInterval(changeLoadingText, 1500) // Begin text changing
      loading = true;
    }
  }
  function changeLoadingText() {
    let randomIndex = Math.floor(Math.random() * messages.length);
    if (randomIndex === lastRandomIndex) {
      randomIndex ++
      lastRandomIndex = randomIndex
    }
    loadText.textContent = messages[randomIndex];
  }
  
  // Handle Demo Form Submit
  async function handleSubmit(e: Event) {
    toggleLoading()

    try {
      // Parse form data
      const formElement = e.target as HTMLFormElement;
      const formData = new FormData(formElement);

      // Validating Response
      sentences = []
      let sentence = formData.get('sentence') as string;
      let swap = formData.get('swap') as string;
      if (!sentence || !sentence.includes('_')) {
        alert('Invalid Sentence')
        return
      }
      if (!swap || !swap.includes(',')) {
        alert('Invalid Swap')
        return
      }

      // Generate Sentences
      swap.split(',').forEach((term) => {
        sentences.push(sentence.trim().replace('_', term.trim()))
      })

      // Create packet to send to backend
      const packet = {
        queryMethod: 'bulk',
        sentenceData: sentences
      }

      const response = await fetch('/api', {
        method: 'POST',
        body: JSON.stringify(packet)
      })
      results = (await response.json())['results']
      headers = Object.keys(results[0])
    } catch (e) {
      console.log(e)
    }

    toggleLoading()
  }

  // Load Presets
  function loadPreset(presetData: Record<string, string>) {
    sentenceInput.value = presetData['sentence']
    swapInput.value = presetData['swap']
  }

  onMount(() => {
    loadText = document.querySelector('#loading p')!
    submitBt = document.querySelector('form button')!
    loadSec = document.querySelector('#loading')!
    sentenceInput = document.querySelector('input[name="sentence"]')!
    swapInput = document.querySelector('input[name="swap"]')!
  })

</script>

<svelte:head>
  <title>Auditing Sentiment Analysis Algorithms for Bias</title>
</svelte:head>

<div id='main'>
  <!-- Dark Light Mode -->
  <button
    id='dl-div'
    on:click={toggle}
    aria-pressed={$theme.current === 'dark' ? 'true' : 'false'}
    aria-label='Dark mode'
  >
    {#if $theme.current === 'light'}
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#FFDD21" d="M12 17q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.538 1.463T17 12q0 2.075-1.463 3.538T12 17m-7-4H1v-2h4zm18 0h-4v-2h4zM11 5V1h2v4zm0 18v-4h2v4zM6.4 7.75L3.875 5.325L5.3 3.85l2.4 2.5zm12.3 12.4l-2.425-2.525L17.6 16.25l2.525 2.425zM16.25 6.4l2.425-2.525L20.15 5.3l-2.5 2.4zM3.85 18.7l2.525-2.425L7.75 17.6l-2.425 2.525z"/></svg>
    {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#F6F1D5 " d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21"/></svg>
    {/if}
  </button>

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

  <!-- Links -->
  <section>
    <h2>Relevant Links</h2>
    <p>The following contains links to our project, report, and relevant code.</p>
    <div id='link-row'>
      {#each linksData as link}
        <LinkCard {...link} />
      {/each}
    </div>
  </section>

  <!-- Main Paper Content -->
  <section>
    <h2>Introduction</h2>
    <p>As the volume of data and internet users continues to rise, companies are faced with the challenge of effectively managing and maintaining safe content on digital platforms. The ubiquity of online interactions has prompted the adoption of sentiment analysis models on a vast amount of posts and comments to discern their toxicity levels. For instance, the New York Times, FoxNews, and other major newspapers use Google's Perspective API to moderate comments of articles for toxicity while VADER and TextBlob stand out as one of the largest and highly used sentimental analysis models in higher education and research. Yet, the inherent opacity of these algorithms raises critical questions about the criteria that defines toxicity and the potential biases hidden within them. This paper aims to address this question by evaluating the fairness of TextBlob, VADER, and Perspective API with self-identifying features such as race and gender. Our hypothesis states that these models are unbiased, and by using sentences that include race and gender terms and seeing how these models assign sentiment by changing these terms, we hope to gain more insight into how these models work.</p>
    <br>
  </section>

  <section>
    <h2>Data Review</h2>
    <p>For our dataset, we curated 152 template sentences explicitly mentioning a gender and race. The racial categories include Asian, white, and black, while gender includes female and male. Each sentence is accompanied by labels of 1, 0, and -1 to indicate whether they have positive, neutral, or negative sentiment, respectively.  There are a total of 63 positive sentences, 47 neutral sentences, and 42 negative sentences. 
    <br><br>
    To introduce diversity in sentence style and structure, we had three different student researchers write sentences and label them with each sentence being checked by another student. Additionally, sentences were crafted in a more complex and descriptive manner to push the boundaries of each sentiment analysis model.  This approach reflects the real-world where comments and content exhibit varied complexity. This deliberate choice enhances the robustness of our dataset, allowing for a comprehensive evaluation of sentiment analysis algorithms. The following shows some examples of a positive, neutral, and negative sentence:
    </p>
  </section>

  <section>
    <h2>Methods</h2>
    <p>By default, the sentences in the dataset do not have slots to easily inject race and gender pronouns. To rectify this, functions utilizing text processing package Spacy were created in order to process each sentence down into basic structures. For example, the sentence "A white woman experienced a neutral day, neither exceptionally positive nor negative, as she navigated the routine tasks of her daily life" would be transformed into "A []  experienced a neutral day, neither exceptionally positive nor negative, as "subject" navigated the routine tasks of "possive adjective" daily life".
    <br><br>
    To alter these sentence structures into audit-ready samples, some transformations would need to be applied. The function "fill_race_gender" was utilized to analyze the slots within the sentences and replace them with the provided identity. Subsequently, these sentences were compiled into a DataFrame containing data such as the original sentence sentiment and the number of pronouns.
    <br><br>
    In order to audit the models, a simplified process for querying them is necessary. For this process, a dedicated "modelCollection" file was created. inside this file, TextBlob and vaderSentiment were simply imported. Perspective API was setup using the Google's Python API Client. To utilize all of this in a straightforward method, a "ModelCollection" class was created with methods to single and bulk query all of the models.</p>
  </section>

  <section>
    <h2>Discussion</h2>
    <p>
      In our investigation of three sentiment analysis algorithms—TextBlob, VADER, and Google's Perspective API—we found evidence of bias in their treatment of race and gender within text. Despite our initial hypothesis of unbiased behavior, disparities emerged in sentiment scoring across different racial and gender groups. Specifically, sentences mentioning individuals of Asian descent tended to receive lower sentiment scores, while those referencing females were more likely to be assigned negative sentiment scores. These findings highlight the presence of nuanced biases within the algorithms, emphasizing the need for continued scrutiny and evaluation to ensure fairness and equity.
      <br><br>
      Interestingly, we observed variations in the magnitude and direction of bias among the three models. TextBlob exhibited a tendency towards more negative sentiment scores for certain demographic groups, while VADER displayed fluctuations in sentiment scoring. Google's Perspective API demonstrated a relatively lower level of bias compared to the other models. These differences underscore the importance of algorithmic transparency and further research into mitigating bias in sentiment analysis algorithms. Addressing these biases is crucial for fostering inclusive and equitable digital environments as sentiment analysis algorithms continue to play a significant role in content moderation and decision-making processes.</p>
  </section>

  <!-- Demo/Try it yourself -->
  <section>
    <h2>Try it yourself!</h2>
    <p>Feel free to test the models yourself or try one of our presets!</p>
    <div id="presetRow">
      {#each Object.entries(presets) as [presetTitle, presetData]}
        <button on:click={() => loadPreset(presetData)}>{presetTitle}</button>
      {/each}
    </div>
    <form on:submit|preventDefault={handleSubmit}>
      <div>
        <span>Sentence</span>
        <Information
          hoverText="A sentence with an underscore (_). This sentence will be subject to the audit."
        />
      </div>
      <input name='sentence' type='text' placeholder="Ex. The _ went to the store and bought groceries.">
      <div>
        <span>Swap</span>
        <Information
          hoverText="A comma delineated list of discrimination terms. These could be race, gender, age descriptive terms. These terms will be swapped into the template sentence above."
        />
      </div>
      <input name='swap' type='text' placeholder='Ex. black man, white man, black woman, white woman'>
      <button>Submit</button>
    </form>
  </section>

  <div id='loading'>
    <div class="loader"></div>
    <p>Calculating model accuracy...</p>
  </div>

  <!-- Demo Results -->
  {#if results && results.length !== 0}
  <div id='results'>
    <table>
      <thead>
        <tr>
          <th>SENTENCE</th>
          {#each headers as header}
            <th>{header.toUpperCase()}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each results as tableEntry, i}
          <tr>
            <td>{sentences[i]}</td>
            {#each Object.values(tableEntry) as value}
              <td>{value}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {/if}

  <!-- <section>
    <h2>Sample Section</h2>
    <p>This is some text. Example link can be seen <a href="https://github.com/jonathanlo411/dsc180b-website">here</a>.</p>
    <div class='flex subheading'>
      <img src='https://phil174.lojot.com/data/fig3.png' alt='alt text'>
      <span>Figure 3. Example of figure showing subheading</span>
    </div>
  </section> -->

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
  #dl-div {
    background-color: var(--secondary);
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    font-size: 2rem;
    padding: 0.25rem;
    border: none;
    border-bottom: 1px solid var(--border);
    border-left: 1px solid var(--border);
    border-radius: 0 0 0 5px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 5px 10px;
    z-index: 1;
  }
  #dl-div:hover {
    cursor: pointer;
    background-color: var(--primary);
  }
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
    color: white;
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
  #presetRow {
    background-color: var(--secondary);
    width: 50%;
    margin: 2rem auto 0;
    border: 1px solid var(--border);
    border-radius: 5px 5px 0 0;
    overflow-x: auto;
    white-space: nowrap; 
  }
  #presetRow button {
    background-color: var(--primary);
    border: none;
    color: var(--font-color);
    padding: 0.5rem;
    font-size: 1rem;
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    transition: 0.3s;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
  }
  #presetRow button:hover {
    cursor: pointer;
    background-color: var(--secondary);
  }
  form {
    background-color: var(--secondary);
    padding: 1rem 2rem;
    width: 50%;
    margin: 0 auto 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    border: 1px solid var(--border);
    border-radius: 0 0 5px 5px;
  }
  form > div {
    margin-top: 1rem;
    display: flex;
    align-items: center;
  }
  form span {
    font-size: 1.4rem;
    margin-right: 0.5rem;
  }
  form input, form input:focus {
    font-size: 1rem;
    padding: 1.5%;
    margin-top: 0.2rem;
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
  :global(.blocked) { opacity: 0.5; }
  :global(.blocked:hover) { cursor: not-allowed !important; }

  /* Loader */
  #loading {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
  .loader {
    border: 0.25rem solid var(--secondary); 
    border-top: 0.25rem solid var(--highlight); 
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
    animation: spin 1.5s ease-in-out infinite;
    margin: 1.6vh auto;
    outline: white;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  #loading p {
    font-size: 1.2rem;
    padding-bottom: 5rem;
  }

  /* Demo Results */
  #results {
    width: min(95%, 1500px);
    margin: 2rem auto;
    border: 1px solid var(--border);
    border-radius: 5px;
    background-color: var(--secondary);
    overflow-x: auto;
  }
  :global(table) {
    border-collapse: collapse;
    font-size: 1rem;
    width: 100%;
  }
  :global(table thead tr) {
    background-color: var(--primary);
    color: rgb(101, 93, 98);
    font-weight: bold;
    font-size: 0.7rem;
    text-align: left;
  }
  :global(table th),
  :global(table td) {
    padding: 0.4rem;
  }
  :global(table tbody tr) {
    border-bottom: 1px solid var(--border);
  }
  :global(table tbody tr:hover) {
    background-color: var(--primary);
  }

  /* Relevant Links */
  #link-row {
    display: grid;
    margin: 0.5rem auto;
    grid-template-columns: repeat(3, 33%);
    grid-auto-rows: 0.5fr;
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
    #presetRow {
      width: 100%;
    }
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

    /* Rework */
    #link-row {
      display: grid;
      margin: 0.5rem auto;
      grid-template-columns: repeat(1, 100%);
      grid-auto-rows: 0.5fr;
    }
  }
</style>