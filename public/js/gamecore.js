var socket = io();
var canvas, ctx;

// frequency of update call
var fps = 10;

//create a new padlle
var myPaddle = new Paddle();
var myBall = new Ball();
var myBricks = [];
var allUsers;

function sendUserInfo(username, pass, verify){
    socket.emit("new user", {name: username, password: pass});
}

socket.on("creationError", function(data){
    alert("A user with that name already exists");
});

function login(username, pass){
    socket.emit("login", {name: username, password: pass});
}

function logout(){
    myPaddle.loggedIn = false;
    socket.emit("new paddle", myPaddle);
    window.location.href = 'http://ec2-52-10-25-225.us-west-2.compute.amazonaws.com:3000/index.html#/login';
}

socket.on("login error", function(){
    alert("you were not logged in, please check your username and password and try again.");
});

socket.on("success login", function(data){
    myPaddle.loggedIn = true;
    socket.emit("new paddle", myPaddle);
    window.location.href = 'http://ec2-52-10-25-225.us-west-2.compute.amazonaws.com:3000/index.html#/brickbreaker';
});

function getUsers(){
    socket.emit("get users");
}

socket.on("users", function(data){
    allUsers = data;
});

function init() {
    // make canvas full screen
    document.getElementById('playButton').style.visibility = 'hidden';
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    ctx.canvas.width = 1700; //actual is 365
    ctx.canvas.height = 450; //actual is 215
    buildBricks(myPaddle.level);
    render();
    socket.emit('new paddle', myPaddle);
    socket.emit('new ball', myBall);
    socket.emit('new bricks', myBricks);
    gameLoop();
    //setInterval(function() { gameLoop() }, fps);
}

function gameLoop() {
    render();
}

function ballLost(){
    if(myBall.y>220){
        console.log('too low');
        if (myPaddle.numLives==1){
            //GAME OVER
            myPaddle.gamePlaying=false;
            myPaddle.numLives=0;
            myBall.y = 200;
            ctx.fillStyle = "#000";
            ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = "#fff";
            ctx.font = "20px Georgia";
            var message= "Lives: "+ myPaddle.numLives;
            ctx.font = "100px Georgia";
            var message= "GAME OVER";
            ctx.fillStyle = "#A12E33";
            ctx.fillText(message, 550, 200);
            myPaddle.btn=true;
            socket.emit("round over", myPaddle);
        }
        else if (myPaddle.numLives>1){
        resetPB();
        }
    }
    
}

function resetPB(){
    myPaddle.x = 100;//reset paddle position
    myPaddle.y = 200;
    myBall.x = 125;//reset ball position
    myBall.y = 187;
    myBall.xVelocity = 0;//reset ball velocity
    myBall.yVelocity = 0;
    myPaddle.numLives=myPaddle.numLives-1;
    socket.emit("new ball", myBall);
    socket.emit('new paddle', myPaddle);
    
}

function gameOver(){
            myPaddle.x = 100;//reset paddle position
            myPaddle.y = 200;
            myBall.x = 125;//reset ball position
            myBall.y = 187;
            myBall.xVelocity = 0;//reset ball velocity
            myBall.yVelocity = 0; 
            ctx.fillStyle = "#000";
            ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = "#fff";
            ctx.font = "20px Georgia";
            var message= "Lives: "+ myPaddle.numLives;
            ctx.font = "100px Georgia";
            var message= "GAME OVER";
            ctx.fillStyle = "#A12E33";
            ctx.fillText(message, 550, 200);
            if(!document.getElementById("gameOver-btn")){
                 document.getElementById("body").appendChild(document.createElement("br"));
            var newButton = document.createElement("button");
            newButton.innerHTML = "Play Again";
            newButton.className = "btn btn-primary btn-md room-btn";
            var id = "gameOver-btn";
            newButton.setAttribute("id", id);
            document.getElementById("body").appendChild(newButton);
            newButton.addEventListener("click", restartGame);//need to reset the ctx in the restartGame function, else good
            socket.emit("update stats", myPaddle);
            socket.emit("round over", myPaddle);
            }          
}

function levelCompleted(){
    myPaddle.gamePlaying=false; //we might also have to emit to the socket.
    myPaddle.level++;
    myPaddle.x = 100;//reset paddle position
    myPaddle.y = 200;
    myBall.x = 125;//reset ball position
    myBall.y = 187;
    myBall.xVelocity = 0;//reset ball velocity
    myBall.yVelocity = 0; 
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Georgia";
    var message= "Lives: "+ myPaddle.numLives;
    ctx.font = "100px Georgia";
    var message= "LEVEL COMPLETED";
    ctx.fillStyle = "#A12E33"
    ctx.fillText(message, 450, 200);
    if(!document.getElementById("nextLevel-btn")){
         document.getElementById("body").appendChild(document.createElement("br"));
    var newButton = document.createElement("button");
    newButton.innerHTML = "Next Level";
    newButton.className = "btn btn-primary btn-md room-btn";
    var id = "nextLevel-btn";
    newButton.setAttribute("id", id);
    document.getElementById("body").appendChild(newButton);
    newButton.addEventListener("click", restartGame);//need to reset the ctx in the restartGame function, else good
    socket.emit("update stats", myPaddle);
    socket.emit("round over", myPaddle);
    }
   }

