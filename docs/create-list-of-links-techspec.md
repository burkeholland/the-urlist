# Technical Specification: Create a New List of Links

## Overview

This document outlines the technical design and implementation plan for enabling users to create a new list of links on the `/s/list` page. Each list includes a title, description, optional vanity URL, and one or more links (each with a URL, title, description, and icon).

## Architecture / System Design

- **Frontend:** Next.js page at `/s/list` with a form-based UI for creating lists and links.
- **Backend:** API endpoint(s) for creating and validating lists and links.
- **Data Storage:** Lists and links stored in a database (e.g., PostgreSQL, Supabase).
- **Validation:** Both client-side and server-side validation for required fields and vanity URL uniqueness.
- **Icon Handling:** Support for selecting preset icons or uploading custom icons (stored in public storage or CDN).

## Data Models

### List

- `id`: string (UUID)
- `title`: string (required)
- `description`: string (required)
- `vanity_url`: string (optional, unique)
- `links`: array of Link objects

### Link

- `id`: string (UUID)
- `url`: string (required, must be valid URL)
- `title`: string (required)
- `description`: string (required)
- `icon`: string (URL or file reference, reserved for future OpenGraph scraping; may be empty or a placeholder)

## API Design

### Endpoints

- `POST /api/lists`
    - Creates a new list with provided data.
    - Validates required fields and vanity URL uniqueness.
    - Accepts array of links.
- `GET /api/lists/:id`
    - Retrieves list details by ID.
- `GET /api/lists/vanity/:vanity_url`
    - Checks if a vanity URL is available.

### Request/Response Example

**POST /api/lists**

Request:
```json
{
  "title": "My Favorite Links",
  "description": "A collection of useful resources.",
  "vanity_url": "favorites",
  "links": [
    {
      "url": "https://example.com",
      "title": "Example",
      "description": "An example site.",
      "icon": "/icons/example.svg"
    }
  ]
}
```

Response:
```json
{
  "id": "uuid",
  "title": "...",
  "description": "...",
  "vanity_url": "...",
  "links": [ ... ]
}
```

## Logic and Behaviour

- Display a "Create New List" form on `/s/list`.
- Allow users to add, edit, and remove links dynamically.
- Validate all required fields before submission.
- Check vanity URL uniqueness via API before saving.
- Allow icon selection/upload for each link.
- Reserve the icon field for each link in the database and UI, but do not implement scraping logic yet.
- On successful creation, redirect to the list details page.

## Tech Stack & Dependencies

- **Frontend:** Next.js, React, shadcn/ui components
- **Backend:** Next.js API routes or Supabase functions
- **Database:** PostgreSQL (Supabase)
- **Validation:** Zod or Yup for schema validation
- **Icon Storage:** Public folder or Supabase Storage

## Security & Privacy Considerations

- Validate and sanitize all user input server-side.
- Restrict file uploads to safe types and sizes.
- Ensure vanity URLs are unique and do not allow reserved words.
- Protect against XSS and injection attacks.

## Performance Considerations

- Use client-side validation to reduce unnecessary API calls.
- Debounce vanity URL checks.
- Optimize icon uploads and storage.

## Risks & Mitigations

- **Risk:** Vanity URL collision or abuse.
    - **Mitigation:** Enforce uniqueness and reserved word checks.
- **Risk:** Malicious file uploads.
    - **Mitigation:** Restrict file types and scan uploads.
- **Risk:** Data loss on form error.
    - **Mitigation:** Preserve form state on validation errors.
