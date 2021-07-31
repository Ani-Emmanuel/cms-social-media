**STEPS TO RUN THE PROJECT**

- Clone the project to your system
- Navigate into the project
- run npm install or yarn install
- In the root directory create a file called **.env**
- run npm start or yarn start
- run npm test or yarn test //to run test

**ADD TO EVN FILE**

    {
        PORT =  The port your program will run on
        DBURL = Your database url link (MongoDB)
        TEST_DB_URL = Your database test url link (MongoDB)
        SECRET = Your secret
      MAX_MEDIA_FILE_SIZE = Max size of file to upload
    }

**Request data**

- Route
  method: **POST**
  to create an account
  **(your host)/api/v1/register**

  - User Registration
    {
    "name": "your fullname",
    "email": "Your email address",
    "image": "upload image", //optional
    "password": "your password"
    }

- Route
  method: **POST**
  to loggin
  **(your host)/api/v1/login**

  - User Login
    {
    "email": "your account email",
    "password": "Your account password"
    }

- Route
  method: **POST**
  to create a post
  **(your host)/api/v1/create-post**

  - User Registration
    {
    "title": "post title",
    "description": "post decription",
    "image": "upload image", //optional
    }

- Route
  method: **GET**
  to get one post
  **(your host)/api/v1/get-one-post/(postId)**

- Route
  method: **GET**
  to get all posts
  **(your host)/api/v1/get-all-posts**

- Route
  method: **PATCH**
  to updat a post
  **(your host)/api/v1/update-post/(postId)**

  - Update post
    {
    "field": "**value** you want to update"
    }

- Route
  method: **delete**
  to delete a post
  **(your host)/api/v1/delete-post/(postId)**

**Note**

- Apart from Registration and Login every other requests needs you to use **Token** so you need to add the token as a bearer token.
- Some Links can only be accessed by an admin
