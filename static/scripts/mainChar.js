class Entity {
    constructor(stage, anims, params) {
        this.animations = {};
        for (var anim in anims) {
            this.animations[anim] = new PIXI.extras.MovieClip(anims[anim]);
            this.animations[anim].anchor.set(0.5);
            this.animations[anim].animationSpeed = params.anims[anim] && params.anims[anim].speed ? params.anims[anim].speed : 0.2;
            this.animations[anim].zIndex = params.zIndex ? params.zIndex : 1;
            this.animations[anim].loop = params.anims[anim] && params.anims[anim].loop !== undefined ? params.anims[anim].loop : true;
        }
        this.animName = params.defaultAnim;
        this.animation = this.animations[params.defaultAnim];
        this.speedX = 0;
        this.speedY = 0;
        this.animation.gotoAndPlay(0);
        this.x = params.x ? params.x : 0;
        this.y = params.y ? params.y : 0;
        stage.addChild(this.animation);
        this.stage = stage;
    }
    getScreenX() {
        return this.animation.x;
    }
    getScreenY() {
        return this.animation.y;
    }
    setScreenX(x) {
        //console.log("set X :",x)
        this.animation.x = x;
    }
    setScreenY(y) {
        //console.log("set Y :",y)
        this.animation.y = y;
    }
    getspeedX() {
        return this.speedX;
    }
    getspeedY() {
        return this.speedY;
    }
    setspeedX(speedX) {
        this.speedX = speedX;
    }
    setspeedY(speedY) {
        this.speedY = speedY;
    }
    play(camPos, charPos) {
        //this.animation.x += this.speedX;
        //this.animation.y += this.speedY;
        if (this.etat == "push") {
            if (this.speedX < 0 && this.animName != "pushLeft") {
                this.switchAnim('pushLeft');
            } else if (this.speedX > 0 && this.animName != "push") {
                this.switchAnim('push');
            } else if (this.speedX == 0 && this.animName == "push") {
                this.switchAnim('stand');
            } else if (this.speedX == 0 && this.animName == "pushLeft") {
                this.switchAnim('standLeft');
            }
        } else if (this.etat == "catch"){
            this.speedX = 0;
            this.switchAnim('catch');
        } else if (this.etat == "lookup" && this.speedX == 0){
            this.switchAnim('lookup');
        } else {
            if (this.speedX < 0 && this.animName != "walkLeft") {
                this.switchAnim('walkLeft');
            } else if (this.speedX > 0 && this.animName != "walk") {
                this.switchAnim('walk');
            } else if (this.speedX == 0 && this.animName == "walk") {
                this.switchAnim('stand');
            } else if (this.speedX == 0 && this.animName == "walkLeft") {
                this.switchAnim('standLeft');
            }
        }
        this.setScreenX(charPos.x - (camPos.x - camPos.boundaryX));
        this.x = charPos.x;
        this.setScreenY(charPos.y - (camPos.y - camPos.boundaryY));
        this.y = charPos.y;
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
            this.stage.updateLayersOrder();
        }
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }

    getBound() {
        var bound = {
            x: this.getScreenX(),
            y: this.getScreenY(),
            width: this.animation.width,
            height: this.animation.height
        }

        return bound;
    }

    getAttitude() {
        return {
            bound: this.getBound(),
            x: this.getX(),
            y: this.getY(),
            speedX: this.getspeedX(),
            speedY: this.getspeedY(),
            etat: this.etat
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

    var pushAnim = [];
    for (var i = 1; i <= 5; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        pushAnim.push(PIXI.Texture.fromFrame('push0' + i + '.png'));
    }

    var pushLeftAnim = [];
    for (var i = 1; i <= 5; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        pushLeftAnim.push(PIXI.Texture.fromFrame('pushLeft0' + i + '.png'));
    }

    var lookup = [PIXI.Texture.fromFrame('lookup.png')];

    var anims = {};
    anims['walkLeft'] = walkLeft;
    anims['walk'] = walk;
    anims['stand'] = stand;
    anims['standLeft'] = standLeft;
    anims['lookup'] = lookup;
    anims['catch'] = catchAnim;
    anims['push'] = pushAnim;
    anims['pushLeft'] = pushLeftAnim;

    var params = {
        y: 250,
        x: renderer.width / 2,
        zIndex: 2,
        defaultAnim: 'stand',
        anims: {
            stand: {
                speed: 0.1
            },
            standLeft: {
                speed: 0.1
            },
            catch: {
                speed: 0.1,
                loop: false
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

    var ctrl = keyboard(17);

    right.press = function () {
        entity.speedX = 1;
    };
    right.release = function () {

        if (!left.isDown) {
            entity.speedX = 0;
        }
    };
    //Left arrow key `press` method
    left.press = function () {
        entity.speedX = -1;
    };
    //Left arrow key `release` method
    left.release = function () {
        if (!right.isDown) {
            entity.speedX = 0;
        }
    };

    up.press = function () {
        entity.etat = "catch";
    };

    up.release = function () {
        entity.etat = "lookup";
    };

    down.press = function () {
        entity.etat = "lookup";
    };
    //Left arrow key `release` method
    down.release = function () {
        entity.etat = ""
    };



    ctrl.press = function () {
        //console.log("unlock")
        entity.etat = "push";
    };
    //Left arrow key `release` method
    ctrl.release = function () {
        //console.log("lock")
        entity.etat = "";
    };
}