# Brick_Breaker
This is a web version of the timeless game, Brick Breaker.

Utilizing Mean Stack in our application
-When a New User creates an account it is saved using Mongo DB 
-When an existing User logs in successfully, the credentials are compared to the Mongo DB querry
-Number of levels completed and number of bricks broken are stored continuously for each user using Mongo DB
-Game stats are querried from Mongo DB to be displayed on the leaderboard html page
-Use angular to iterate through and display user stats on the leaderboard html page
-Use Express to verify users and rerout webpages. If unsuccessful, user must try again or create a new account. If successful, the user is rerouted to the home page. From there the user has the option to press different buttons that will rerout to coresponding destinations.
-Use Node JS and socket io to send game information between the server and the client

Proper Game Functionality
-Ball moves correctly
-Bricks are removed when hit
-paddle moves correctly and is reset when ball is lost
-Manage game loop and  all game events using socket IO. All game functions are set in an interval and periodically refreshed and redrawn.

Creative Portion
-Game play supports different levels 
-Level increments/game ends correctly
-Ability to sort leaderboards by any of the given categories.                   

Best Practices
-Code is well formatted and easy to read with proper commenting
-Passwords are salted and encrypted 
-Page passes the W3 validator
-Site is intuitive and easy to use

Created in Wash U's Rapid Prototype Development and Creative Programming Course in collaboration with Tyler Reeves. 

