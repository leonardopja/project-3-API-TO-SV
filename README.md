# Project 3 - Full Stack API to Server

REST API for a shift builder, built with Node.js, Express and MongoDB. The API includes JWT authentication, role-based authorization, and the User, Shift, Permission and Comment collections from the project specification.

## Requirements

- Node.js 20 or newer
- MongoDB, local or hosted

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters.
3. Start MongoDB.
4. Run `npm run dev` for development or `npm start` to start the API.

The API listens on port `3000` by default. `GET /health` checks that the process is running. On startup the API creates the `admin` and `regular_user` permission records if they do not exist.

### First administrator

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters), `ADMIN_FIRSTNAME` and `ADMIN_LASTNAME` in `.env`, then run `npm run seed:admin`. The script refuses to promote an existing account.

## Authentication

Register at `POST /api/auth/register` or log in at `POST /api/auth/login`. Both return a JWT in the `token` field. Send it on protected requests using:

```http
Authorization: Bearer <token>
```

New registrations always receive the `regular_user` role. Administrator accounts are created using the seed script; clients cannot assign themselves a role.

## Routes

All routes are prefixed by `/api`. Protected routes require a bearer token.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a regular user |
| POST | `/auth/login` | Public | Log in and receive a JWT |
| GET | `/auth/me` | Authenticated | Get the current user |
| GET | `/users` | Admin | List users |
| PATCH | `/users/:id` | Own account or admin | Update email, first name or last name |
| DELETE | `/users/:id` | Admin | Delete a user |
| GET | `/shifts` | Admin | List all shifts |
| GET | `/shifts/:id` | Owner or admin | Get a shift |
| GET | `/shifts` with query or JSON body `_id` | Owner or admin | Get one shift (also supports the assignment's `_id` input format) |
| POST | `/shifts` | Authenticated | Create a shift; optional `_id` identifies the user, and regular users can only use their own ID |
| PATCH | `/shifts` with `{ "_id": "...", "shift": {} }` | Owner or admin | Update a shift using the assignment's input format |
| PATCH | `/shifts/:id` | Owner or admin | REST-style alias to update a shift |
| DELETE | `/shifts` with `{ "_id": "...", "user": {} }` | Admin | Delete a shift using the assignment's input format; authorization comes from the JWT |
| DELETE | `/shifts/:id` | Admin | REST-style alias to delete a shift |
| GET | `/comment` | Admin | List all comments |
| GET | `/comment/:id` | Owner or admin | Get a comment |
| POST | `/comment` | Authenticated | Create a comment for the current user |
| PATCH | `/comment` with `{ "_id": "...", "comment": {} }` | Owner or admin | Update using the assignment's input format |
| PATCH | `/comment/:id` | Owner or admin | REST-style alias to update a comment |
| DELETE | `/comment` with `{ "_id": "...", "user": {} }` | Admin | Delete using the assignment's input format; authorization comes from the JWT |
| DELETE | `/comment/:id` | Admin | REST-style alias to delete a comment |
| GET | `/comment/user/:userId` | Authenticated | List comments created by a user |
| GET | `/permission` | Authenticated | List permission roles |

Permission records are provisioned by the API and are not writable through a public endpoint.

## Request examples

Register:

```json
{
  "user": {
    "email": "person@example.com",
    "password": "a-strong-password",
    "firstname": "Alex",
    "lastname": "Example"
  }
}
```

Create a shift:

```json
{
  "shift": {
    "start": "2026-10-12T09:00:00.000Z",
    "end": "2026-10-12T17:00:00.000Z",
    "perHour": 25,
    "place": "Main office"
  }
}
```

Create a comment:

```json
{
  "comment": {
    "description": "Shift covered successfully."
  }
}
```

## Errors and tests

Responses use JSON. Validation errors return `400`, unauthenticated requests `401`, forbidden requests `403`, missing resources `404`, and duplicate values `409`.

Run the test suite with `npm test`.

## Postman / Insomnia

Import [`postman/Project-3-API.postman_collection.json`](./postman/Project-3-API.postman_collection.json) into Postman. Run “Register regular user” first; the collection saves its JWT and ID for subsequent requests. Set the `adminToken` collection variable to a JWT for an administrator before running administrator-only requests. The collection includes requests using the `_id` request bodies shown in the school specification.

The assignment says `GET /api/shifts` is only for admins; accordingly, a regular user's attempt to list shifts returns `403`. A regular user can still retrieve or update their own individual shift.

## Deployment

The API is ready to run locally or deploy to a Node.js host. Configure `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN` and `PORT` in the host's environment settings, then use `npm start`. Do not commit `.env`; it contains private configuration.
