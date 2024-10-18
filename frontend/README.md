
# Thoughts - A Blogging Platform

**Thoughts** is a simple and intuitive blog platform where users can share their thoughts, ideas, and experiences by posting blogs. Users can register, create, and manage their blog posts, including uploading images to enhance their content. Whether it's for personal use or for building an audience, **Thoughts** provides a seamless experience for writing and sharing.

## Features

- **User Registration & Authentication**: Users can sign up, log in, and manage their accounts.
- **Create, Edit, and Delete Blogs**: After logging in, users can write new blog posts, edit existing ones, or delete them as needed.
- **Image Upload**: Blogs can include images to make posts more engaging and visually appealing.
- **Responsive Design**: The platform is fully responsive, making it easy to use on both desktop and mobile devices.
- **User Profile**: Users can view and edit their profile details, including their blog posts and uploaded images.

## Tech Stack

- **Frontend**: React (with React Router for routing)
- **Backend**: Node.js, Express, GraphQL (Apollo Server)
- **Database**: MongoDB
- **Image Handling**: Cloudinary (for image storage and delivery)
- **Authentication**: JWT-based authentication for user sessions
- **Deployment**: Vercel (Frontend), Render (Backend)

## Installation

To set up the project locally, follow these steps:

### Prerequisites

- Node.js installed on your local machine
- MongoDB database
- Cloudinary account for image uploads

### Clone the Repository

```bash
git clone https://github.com/yourusername/thoughts.git
cd thoughts
```

### Install Dependencies

Install both frontend and backend dependencies.

For the frontend:
```bash
cd frontend
npm install
```

For the backend:
```bash
cd backend
npm install
```

### Setup Environment Variables

Create a `.env` file in the backend directory and add the following environment variables:

```bash
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
and 
more...
```

### Run the App

Start the backend server:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser to view the website.

## Deployment

- **Frontend** is hosted on [Vercel](https://vercel.com/)
- **Backend** is hosted on [Render](https://render.com/)
  
For deployment setup, refer to the Vercel and Render documentation to configure environment variables.

## Contributing

If you'd like to contribute to **Thoughts**, feel free to open issues or submit pull requests on GitHub. Contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, feel free to reach out:

- Email: [sthdelip88@gmail.com](mailto:sthdelip88@gmail.com)
- GitHub: [https://github.com/Delip-88/thoughts](https://github.com/Delip-88/thoughts)
