# xell-customizer-api

A REST API service for customizing XeLL terminal builds with custom colors and ASCII art. This API integrates with GitHub Actions to trigger custom builds, manage uploads, and provide download capabilities.

## Features

- Trigger custom builds with customizable parameters (colors, ASCII art)
- Secure file upload with unique ID and key pairing
- Download generated terminal builds
- Integration with GitHub Actions workflow

## Requirements

- [Bun](https://bun.sh/) runtime
- A GitHub personal access token with workflow permissions

## Installation

Clone this repository and install dependencies:

```sh
bun install
```

## Environment Variables

```
GITHUB_TOKEN=your_github_token_here
```

## Usage

### Development

Start the development server with hot reloading:

```sh
bun run dev
```

## CORS Configuration

The API is configured to accept requests only from `https://xell.barrenechea.cl`.

## Technology Stack

- [Bun](https://bun.sh/) - JavaScript runtime
- [Hono](https://github.com/honojs/hono) - Web framework
- [Zod](https://github.com/colinhacks/zod) - Schema validation
- [Octokit](https://github.com/octokit/rest.js) - GitHub REST API client

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
