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
  let res: Response;
  if (requestData['queryMethod'] === 'single') {
    res = await fetch(url, {body: JSON.stringify({sentence: requestData['sentenceData']})})
  } else {
    res = await fetch(url, {body: JSON.stringify({sentences: requestData['sentenceData']})})
  }

  return json({"scores": res})
}