class Entity {
    constructor(stage, anims, params) {
        this.animations = {};
        for (var anim in anims) {
            this.animations[anim] = new PIXI.extras.MovieClip(anims[anim]);
            this.animations[anim].anchor.set(0.5);
            this.animations[anim].animationSpeed = params.anims[anim] && params.anims[anim].speed ? params.anims[anim].speed : 0.2;
            if(params.anims[anim] && params.anims[anim].width !== undefined){
                this.animations[anim].width = params.anims[anim].width
            }
            if(params.anims[anim] && params.anims[anim].height !== undefined){
                this.animations[anim].height = params.anims[anim].height
            }
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
        this.effets = []
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
    addEffect(effet){
        if(this.effets.includes(effet))
            return
        console.log("new effet", effet)
        this.effets.push(effet)
    }
    removeEffect(effet){
        this.effets.splice(entity.effets.indexOf(effet, 1))
    }
    play(camPos, charPos) {
        //this.animation.x += this.speedX;
        //this.animation.y += this.speedY;
        //var futurEtat = "";
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
        } else if (this.effets.includes("put") && !this.animation.playing){
            this.speedX = 0;
            this.switchAnim('put');
            this.removeEffect("catch")
            this.animation.onComplete = ()=>{
                
                this.addEffect("suppr")
            }
        }else if (this.etat == "catch" && !this.effets.includes("put")){
            this.speedX = 0;
            this.switchAnim('catch');
            this.animation.onComplete = ()=>{
                this.addEffect("catch")
                //this.etat = "lookup"
            }
        }else if (this.effets.includes("top")){
           this.speedX = 0;
           if(this.etat == "lookup"){
               this.removeEffect("top")
               this.addEffect("tobogan")
               this.switchAnim("tobogan")
               this.speedX = 4;
                this.speedY = 2;
                console.log("tobogan ",this.effets, this.effets.length)
           }
        }else if (this.etat == "lookup" && this.speedX == 0){
            this.switchAnim('lookup');
        }else if (this.effets.includes("climb")){
            this.switchAnim('climb');
            this.speedY = 1;
            this.speedX = -2;
            this.animation.onComplete = ()=>{
                this.removeEffect("climb")
                //console.log("called again")
                this.addEffect("down")
                this.speedY = 0;
                this.speedX = 0;
            }
        }else if (this.effets.includes("down") && this.speedX != 0){
            this.switchAnim('getup');
            this.speedY = -0.5;
            this.speedX = 0;
            //console.log("pre remove effect", this.effets.length, this.getY());
            this.removeEffect("down")
            this.animation.onComplete = ()=>{
                this.speedY = 0;
                console.log("cicle chute terminé", this.effets, this.getY());
                this.switchAnim('stand');
            }
        }else if (this.effets.includes("cloudClimb")){
            this.switchAnim("cloudClimb")
            this.speedY = -2;
            this.speedX = 2.5;
            this.animation.onComplete = ()=>{
                this.removeEffect("cloudClimb")
                this.addEffect("top")
                this.speedY = 0;
                console.log("cicle montée terminé");
            }
        }else if (this.effets.includes("tobogan")){
            if(this.speedX > 1){
                this.speedX += -0.1
            }
            console.log("test", this.getY())
           if(this.getY() >= 250){
               console.log("good")
               this.speedY = 0;
               this.speedX = 0;
               this.removeEffect("tobogan")
               this.switchAnim('stand');
           }
        }else if (this.etat == "out"){
            this.speedX = 0;
            this.switchAnim("outCloud");
            this.animation.onComplete = ()=>{
                this.etat = "pop"
                this.switchAnim('stand');
            }
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
        for(var effet of charPos.effets){
            this.addEffect(effet);
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
            x: this.getX(),
            y: this.getY(),
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
            etat: this.etat,
            effets:JSON.parse(JSON.stringify(this.effets))
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

    var put = [];
    for (var i = 1; i <= 4; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        put.push(PIXI.Texture.fromFrame('put0' + i + '.png'));
    }

    var getup = [];
    for (var i = 1; i <= 3; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        getup.push(PIXI.Texture.fromFrame('getup0' + i + '.png'));
    }

    var climb = [];
    for (var i = 1; i <= 4; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        climb.push(PIXI.Texture.fromFrame('climb0' + i + '.png'));
    }

    var cloudClimb = [];
    for (var i = 1; i <= 6; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        cloudClimb.push(PIXI.Texture.fromFrame('cloud_climb0' + i + '.png'));
    }

    var outCloud = [];
    for (var i = 1; i <= 3; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        outCloud.push(PIXI.Texture.fromFrame('cloud_out0' + i + '.png'));
    }

    var lookup = [PIXI.Texture.fromFrame('lookup.png')];
    var tobogan = [PIXI.Texture.fromFrame('tobogan.png')];

    var anims = {};
    anims['walkLeft'] = walkLeft;
    anims['walk'] = walk;
    anims['stand'] = stand;
    anims['standLeft'] = standLeft;
    anims['lookup'] = lookup;
    anims['catch'] = catchAnim;
    anims['push'] = pushAnim;
    anims['pushLeft'] = pushLeftAnim;
    anims['put'] = put;
    anims['getup'] = getup;
    anims['climb'] = climb;
    anims['cloudClimb'] = cloudClimb;
    anims['outCloud'] = outCloud;
    anims['tobogan'] = tobogan;

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
            put: {
                width: 135,
                height: 260,
                speed: 0.05,
                loop: false
            },
            climb: {
                speed: 0.1,
                loop: false
            },
            getup: {
                width: 115,
                height: 230,
                speed: 0.05,
                loop: false
            },
            outCloud: {
                width: 115,
                height: 230,
                speed: 0.05,
                loop: false
            },
            cloudClimb: {
                width: 115,
                height: 245,
                speed: 0.05,
                loop: false
            },
            catch: {
                speed: 0.08,
                loop: false
            }
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
    var space = keyboard(32);

    var ctrl = keyboard(17);

    space.press = function () {
        entity.etat = "out";
    };
    space.release = function () {
        entity.etat = ""
    };

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
        entity.removeEffect("catch");
        entity.removeEffect("catched")
        console.log("entity effets", entity.effets)
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