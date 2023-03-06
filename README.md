User Matching API

OVERVIEW
This code provides a simple way to retrieve users sorted by similarity to a given user. This API takes in two parameters: a single user object and an array of multiple user objects. It compares the list of users to the single user and creates a GET API call to get a list of sorted users most comparable to the single user using several fields to prioritize similarity.

PARAMS
The API has a single endpoint GET /users that returns a list of users sorted by similarity to the input user.
Note that all of these parameters are optional, and the server will still return a list of users even if none of these parameters are provided. However, the more parameters that are provided, the more accurate the similarity and distance calculations will be, and the more relevant the results will be to the input user.

In the /users endpoint of this server, the similarity score between each user and the input user is calculated based on how many of their attributes match. However, the first attribute (attribute1) is weighted more heavily than the other attributes. Specifically, if the attribute1 of a user matches the attribute1 of the input user, that user's similarity score is increased by 6, whereas a match on any of the other attributes (attribute2 through attribute5) only increases the similarity score by 2 to 5 points.

This weighting system is based on the assumption that attribute1 is more important or relevant than the other attributes, and should therefore carry more weight in the similarity calculation. Of course, this assumption may not always be true, and the weighting system could be adjusted to reflect the importance of different attributes in different contexts.

If the latitude and longitude properties are present, the server calculates the distance (in minutes) between each user and the input user using the Haversine formula.

USER OBJECT OPTIONS

1. user.attribute1: a string representing an attribute of the user

2. user.attribute2: a string representing an attribute of the user

3. user.attribute3: a string representing an attribute of the user

4. user.attribute4: a string representing an attribute of the user

5. user.attribute5: a string representing an attribute of the user

6. user.latitude: a numeric value representing the latitude of the user's location 

7. user.longitude: a numeric value representing the longitude of the user's location

8. distance: a numeric value representing the maximum distance (in minutes) from the input user to include in the results
secret: a string representing a secret key that will be used to authenticate requests to the API

The API endpoint will return a JSON object containing a sorted list of users, with the most similar users first. Each user object will include properties id, latitude, longitude, attribute1, attribute2, attribute3, attribute4, attribute5, similarity, and, if present, distance.

Documentation:

The app.js file contains the following:




