<script lang='ts'>
  
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

</script>

<section>
  <form on:submit|preventDefault={handleSubmit}>
    <input name='sentence' type='text'>
    <button>Submit</button>
  </form>
</section>