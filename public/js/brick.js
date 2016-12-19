// paddle setup
var brickPic = new Image();
brickPic.src = ('/img/brick2.jpg');


var Brick = function (x, y) {
	this.x = x;
	this.y = y;

	this.height = 25;
	this.width = 50;
    this.visible = true;
}

drawBrick = function(ctx, brick) {
	// stores current coordinate system
    ctx.save();

    // shift coordinate system and draw
    ctx.translate(brick.x, brick.y);
    ctx.drawImage(brickPic, brick.x, brick.y, brick.width, brick.height);

    // return to old coordinate system
    ctx.restore();
}

