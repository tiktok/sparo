# Website

This is the [Docusaurus](https://docusaurus.io/) project for the Sparo website.

## Development

1. Install the monorepo dependencies using [RushJS](https://rushjs.io/):

   ```shell
   rush install
   rush build
   ```

2. Launch the local development server:

   ```shell
   cd apps/website
   rushx start
   ```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Deployment

1. If you will manually copy the files to a server, you can build the **apps/sparo/build** folder like this:

   ```shell
   cd apps/website
   rushx build
   ```

2. To automatically deploy to GitHub Pages (as an administrator):

   ```shell
   # If you are using HTTPS authentication for GitHub:
   cd apps/website
   GIT_USER=<Your GitHub username> rushx deploy
   ```

   ```
   # If you are using SSH authentication for GitHub:
   USE_SSH=true rushx deploy
   ```

## See also

- [Deployment](https://docusaurus.io/docs/deployment) from the Docusaurus help

