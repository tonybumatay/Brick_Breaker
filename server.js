var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var passport = require('passport');
mongoose.connect('mongodb://localhost/news');
require('./models/Users');
require('./config/passport');
var User = mongoose.model('User');
var updateRate = 30; // in ms
var lastTime = Date.now();

app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());

io.on('connection', function(socket){
    // nice to know
    console.log('a user connected');

    
    //function to reset the ball to original position and velocity
     socket.on('new ball', function(newBall){
        socket.ball = newBall;
        socket.emit("update ball", socket.ball);
    });

     //tells the server what bricks remain and where they are
     socket.on('new bricks', function(newBricks){
        socket.bricks = newBricks;
        socket.emit("update bricks", socket.bricks);
     });

     //the server knows to move the paddle to the right
    socket.on("paddle right", function(socketPaddle){
        if(socket.ball.xVelocity == 0){
            socket.ball.xVelocity = 4;
            socket.ball.yVelocity = 4;
        }
        socket.paddle = socketPaddle;
        socket.paddle.x += 15;
        socket.emit("update paddle", socket.paddle);
    });

    //move to left
    socket.on("paddle left", function(socketPaddle){
        if(socket.ball.xVelocity == 0){
            socket.ball.xVelocity = -4;
            socket.ball.yVelocity = -4;
        }
        socket.paddle = socketPaddle;
        socket.paddle.x -= 15;
        socket.emit("update paddle", socket.paddle);
    });


    // new player sends their cursor object to be shared
    //   with the rest of the players
    socket.on('new paddle', function(newPaddle) {
        socket.paddle = newPaddle;
        socket.emit("update paddle", socket.paddle);
    });

    //UPDATED
    //when the ball hits the paddle 
    socket.on("hit paddle", function(myBall, myPaddle){
        socket.ball=myBall;
        socket.paddle=myPaddle;
        socket.ball.yVelocity = -socket.ball.yVelocity;
    });
    //the end of a round, either loss or next level
    socket.on("round over", function(myPaddle){
        socket.paddle=myPaddle;
        socket.paddle.gamePlaying=false;
        socket.paddle.brickScore = 0;
        socket.emit("update paddle", socket.paddle);
    });
    //if a player loses and chooses to play again
    socket.on("restart game", function(myPaddle){
        socket.paddle=myPaddle;
        socket.paddle.gamePlaying=true;
    });

    //adding a new user to the db
    socket.on("new user", function(data){
        var user = new User();
        socket.username = data.name;
        user.username = data.name;
        user.setPassword(data.password);
        user.save(function(err){
            if(err){
                socket.emit("creationError", err);
            }
            else{
                socket.emit("success login", user.generateJWT());
            }
        });
    });

    //verifying login
    socket.on("login", function(data){
        User.findOne({username: data.name}, function(err, user){
          if (err) { socket.emit("login error"); }
          if (!user) {
            socket.emit("login error");
          }
          else if (!user.validPassword(data.password)) {
            socket.emit("login error");
          } else{
            socket.username = data.name;
            socket.emit("success login", user.generateJWT());
          }
        });
    });

    //function to fill the leaderboards
    socket.on("get users", function(){
        User.find({}, function(err, data){
            socket.emit("users", data);
        });
       // socket.emit("users", User.find());
    });
   
   //at the end of a round, updates the stats of a player
    socket.on("update stats", function(myPaddle){
        User.findOne({username: socket.username}, function(err, user){
            if(myPaddle.level > user.levels){
                user.levels = socket.paddle.level;
            }
            user.save();
            user.bricks += myPaddle.brickScore;
            user.save();
        });
    });

    //function that constantly checks for collisions
    setInterval(function(){
        if(socket.ball){
            socket.ball.x += socket.ball.xVelocity;
            socket.ball.y += socket.ball.yVelocity;
            if(socket.ball.y <= 4){//top
                socket.ball.yVelocity = -socket.ball.yVelocity;
            }
            if(socket.ball.x <= 4){//left side
                socket.ball.xVelocity = -socket.ball.xVelocity;
            }
            if(socket.ball.x >= 800){//right side
                socket.ball.xVelocity = -socket.ball.xVelocity;
            }
            if(socket.paddle.gamePlaying){
            checkCollisions(socket);
            }
        }   
    }, updateRate);

    
    socket.on('disconnect', function(){
        console.log('user disconnected');
        // delete allCursors[socket.id];
    });
});

function update(){
    var currentTime = Date.now();

    // caculate time since last update
    var deltaTime = (currentTime - lastTime)/1000;

}

function checkCollisions(socket) {
    // check collisions
    for(brick in socket.bricks){
        //hitting bottom
        var b = socket.bricks[brick];
        var ball = socket.ball;
        if((b.x < ball.x + ball.width) && (b.x + b.width > ball.x) && (b.y < ball.y + ball.height) && (b.height + b.y > ball.y)){
            if((ball.y <= b.y - b.height) || (ball.y +ball.height >= b.y)){
                socket.ball.yVelocity = socket.ball.yVelocity*-1;
                socket.bricks.splice(brick, 1);
                socket.paddle.brickScore++;
                //bottom or top
            }
            else if((ball.x < b.x+b.width) || (ball.x +ball.width> b.x)){
                socket.ball.xVelocity = socket.ball.xVelocity*-1;
                socket.bricks.splice(brick, 1);
                socket.paddle.brickScore++;
                //left or right
            }
        }
    }
    if(((socket.paddle.y-socket.ball.y<=12)&&(socket.paddle.y-socket.ball.y>=5))&&((socket.ball.x-socket.paddle.x)>=0)&&((socket.ball.x-socket.paddle.x)<=70)){
        socket.ball.yVelocity = -socket.ball.yVelocity;
    }
    socket.emit("update bricks", socket.bricks);
    socket.emit("update ball", socket.ball);
    socket.emit("paddle data", socket.paddle);
}

function distance(x1, y1, x2, y2) {
    Math.sqrt( Math.pow((x2-x1),2)+Math.pow((y2-y1),2) );
}

// send update to all clients every {updateRate} ms
setInterval(update, updateRate);

http.listen(3000, function(){
    console.log('listening on *:3000');
});