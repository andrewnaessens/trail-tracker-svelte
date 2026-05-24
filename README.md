# Trail Tracker Svelte

## Project Description
Trail Tracker Svelte is a frontend web application for listing and managing hiking trail information.

## Features

### Current Frontend Features
- **Data Persistance**: MongoDB integration with automated database seeding.
- **Dashboard**: User dashboard with category and trail views.
- **Image Management**: Cloudinary integrated trail image galleries with seamless image upload, full-screen preview, and deletion for every trail.
- **Charts**: Dedicated chart views with multiple charts.
- **Maps**: Dedicated map views with multiple maps. (Maps are also available in dashboard and category views.)
- **Secure Authentication**: Custom JWT (JSON Web Token) implementation for protected API routes and authentication via sessions.

### Current Backend Features
- **Data Persistance**: Multi-store support (MongoDB) with automated database seeding.
- **Dashboard**: User dashboard with category and trail views.
- **Admin Dashboard**: Admin dashboard for managing users and viewing analytics.
- **User Profile**: User profile for managing user information and viewing analytics. (Implemented in the Hapi backend application but not currently implemented in the Svelte frontend application.)
- **Image Management**: Cloudinary integrated trail images with seamless image upload and deletion for every trail.
- **Secure Authentication**: Custom JWT (JSON Web Token) implementation for protected API routes and authentication via sessions.
- **API Documentation**: Fully interactive **Swagger** UI for testing and exploring endpoints.

### Upcoming Features (Roadmap)
- [ ] **User Profile**: User profile for managing user information and viewing analytics. (Svelte fontend user profile features via Hapi backend API coming soon!)
- [ ] **Admin Dashboard**: Admin dashboard for managing users and viewing analytics (Svelte fontend admin dashboard features via Hapi backend API coming soon!).

## Tech Stack
- **Frontend**: Svelte, SvelteKit, Bulma CSS, Font Awesome
- **Backend**: Node.js, Hapi.js
- **Database**: MongoDB Atlas (Mongoose)
- **Security and Validation**: JWT, Joi
- **Image Storage**: Cloudinary

## Prerequisites

Before running this project, ensure you have the following installed locally:

- **Node.js** (v20.x or higher recommended, developed using v25.x)
- **npm** (comes bundled with Node.js) 

## Technologies Used

- **Svelte 5**, **SvelteKit** (Frontend)
- **Vite** (Build Tooling & Development Server)
- **Font Awesome** (Icon Library)

## Getting Started

Follow the below steps to get a local copy of the project up and running.

### Installation

- Ensure you have the following installed locally:
  **Node.js** (v18.x or higher recommended), **npm** (comes bundled with Node.js) 
- Clone the repository:
  `git clone https://github.com/andrewnaessens/trail-tracker`
- Navigate to the project directory:
  `cd repository-name`
- Install the dependencies:
  `npm install`

### Development
- To start the development server, run:
  `npm run dev`
  