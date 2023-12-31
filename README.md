# Puudle - Appointment planning for small groups

Organize events and appointments for small, trusted groups.<br>
Complete with backend (Web service, API, data storage) and web frontend.

It's a bit like `dudle`, `nuudel`, `kulibri`, `bitpoll` et al, but limited
to really small groups. Comes with an exceptionally small storage footprint,
optimized for lowest hosting costs.

Runs with almost any `node.js` hosting environment.

## Application features

- No authentication -<br>
  Anyone can participate.<br>
  *Basic Auth suggested if you need to restrict access.*
- Users may:
  - Create upcoming events.
  - Subscribe to events.
  - Use different levels of subscription.
- Frontend is available in multiple languages.
- Sends email notifications on content changes.<br>
  Emails will be sent to a single address
  (use an email group to reach users).
- Supports only a small number of users (limited API performance,
  service does not scale).

## Implementation features

- Completely self-contained:
  - No external database needed.
  - `node.js` based http service hosts backend (API) and web frontend.
- Based upon `quasar framework` with `vue.js` V3.
- No TLS (https).<br>
  Meant to be installed behind an upstream proxy (as supplied by most
  `node.js` hosting environments).
- Runtime production configuration by environment variables.
- Runs on any platform that supports `node.js` (Linux, Unix, MacOS, Windows).

## Data persistence

The builtin http API features a small in-memory database.
All data is persisted within a file (`backend/dbdata/database.json`).
That file must be writeable by the `node.js` process (you might need
to tweak hosting settings or configure a different path).

There's no concurrency mechanism; The in-memory data is just dumped
into the file after each modification.

As a result, there must be only one backend instance; The service
will not scale.

## Application infrastructure

There's two `node.js` installations:

- `~/` (root folder)<br>
  Runs the backend web server.<br>
  Expects the built frontend at `~/dist`.
- `~/frontend`<br>
  Build and development environment.

## Development

### Prerequisites

- `node.js` version >= 15
- Email account with SMTP access

That's it. Nothing else.

### Backend

1. Open any shell inside the project root folder.
2. Run `npm ci` (or `npm i` if you want to update dependencies).
3. Configure credentials in `.env` file.
4. Start the dev server: `npm run dev`.

The dev server will reload on source code changes.<br>
Listens (by default) on port 8081.

#### Check mailer configuration

`npm run send-test-mail` tries to send an email using the configured credentials.

### Frontend

1. Open any shell inside the project root folder.
2. Run `npm run frontend-install` (or `npm i` if you want to update dependencies).
3. Start the dev server: `npm run frontend-dev`.

The dev server will reload on source code changes.<br>
Listens (by default) on port 8081.

Open the frontend with your favorite browser.
With the default frontend dev port 8081 the URL is:
http://localhost:8081/

The frontend can be re-built from the root folder via `npm run build-frontend`.

### i18n

Frontend translation is performed by `vue-i18n`.
The corresponding locale definitions are located at
`~/frontend/src/i18n`, each in their own locale folder.

Adding a new translation needs registration in<br>
`~/frontend/src/i18n/index.js`.

## Deployment

### Provisioning

Productive deployments *should* not use .env files, instead using
deployment environment variables is preferred. However, the backend will
still use the file `.env` from the project root folder if it exists.
Create one if the hosting platform does not supply environment variable
configuration.

**Make sure no .env files are accessibly publicly.**

Don't mix up the files `.env` and `.env.customize`; The latter is
for configuration, not credentials:

### Configuration

The file `.env.customize` contains customization parameters.
Since it is part of the source code repository it **must never
contain any credentials**.

`.env.customize` settings are baked into the frontend application
build without any protection.
Changes relevant to production need a frontend rebuild.

Credentials **may** be set inside the file `.env`. This is only
recommended for local development.

**Modification of the environment files needs service restart.**

#### Configuration parameters

| | |
|---|---|
| APPNAME | The application name |
| FRONTEND_DEV_PORT | TCP port the frontend server listens on (dev only) |
| BACKEND_PORT | TCP port the backend server listens on (dev, staging and production) |
| IS_ADMIN | Allows deletion of event entries if set |
| POLL_INTERVAL_MS | Frontend to backend polling interval |
| DELAYED_POLL_MS | Focus on an input in frontend pauses the poll for this given time |
| GET_ONLY_CURRENT_ENTRIES | Only shows event entries starting from today |
| DB_PERSIST_DAYS | Entries are deleted if older |
| ENTRY_DELETION_ALLOWED_SECONDS | How long a new entry is allowed to be deleted |
| CHANGE_WATCHER_INTERVAL_SECONDS | How often the watcher shall look for changes |

#### Backend Credentials
(via environment variables or from the `.env` file)

These settings are **obligatory**.

| | |
|---|---|
| EMAIL_FROM | The address to send notifications to |
| EMAIL_TO | EMail recipent |
| EMAIL_SUBJECT | EMail subject |
| EMAIL_TEXT | Plain EMail text. All `\n` occurances are replaced by line feeds. |
| EMAIL_SMTP_URL | SMTP URL as described at https://nodemailer.com/smtp/ |

### Local staging

1. Open any shell inside the subfolder `frontend`.
2. Run `npm run build`.

The complete frontend is built into the project subfolder `dist`.<br>
The backend will automatically pick it up.

With the default backend dev port 8080 the URL is:
http://localhost:8080/

### Server deployment

#### Automatic packing

`npm pack` creates an npm package archive.

Some hosters may be able to simply run from that archive; Otherwise
the contents of the "package" folder have to be copied to the hosting
root.

#### Manual packing

Pack and copy these files and directories to your `node.js` hosting platform:

- package.json
- .env.customize
- backend/. (whole folder)
- dist/. (whole folder)

Then run `npm i` and configure the starting point as `npm run start`
or just `node backend/index.js.

#### Prod credentials

Prior to application start, configure the obligatory credentials (as mentioned above).<br>
Either set environment variables (best practise) or supply a `.env` file.

## User data persistence

The frontend application uses localStorage to persist user settings.
Inside the key starting with 'puudle-' these JSON encoded values are used:

| | |
|---|---|
| locale | Manually set language (null ) |
| lastUsedUserName | Will be suggested when adding subscriptions. |

This may or may not be a GDPR issue. There's no imprint either, so
you'd probably not want to advertise your installation to the public.
