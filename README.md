# DSC180B Website <a  href="https://github.com/jonathanlo411/dsc180b-website/releases"><img  src="https://img.shields.io/github/v/release/jonathanlo411/dsc180b-website"></a><a  href="https://github.com/jonathanlo411/dsc180b-website/blob/main/LICENSE"><img  src="https://img.shields.io/github/license/jonathanlo411/dsc180b-website"></a>
Website for DSC180B. Project details can be found at the [DSC180B repo](https://github.com/jonathanlo411/dsc180b/).

## Local Usage
1. Clone the repository.
2. Install packages `npm install`
3. Run local server `npm run dev -- --open`

## Details
The website uses SvelteKit as the main entry point. For the "Try it yourself!" demo section, it will query models `vaderSentiment`, `textblolb`, and `Perspective API` for results. This is done by hosting another server that utilizes Python runtime than can actually run those packages. This is implemented at [semanticometer-api](https://github.com/jonathanlo411/semanticometer-api/tree/main) which is hosted on [PythonAnywhere](https://www.pythonanywhere.com/). There are two endpoints that are exposed on that domain which allow us to query it in singular or bulk form. Since we can't hit those endpoints directly from the client side, requests are forwarded through the `/api` endpoint in the SvelteKit backend.

This can cause latency issues during large queries but will be ok for short ones. If you notice an impact on performance, namely [Vercel timing out](https://vercel.com/guides/what-can-i-do-about-vercel-serverless-functions-timing-out), the API is set to run on the edge. Simply change the API process to stream a response using a WebSocket to extend the timeout from 10s to 25s. Implementation details can be seen [here](https://github.com/jonathanlo411/srp-search/blob/main/src/routes/api/search/%2Bserver.ts).

## License
This project is licensed under the GNU General Public License. See `LICENSE` for more information.
