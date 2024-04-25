A simple full-stack app where users can save notes and delete them.

DATABASE: 
- Implemented a MongoDB database

BACKEND: 
- Set up Nodemailer with a new Gmail account and Google App Passwords for automated email sending and receiving.
Configured to send an email on each login and provide a link for password reset

- Implemented authentication using bcrypt for password hashing

- Implemented authorization using JWT

FRONTEND:
- Implemented authentication with Login/Sign out components, as well as Sign up and Forgot password

- Implemented authorization by protecting routes with Svelte Navigator, requiring users to be logged in and have a token for accessing certain pages, e.g., the profile page

- Added notifications using Toastr, displayed on login, note addition/deletion, and in the ForgotPasswordForm and ResetPassword
