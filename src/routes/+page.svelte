<script lang='ts'>
  import Information from "$lib/client/information.svelte";
  import UserCard from "$lib/client/userCard.svelte";
  import BarChart from '$lib/client/barChart.svelte';
  import LinkCard from "$lib/client/linkCard.svelte";

	import { theme } from '$lib/stores/theme';
  import { onMount } from 'svelte';

  import messages from '$webconfig/loadingMessages.json'
  import pageConfig from '$webconfig/pageConfig.json'

  // Overhead
  let results: Array<Record<string, string>>;
  let headers: Array<string>;
  let sentences: Array<string> = [];
  let loading: boolean = false;
  let splitSwap: Array<string>;

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
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })

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
      splitSwap = swap.split(',');
      splitSwap.forEach((term) => {
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
    <p>In today's digital landscape, the management of online content has become increasingly reliant on sophisticated tools such as sentiment analysis models, including TextBlob, VADER, and Perspective API. However, growing concerns about potential biases within these models, particularly in relation to race and gender, have sparked the need for a comprehensive investigation. Building upon previous studies, such as Sweeney (2013) and Kiritchenko and Mohammad (2018), which have shed light on biases in algorithmic decision-making, this paper endeavors to assess the fairness of TextBlob, VADER, and Perspective API in assigning sentiment. Specifically, we aim to scrutinize their treatment of self-identifying features like race and gender. By adopting methodologies akin to prior research but with a distinct dataset, our objective is to determine whether biases identified in earlier studies persist within these widely-utilized sentiment analysis models.</p>
    <br><br>
    <p>However, what is a sentiment analysis algorithm? Put simply, a sentiment analysis algorithm is a tool designed to read text and discern the writer's feelings and opinions. These algorithms follow a structured process, which can be broken down into several key steps. First, the algorithm reads the text, comprehending the words, phrases, and context therein. Next, it assesses the sentiment of the text, categorizing words as positive, negative, or neutral. For instance, words like "love" typically convey positivity, while "boring" tends to evoke negativity. Subsequently, the algorithm aggregates this sentiment information to determine the overall sentiment of the text. Finally, the algorithm produces its output, often in the form of a numerical value on a scale from -1 to 1, indicating the intensity and direction of sentiment.</p>
  </section>

  <section>
    <h2>Data Review</h2>
    <p>Our dataset comprises 152 template sentences, each explicitly mentioning both gender and race. Racial categories include Asian, white, and black, while gender encompasses female and male identities. These sentences are meticulously labeled with sentiment scores: 1 for positive, 0 for neutral, and -1 for negative sentiment. The distribution of sentiments is as follows: 63 positive, 47 neutral, and 42 negative sentences.</p>
    <br><br>
    <p>To ensure diversity, sentences were crafted by different students and cross-checked by another student. This collaborative effort aimed to incorporate a wide range of perspectives and minimize biases in the dataset.</p>
    <br><br>
    <p>Furthermore, sentences were crafted to be complex and descriptive, mimicking real-world comments and content. This approach enhances the dataset's robustness and reflective capabilities. Illustrative examples of positive, neutral, and negative sentences are provided to showcase the dataset's variation and complexity.</p>
  </section>

  <section>
    <h2>Methods</h2>
    <p>Data processing was conducted using the Spacy text processing package to parse each sentence into basic structures, facilitating the injection of race and gender pronouns into the sentences. For instance, a sentence like "A white woman experienced a neutral day..." would be transformed into a template with slots for race and gender.</p>
    <br><br>
    <p>This streamlined process allowed for the replacement of these slots with specific identities, generating audit-ready samples. These samples were then compiled into a DataFrame containing the original sentence sentiment and pronoun counts.</p>
    <br><br>
    <p>For model auditing, a simplified querying process was developed utilizing native APIs. Specifically, a dedicated "modelCollection" file was created, which included imports for TextBlob and vaderSentiment. Additionally, the Perspective API was set up using Google's Python API Client. To simplify the utilization of these resources, a "ModelCollection" class was created with methods for both single and bulk querying of all models.</p>
  </section>

  <section>
    <h2>Findings</h2>
    <p>In our investigation of three sentiment analysis algorithms—TextBlob, VADER, and Google's Perspective API—we found evidence of bias in their treatment of race and gender within text. Despite our initial hypothesis of unbiased behavior, disparities emerged in sentiment scoring across different racial and gender groups. Specifically, sentences mentioning individuals of Asian descent tended to receive lower sentiment scores, while those referencing females were more likely to be assigned negative sentiment scores. These findings highlight the presence of nuanced biases within the algorithms, emphasizing the need for continued scrutiny and evaluation to ensure fairness and equity.</p>
    <br><br>
    <p>Interestingly, we observed variations in the magnitude and direction of bias among the three models. TextBlob exhibited a tendency towards more negative sentiment scores for certain demographic groups, while VADER displayed fluctuations in sentiment scoring. Google's Perspective API demonstrated a relatively lower level of bias compared to the other models. These differences underscore the importance of algorithmic transparency and further research into mitigating bias in sentiment analysis algorithms. Addressing these biases is crucial for fostering inclusive and equitable digital environments as sentiment analysis algorithms continue to play a significant role in content moderation and decision-making processes.</p>
    <br><br>
    <p>Furthermore, our analyses using one- and two-way ANOVA tests provided additional insights into the interaction between sentiment analysis algorithms, race, and gender. Despite the absence of statistically significant differences in sentiment scores between gender identities according to all models, there were noteworthy distinctions in sentiment perception across racial categories. These disparities suggest that race may play a more influential role than gender in shaping sentiment perception within text, a finding warranting further investigation and consideration in algorithm development and deployment.</p>
    <div class='flex subheading'>
      <img src='/imgs/dsc180b_visual1.png' alt='bar chart of average differences in model scoring'>
      <span>Figure 1. Average Differences in Model Scoring</span>
    </div>
    <p>The bar charts presented in the figure illustrate the average difference in sentiment scores across various demographic identifiers as analyzed by different sentiment analysis algorithms. To clarify the concept of "average difference," an example is provided using a sample sentence: "The _, after a long week of work, felt drained but was excited for the weekend to come." Initially scored at 0.031 by the Perspective API, inserting an identifier like "black woman" into the placeholder results in a higher score of 0.097, indicating a perception of increased toxicity by the algorithm. The average difference is obtained by subtracting these scores and calculating the average across all 152 sentences, encompassing all demographic identifiers and sentiment analysis algorithms.</p>
  </section>

  <section>
    <h2>Discussion</h2>
    <p>In reflecting on our study, there are several aspects that could be refined or approached differently in future iterations. Firstly, during the data collection process, utilizing core data sources such as newspaper headlines could potentially offer a more representative and diverse dataset. Additionally, rather than relying solely on programmatically substituting race and gender terms using tools like Spacy, a more meticulous approach involving manual insertion of substitutions could enhance the accuracy and granularity of the dataset.</p>
    <br><br>
    <p>Moving forward, it is essential to delve deeper into understanding the underlying factors contributing to the disparities observed among sentiment analysis models. Investigating the root causes of these differences could shed light on potential biases inherent within the algorithms or the datasets themselves, thereby informing strategies for improving algorithmic fairness and equity.</p>
    <br><br>
    <p>It is worth noting that the reproducibility of this study remains intact, as all code within the associated notebooks in the repository can be rerun to replicate the findings. This ensures transparency and enables other researchers to validate our results and build upon our findings in future studies.</p>
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
  <div id='results-wrap'>
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
    <BarChart {results} {headers} sentences={splitSwap} />
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
  #results-wrap {
    width: min(95%, 1500px);
    margin: 2rem auto;
  }
  #results {
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