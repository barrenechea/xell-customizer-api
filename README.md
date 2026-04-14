# xell-customizer-api

A REST API service for customizing XeLL terminal builds with custom colors and ASCII art. This API integrates with GitHub Actions to trigger custom builds and runs on Cloudflare Workers.

## Features

- Trigger custom builds with customizable parameters (colors, ASCII art)
- Integration with GitHub Actions workflow
- Deployed as a Cloudflare Worker

## Requirements

- [Node.js](https://nodejs.org/) with npm
- A GitHub personal access token with workflow permissions
- A [Cloudflare](https://cloudflare.com/) account (for deployment)

## Installation

Clone this repository and install dependencies:

```sh
npm install
```

## Environment Variables

```
GITHUB_TOKEN=your_github_token_here
```

Set secrets for Cloudflare Workers via Wrangler:

```sh
npx wrangler secret put GITHUB_TOKEN
```

## Usage

### Development

Start the local development server using Wrangler:

```sh
npm run dev
```

### Deployment

Deploy to Cloudflare Workers:

```sh
npm run deploy
```

## CORS Configuration

The API is configured to accept requests only from `https://xell.barrenechea.cl`.

## Technology Stack

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless runtime
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - Cloudflare Workers CLI
- [Hono](https://github.com/honojs/hono) - Web framework
- [Zod](https://github.com/colinhacks/zod) - Schema validation
- [Octokit](https://github.com/octokit/rest.js) - GitHub REST API client

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