function buildBricks(level){
    myBricks=[];
    if(level===1){
        for(i = 0; i < 20; i++){
        var xCoord = (i+1)*75;
        var yCoord = 50;
        if(i >= 10){
            xCoord = (i-9)*75;
            yCoord = 80;
        }
        myBricks[i] = new Brick(xCoord, yCoord);
        }
    }
    else if(level===2){
        for(i = 0; i < 30; i++){
        var xCoord = (i+1)*75;
        var yCoord = 50;
        if(i >= 10 && i<20){
            xCoord = (i-9)*75;
            yCoord = 80;
        }
        if(i>=20){
            xCoord = (i-19)*75;
            yCoord = 110;
        }
        myBricks[i] = new Brick(xCoord, yCoord);
        }
    }
    else if(level===3){
        for(i = 0; i < 40; i++){
        var xCoord = (i+1)*75;
        var yCoord = 50;
        if(i >= 10 && i<20){
            xCoord = (i-9)*75;
            yCoord = 80;
        }
        if(i>=20 && i<30){
            xCoord = (i-19)*75;
            yCoord = 110;
        }
        if(i>=30){
            xCoord = (i-29)*75;
            yCoord = 140;
        }
        myBricks[i] = new Brick(xCoord, yCoord);
        }
    }
    else{

    }
}

function restartGame(){
    if(document.getElementById("gameOver-btn")){
        document.getElementById("gameOver-btn").remove();//delete btn 
    }
    if(document.getElementById("nextLevel-btn")){
        document.getElementById("nextLevel-btn").remove();//delete btn 
    }
    // d
    myPaddle.gamePlaying = true; 
    myPaddle.numLives=3;
    buildBricks(myPaddle.level);//New Set of Bricks
    socket.emit("new ball", myBall);
    socket.emit("new paddle", myPaddle);
    socket.emit("new bricks", myBricks);
    socket.emit("restart game", myPaddle);
}

function render(){
    // draw black background
    if(myPaddle.gamePlaying){
        ctx.fillStyle = "#000";
        ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "20px Georgia";
        var message= "Lives: "+ myPaddle.numLives;
        ctx.fillStyle = "#fff";
        ctx.fillText(message, 10, 50);
        // draw objects
        renderPaddle();
        renderBall();
        if(!myBricks[0]){
            levelCompleted();
        }
        for(brick in myBricks){
            renderBrick(myBricks[brick]);
        }
    }
}

function renderPaddle() {
   drawPaddle(ctx, myPaddle);
}

function renderBall() {
    drawBall(ctx, myBall);
}

function renderBrick(brick) {
    if(brick.visible){
        drawBrick(ctx, brick);
    }
}


socket.on("update paddle", function(data){
    myPaddle.x = data.x;
    render();
    // console.log('myBall: ' + myBall.);
    // console.log('myPaddle: ' + myPaddle);
});

socket.on("update ball", function(data){
    myBall.x = data.x;
    myBall.y = data.y;
    myBall.xVelocity = data.xVelocity;
    myBall.yVelocity = data.yVelocity;
    render();
});

socket.on("update bricks", function(data){
    myBricks = data;
    render();
});

socket.on("paddle data", function(data){
    myPaddle=data;
});

var direction = "none";

$(document).bind('keydown', function(e) {
    var code = e.keyCode || e.which;
    if(((myPaddle.x)<=0)){
        //
        switch(code) {
        // right or d
        case 39:
        case 68:
            // move right
            direction = "right";
            break;
        // left or a
        case 37:
        case 65:
            // move left
            direction = "none";
            break;
        }
    }
    else if(((myPaddle.x+myPaddle.width)>=875)) {
        switch(code) {
        // left or a
        case 37:
        case 65:
            // move left
            direction = "left";
            break;
        // right or d
        case 39:
        case 68:
            // move right
            direction = "none";
            break;
        }
    }
    else{
        switch(code) {
        // right or d
        case 39:
        case 68:
            // move right
            direction = "right";
            break;
         // left or a
        case 37:
        case 65:
            // move left
            direction = "left";
            break;
        }
    }
});

$(document).bind('keyup', function(e) {
    var code = e.keyCode || e.which;
    switch(code) {
        // right or d
        case 39:
        case 68:
            // move right
            direction = "none";
            break;
         // left or a
        case 37:
        case 65:
            // move left
            direction = "none";
            break;
    }
});

    setInterval(function(){
            ballLost();
            if(myPaddle.btn){
                myPaddle.btn=false;
                gameOver();
            }
    }, 500);
    setInterval(function(){
            if(direction == "right"){
                socket.emit("paddle right", myPaddle);
            } else if(direction == "left"){
                socket.emit("paddle left", myPaddle);
            } else{
                
            }
    }, fps);


//init();
//render();