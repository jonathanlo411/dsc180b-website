import { json, type Config } from '@sveltejs/kit';

export const config: Config = {
  runtime: 'edge'
}

export async function POST({ request }){
  // Validate Data
  const requestData = await request.json()
  if (
    !requestData.hasOwnProperty('sentenceData') ||
    !requestData.hasOwnProperty('queryMethod')
  ) return json({ 'message': 'Missing Property' })
  if (
    requestData['queryMethod'] === 'single' &&
    !requestData.hasOwnProperty('modelTarget')
  ) return json({ 'message': 'Missing Propertdy' })

  // Make request
  const url = `https://dsc180ba14.pythonanywhere.com/api/${requestData['queryMethod']}`
  // const url = `http://127.0.0.1:5000//api/${requestData['queryMethod']}`
  let res: Response;
  if (requestData['queryMethod'] === 'single') {
    res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({sentence: requestData['sentenceData']}),
      headers: {
        "Content-Type": "application/json"
      }
    })
  } else {
    res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({sentences: requestData['sentenceData']}),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  let cleanData = await res.json()
  
  return json(cleanData)
}