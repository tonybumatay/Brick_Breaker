// paddle setup
var paddlePic = new Image();
paddlePic.src = ('/img/paddle.jpg');
// paddlePic.setAttribute("id","myPaddle");


var Paddle = function () {
	this.x = 100;
	this.y = 200;

	this.height = 12;
	this.width = 70;
	this.numLives=3;
	this.gamePlaying=true;
	this.btn=false;
	this.level=1;
	this.brickScore=0;
	this.loggedIn = false;
}

drawPaddle = function(ctx, paddle) {
	// stores current coordinate system
    ctx.save();

    // shift coordinate system and draw
    ctx.translate(paddle.x, paddle.y);
    ctx.drawImage(paddlePic, paddle.x, paddle.y, paddle.width, paddle.height);

    // return to old coordinate system
    ctx.restore();
}

