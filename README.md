# Contribute.Codes

Contribute.Codes is a platform designed to connect open-source and non-profit projects with passionate contributors and volunteers from around the world. We believe that coding and collaboration have the power to drive positive change, and our mission is to provide a space where projects seeking help can easily connect with people who want to make a difference.

## Making a Commit

This project is setup with pre-commit hooks to ensure that the codebase is consistent and free of errors. On each commit, the following checks are performed:

- Linting – ensures that the codebase adheres to the coding standards.
- Formatting – ensures that the codebase is formatted correctly.
- Tests – ensures that the codebase is functioning as expected.
- Commit message – ensures that the commit message follows the conventional commit format.

You may find that the commit may take longer than usual. This is normal as the checks are being performed.

## Development

Pre-requisites:

- Node.js – at least version v20 or higher.
- Docker – this can be either Docker Desktop or Orbstack.
- GitHub OAuth Client ID and Secret, refer to [this guide](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) on getting them. When creating the OAuth app, the callback URL should be `http://localhost:3000/auth/github`.

Copy the `.env.example` file to `.env` and fill in the necessary values.

```bash
cp .env.example .env
```

At minimum, you will need to provide both `NUXT_OAUTH_GITHUB_CLIENT_ID` and `NUXT_OAUTH_GITHUB_CLIENT_SECRET` in the `.env` file. You can leave the rest as default.

To quickly get started, you can run this command:

```bash
npm run d
```

The above command does the following:

- Performs dependencies install `npm install`
- Starts up dependent services (libsql, inbucket, etc.) `npm dx:up`
- Applies database migration `npm run db:migrate`
- Starts the development server `npm run dev`

You can run the above sub-commands individually if you prefer.

The following available commands are as follows:

### `npm dx:up`

Starts dependent services. (libsql, inbucket, etc.)

### `npm dx:down`

Stops dependent services.

### `npm db:migrate`

Applies database migrations.

### `npm db:seed`

Seeds the database with initial data. They can be re-run without any side effects.

### `npm db:studio`

Launches Drizzle Studio – a GUI for managing the database.

### `npm run dev`

Starts the development server.

## Testing

To run the unit tests, you can use the following command:

```bash
npm run test:unit
```

To run the end-to-end tests, you can use the following command:

```bash
npm run test:e2e
```
