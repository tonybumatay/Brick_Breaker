// paddle setup
var ballPic = new Image();
ballPic.src = ('/img/whiteball.png');
// paddlePic.setAttribute("id","myPaddle");


var Ball = function () {
	this.x = 125;
	this.y = 187;
    this.xVelocity = 0;
    this.yVelocity = 0;

	this.height = 12;
	this.width = 12;
}

drawBall = function(ctx, ball) {
	// stores current coordinate system
    ctx.save();

    // shift coordinate system and draw
    ctx.translate(ball.x, ball.y);
    ctx.drawImage(ballPic, ball.x, ball.y, ball.width, ball.height);

    // return to old coordinate system
    ctx.restore();
}

