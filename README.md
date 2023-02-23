User Matching API
This API takes in two parameters: a single user object and an array of multiple user objects. It compares the list of users to the single user and creates a GET API call to get a list of sorted users most comparable to the single user using several fields to prioritize similarity.

API Endpoints

GET /users: Retrieves a list of users from the Firestore database, calculates the distance between each user and the input user, adds a distance field to each user object, and sorts the users by similarity to the input user using a weighted average approach. Returns the sorted list of users as a JSON response.

Example
GET http://localhost:3000/users?user={"latitude":<latitude-value>,"longitude":<longitude-value>}

Parameters
Single user object: A JSON object with the following fields:

name: A string representing the user's name.
location: A string representing the user's geographical location.
latitude: A float representing the user's latitude coordinate.
longitude: A float representing the user's longitude coordinate.
elo: An integer representing the user's ELO rating.
interests: An array of strings representing the user's interests.
attribute4: A string representing the user's fourth attribute.
attribute5: A string representing the user's fifth attribute.
Array of multiple user objects: A JSON array of objects with the same fields as the single user object.

Fields Used for Comparison
The following fields are used to prioritize similarity between users:

distance: The distance between the user and the input user, in minutes.
elo: The user's ELO rating.
interests: The user's interests.
attribute4: The user's fourth attribute.
attribute5: The user's fifth attribute.
Installation and Usage
To run this API, you will need to have Node.js and the following packages installed: express, @google-cloud/firestore.

To ensure the security of the API, express-validator is used to validate the request query parameter 'user' to ensure it contains the required fields and has the expected data types. Additionally, a middleware is added to check for a secret key in the request headers that is required to access the API. The secret key is stored as an environment variable for security.

