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
| GET | `/shifts` | Authenticated | Admins see all shifts; users see their own |
| GET | `/shifts/:id` | Owner or admin | Get a shift |
| POST | `/shifts` | Authenticated | Create a shift for the current user |
| PATCH | `/shifts/:id` | Owner or admin | Update a shift |
| DELETE | `/shifts/:id` | Admin | Delete a shift |
| GET | `/comment` | Admin | List all comments |
| GET | `/comment/:id` | Owner or admin | Get a comment |
| POST | `/comment` | Authenticated | Create a comment for the current user |
| PATCH | `/comment/:id` | Owner or admin | Update a comment |
| DELETE | `/comment/:id` | Admin | Delete a comment |
| GET | `/comment/user/:userId` | Authenticated | List comments created by a user |
| GET | `/permission` | Admin | List permission roles |

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

Import the route table above into Postman or Insomnia. Register or log in first, save the returned token as a Bearer token, and use it for protected requests. Test both regular-user and administrator access to verify the role restrictions.
