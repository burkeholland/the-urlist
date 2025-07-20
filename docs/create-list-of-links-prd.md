# Product Requirements Document: Create a New List of Links

## Overview

This document describes the requirements for enabling users to create a new list of links on the `/s/list` page. A list consists of a title, description, optional vanity URL, and one or more links. Each link contains a URL, title, description, and icon.

## Requirements Table

| Requirement ID | Description                        | User Story                                                                                                   | Expected Behavior/Outcome                                                                                                         |
|----------------|------------------------------------|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| FR001          | Creating a New List                | As a user, I want to create a new list with a title, description, and optional vanity URL.                   | The system should provide a form or UI for users to input these fields and create a new list.                                     |
| FR002          | Adding Links to a List             | As a user, I want to add one or more links to my list, each with a URL, title, description, and icon.        | The system should allow users to add, edit, and remove links before saving the list.                                              |
| FR003          | Viewing List Details               | As a user, I want to see the details of my list (title, description, vanity URL, and links) after creation.  | The system should display the list details and all links in a readable format after creation.                                     |
| FR004          | Editing List Before Saving         | As a user, I want to edit the list title, description, vanity URL, and links before saving.                  | The system should allow users to modify any field or link before finalizing the list.                                             |
| FR005          | Validating List and Link Data      | As a user, I want to be notified if any required fields are missing or invalid before saving my list.        | The system should validate all required fields and display errors for missing/invalid data.                                       |
| FR006          | Optional Vanity URL                | As a user, I want to optionally specify a vanity URL for my list for easier sharing.                         | The system should allow users to enter a vanity URL, validate its uniqueness, and display errors if the vanity URL is taken.      |
| FR007          | Link Icon Field (Future Use)         | As a user, I want each link to have an icon, which will be automatically fetched from the link's OpenGraph data in the future. | The system should reserve a spot for the icon in the database and UI, but does not need to implement scraping logic yet.         |

## User Stories

- As a user, I want to create a new list of links with a title, description, and optional vanity URL.
- As a user, I want to add, edit, and remove links in my list, each with a URL, title, description, and icon.
- As a user, I want to review and edit my list and links before saving.
- As a user, I want to be notified of any errors or missing information before saving my list.
- As a user, I want to optionally specify a vanity URL for my list.
- As a user, I want to select or upload an icon for each link.
- As a user, I want each link to have an icon field, which will be populated automatically in the future.

## Acceptance Criteria

- [ ] Users can access a "Create New List" UI on the `/s/list` page.
- [ ] Users can enter a title, description, and optional vanity URL for the list.
- [ ] Users can add one or more links, each with a URL, title, description, and icon.
- [ ] Users can edit or remove links before saving the list.
- [ ] The system validates required fields and displays errors for missing/invalid data.
- [ ] The system checks vanity URL uniqueness and displays errors if the vanity URL is taken.
- [ ] Users can select from preset icons or upload a custom icon for each link.
- [ ] Each link has an icon field reserved in the database and UI, even if it is empty or a placeholder.
- [ ] After saving, the user is redirected to the list details page showing all entered information.
