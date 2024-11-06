# Hythere

Hythere is a social media application similar to Instagram, where users can create posts, connect with friends, and enjoy a seamless user experience. The application utilizes JWT (JSON Web Tokens) for secure authentication and offers a variety of features that enhance user interaction.

## Features

- **User Authentication**: Secure sign-up and login functionality using JWT for a smooth user experience.
- **Home Feed**: View all posts from users you follow in a centralized home section.
- **Profile Management**: 
  - View and edit your own profile.
  - Visit and explore profiles of other users.
- **Post Creation**: Create and manage your posts with options to like, comment, and bookmark.
- **Chat Functionality**: Real-time messaging with other users using Socket.io, allowing you to chat when both users are active.
- **Follow/Unfollow Logic**: Discover suggested users and manage your following list effortlessly.
- **Bookmark Posts**: Save your favorite posts for easy access later.
- **Protected Routes**: Secure routes ensure only authenticated users can access certain functionalities.
- **Delete Posts**: Users can delete their posts as needed.

## Technology Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Real-time Communication**: Socket.io for live notifications and messaging
- **Authentication**: JSON Web Tokens (JWT)
