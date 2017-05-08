let todoPencil = (function (ctx) {
    const PENCIL_HEIGHT = 215;
    const PENCIL_WIDTH = 432;
    const POSITION_X = 0;
    const POSITION_Y = 0;
    const PENCIL_SPRITE_X_START = 30;
    const PENCIL_SPRITE_Y_START = 9.5;
    const PENCIL_SPEED = 500;
    const PENCIL_STEP = 240;
    const PLUS = 100;

    function Pencil(ctx) {
        let _ctx = ctx;

        this.getCtx = function(){
            return _ctx;
        }
    }
    Pencil.prototype.draw = function (){

        let context = this.getCtx().getContext("2d");
    	let image = new Image();
    	image.src = './images/pencil.png';
        let self = this;
        let start = PENCIL_SPRITE_Y_START;
        let end = 1100;

        image.onload = function() {
             drawTimer = window.setInterval(function() {
                context.clearRect(POSITION_X, POSITION_Y, PENCIL_WIDTH + PLUS, PENCIL_HEIGHT + PLUS);
                context.drawImage(image, PENCIL_SPRITE_X_START, start, PENCIL_WIDTH, PENCIL_HEIGHT, POSITION_X, POSITION_Y, PENCIL_WIDTH + PLUS , PENCIL_HEIGHT + PLUS);
                if (start >= end) {
                    start = PENCIL_SPRITE_Y_START;
                } else {
                    start += PENCIL_STEP;
                }
            }, PENCIL_SPEED);
        };
    };
    Pencil.prototype.pause = function (){
        let context = this.getCtx().getContext("2d");
    	let image = new Image();
    	image.src = './images/pencil.png';
        let plus = 100;

        image.onload = function() {
            clearInterval(drawTimer);
            context.clearRect(POSITION_X, POSITION_Y, PENCIL_WIDTH + PLUS, PENCIL_HEIGHT + PLUS);
            context.drawImage(image, PENCIL_SPRITE_X_START, PENCIL_SPRITE_Y_START, PENCIL_WIDTH, PENCIL_HEIGHT, POSITION_X, POSITION_Y, PENCIL_WIDTH + PLUS , PENCIL_HEIGHT + PLUS);
        };
    };
    Pencil.prototype.remove = function (){
        let context = this.getCtx().getContext("2d");
            clearInterval(drawTimer);
            context.clearRect(POSITION_X, POSITION_Y, PENCIL_WIDTH + PLUS, PENCIL_HEIGHT + PLUS);
    };
    return {
        create: function(ctx){
            return new Pencil(ctx)
        } ,
        draw: this.draw,
        pause: this.pause,
        remove: this.remove
    }
}());
