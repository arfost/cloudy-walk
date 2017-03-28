class Entity {
    constructor(stage, anims, params) {
        this.animations = {};
        for (var anim in anims) {
            this.animations[anim] = new PIXI.extras.MovieClip(anims[anim]);
            this.animations[anim].anchor.set(0.5);
            this.animations[anim].animationSpeed = params.anims[anim] && params.anims[anim].speed ? params.anims[anim].speed : 0.2;
            this.animations[anim].zIndex = params.zIndex ? params.zIndex : 1;
        }
        this.animName = params.defaultAnim;
        this.animation = this.animations[params.defaultAnim];
        this.vx = 0;
        this.vy = 0;
        this.animation.gotoAndPlay(0);
        this.animation.x = params.x ? params.x : 0;
        this.animation.y = params.y ? params.y : 0;
        stage.addChild(this.animation);
        this.stage = stage;
        this.lock = true;
    }
    getX() {
        return this.animation.x;
    }
    getY() {
        return this.animation.y;
    }
    setX(x) {
        this.animation.x = x;
    }
    setY(y) {
        this.animation.y = y;
    }
    getVX() {
        return this.vx;
    }
    getVY() {
        return this.vy;
    }
    setVX(vx) {
        this.vx = vx;
    }
    setVY(vy) {
        this.vy = vy;
    }
    play() {
        //this.animation.x += this.vx;
        //this.animation.y += this.vy;
        if (this.vx < 0 && this.animName != "walkLeft") {
            this.switchAnim('walkLeft');
        } else if (this.vx > 0 && this.animName != "walk") {
            this.switchAnim('walk');
        } else if (this.vx == 0 && this.animName == "walk") {
            this.switchAnim('stand');
        } else if (this.vx == 0 && this.animName == "walkLeft") {
            this.switchAnim('standLeft');
        }
        if(!this.lock){
            this.animation.x += this.vx;
            this.animation.x += this.vy;
        }
    }
    switchAnim(anim) {
        if (this.animName != anim) {
            this.animName = anim;
            var tmpX = this.animation.x;
            var tmpY = this.animation.y;
            this.animation.stop();
            this.stage.removeChild(this.animation);
            this.animation = this.animations[anim];
            this.animation.gotoAndPlay(0);
            this.animation.x = tmpX;
            this.animation.y = tmpY;
            this.stage.addChild(this.animation);
        }
    }

    getAttitude(){
        return {
            locked:this.lock,
            speedX:this.vx,
            speedY:this.vy
        }
    }
}

function initMainChar() {
    // create an array of textures from an image path
    var walk = [];
    for (var i = 6; i > 0; i--) {
        // magically works since the spritesheet was loaded with the pixi loader
        walk.push(PIXI.Texture.fromFrame('walk0' + i + '.png'));
    }

    // create an array of textures from an image path
    var walkLeft = [];
    for (var i = 6; i > 0; i--) {
        // magically works since the spritesheet was loaded with the pixi loader
        walkLeft.push(PIXI.Texture.fromFrame('walkLeft0' + i + '.png'));
    }

    var stand = [];
    for (var i = 1; i <= 3; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        stand.push(PIXI.Texture.fromFrame('stand0' + i + '.png'));
    }

    var standLeft = [];
    for (var i = 1; i <= 3; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        standLeft.push(PIXI.Texture.fromFrame('standLeft0' + i + '.png'));
    }

    var catchAnim = [];
    for (var i = 1; i <= 3; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        catchAnim.push(PIXI.Texture.fromFrame('catch0' + i + '.png'));
    }

    var lookup = [PIXI.Texture.fromFrame('lookup.png')];

    var anims = {};
    anims['walkLeft'] = walkLeft;
    anims['walk'] = walk;
    anims['stand'] = stand;
    anims['standLeft'] = standLeft;
    anims['lookup'] = lookup;
    anims['catch'] = catchAnim;

    var params = {
        y: 250,
        x: renderer.width / 2,
        zIndex: 1,
        defaultAnim: 'stand',
        anims: {
            stand: {
                speed: 0.1
            },
            standLeft: {
                speed: 0.1
            },
            catch: {
                speed: 0.1
            },
        }
    }

    entity = new Entity(stage, anims, params);
    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */

    var right = keyboard(39);
    var left = keyboard(37);
    var up = keyboard(38);
    var down = keyboard(40);
    var shift = keyboard(16);

    right.press = function () {
        entity.vx = 1;
    };
    right.release = function () {

        if (!left.isDown) {
            entity.vx = 0;
        }
    };
    //Left arrow key `press` method
    left.press = function () {
        entity.vx = -1;
    };
    //Left arrow key `release` method
    left.release = function () {
        if (!right.isDown) {
            entity.vx = 0;
        }
    };

    up.press = function () {
        entity.vx = 0;
        entity.switchAnim("lookup")
    };

    down.press = function () {
        entity.vx = 0;
        entity.switchAnim("catch")
    };
    //Left arrow key `release` method
    down.release = function () {
        entity.switchAnim("lookup")
    };

    shift.press = function () {
        console.log("unlock")
        entity.lock = false;
    };
    //Left arrow key `release` method
    shift.release = function () {
        console.log("lock")
        entity.lock = true;
    };
}