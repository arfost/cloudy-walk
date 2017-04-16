class Entity {
    constructor(stage, anims, etats, params) {
        this.animations = {};
        this.stage = stage;
        for (var anim in anims) {
            this.animations[anim] = new PIXI.extras.MovieClip(anims[anim]);
            this.animations[anim].anchor.set(0.5);

        }
        this.etats = etats;
        this.x = params.x ? params.x : 0;
        this.y = params.y ? params.y : 0;
        this.applyEtat(params.defaultEtat);
        this.defaultEtat = params.defaultEtat;
        this.speedX = 0;
        this.speedY = 0;
        
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
    addEffect(effet) {
        if (this.effets.includes(effet))
            return
        console.log("new effet", effet)
        this.effets.push(effet)
    }
    removeEffect(effet) {
        this.effets.splice(entity.effets.indexOf(effet, 1))
    }
    play(camPos, charPos) {
        //this.animation.x += this.speedX;
        //this.animation.y += this.speedY;
        //var futurEtat = "";

        charPos.etats.sort(() => (a, b) => {
            return this.etats[b.name].priority - this.etats[a.name].priority
        })
        
        if(charPos.etats[0]){
            console.log("choix etat a proposer : ", charPos.etats[0], charPos.etats)
            this.switchEtat(charPos.etats[0].name, charPos.etats[0].param);
        }
        console.log("pouet pouet frame state : ", this.animation._currentTime, this.animation.currentFrame, this.animation.totalFrames)
        this.etat.runFunc(this, charPos.effets, this.etatParam)
        this.setScreenX(charPos.x - (camPos.x - camPos.boundaryX));
        this.x = charPos.x;
        this.setScreenY(charPos.y - (camPos.y - camPos.boundaryY));
        this.y = charPos.y;
    }
    switchEtat(etat, param) {
        console.log("nouvel etat : ", etat, this.etat, this.etats[etat])
        if (this.etats[etat] && this.etat.priority < this.etats[etat].priority) {
            this.applyEtat(etat, param);
        } else if (etat === "none" && !(this.etat.unstopable && !this.animFinished))  {
            this.applyEtat(this.defaultEtat, param);
        } else if(!this.etats[etat] && etat !== "none") {
            console.error("etat non defini : ", etat, this.etats, this.etats[etat])
        }
    }
    applyEtat(etat, param) {
        if (this.etat) {
            this.etat.endFunc(this, param)
        }
        if(!this.etats[etat]){
            console.error("etat non defini : ", etat, this.etats, this.etats[etat])
            return;
        }
        this.etatName = etat;
        this.etatParam = param;
        this.etat = this.etats[etat];
        this.switchAnim(this.etat.animation)
        this.etat.startFunc(this, param);
        this.animation.animationSpeed = this.etat.animParam && this.etat.animParam.speed ? this.etat.animParam.speed : 0.2;
        if (this.etat.animParams && this.etat.animParam.width !== undefined) {
            this.animation.width = this.etat.animParam.width
        }
        if (this.etat.animParams && this.etat.animParam.height !== undefined) {
            this.animation.height = this.etat.animParam.height
        }
        this.animation.zIndex = this.etat.animParam && this.etat.animParam.zIndex ? this.etat.animParam.zIndex : 1;

        if (this.etat.loop === false) {
            this.animation.loop = false;
            if (this.etat.removeOnFinish) {
                this.animation.onComplete = () => {
                    this.switchEtat("none")
                }
            } else {
                this.animation.onComplete = () => {
                    this.animFinished = true;
                }
            }
        } else {
            this.animation.loop = true;
        }
    }
    switchAnim(anim) {
        if (this.animName != anim) {
            this.animFinished = false;
            if(this.animation) {
                this.animation.stop()
                this.stage.removeChild(this.animation);
            };
            this.animation = this.animations[anim];
            this.animation.x = NaN;
            this.animation.y = NaN;
            this.animation.gotoAndPlay(0);

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
            width: 130,
            height: 305
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
            etat: this.etatName,
            etatParam: this.etatParam,
            frameState: {
                current: this.animation.currentFrame,
                total: this.animation.totalFrames
            }
        }
    }
}

function initMainChar() {

    //declare touch with js num key
    var right = keyboard(39);
    var left = keyboard(37);
    var up = keyboard(38);
    var down = keyboard(40);
    var space = keyboard(32);

    var ctrl = keyboard(17);


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
        defaultEtat: 'standRight',
    }

    var etats = {}

    etats["walkLeft"] = {
        animation: 'walkLeft',
        animParam: {
            speed: 0.2
        },
        priority: 2,
        startFunc: function () {

        },
        runFunc: function (player, effets) {
            var speedX = -2;
            var animSpeed = this.animParam.speed
            if (effets.includes("slow")) {
                speedX = speedX / 2;
                animSpeed = animSpeed/2
            }
            if (effets.includes("near_coffer") && ctrl.isDown) {
                player.switchEtat("pushLeft")
                return;
            }
            if (left.isUp) {
                player.switchEtat("none")
                player.switchEtat("standLeft")
                return;
            }
            if (down.isDown){
                player.switchEtat("lookUp")
                return;
            }
            player.animation.speed = animSpeed;
            player.setspeedX(speedX)
        },
        endFunc: function (player, effets) {
            //player.setspeedX(0)
        }
    }

    etats["walkRight"] = {
        animation: 'walk',
        animParam: {
            speed: 0.2
        },
        priority: 2,
        startFunc: function (player, effets) {

        },
        runFunc: function (player, effets) {
            var speedX = 2;
            var animSpeed = this.animParam.speed
            if (effets.includes("slow")) {
                speedX = speedX / 2;
                animSpeed = animSpeed/2
            }
            if (effets.includes("near_coffer") && ctrl.isDown) {
                player.switchEtat("pushRight")
                return;
            }
            if (right.isUp) {
                player.switchEtat("none")
                player.switchEtat("standRight")
                return;
            }
            if (down.isDown){
                player.switchEtat("lookUp")
                return;
            }
            player.animation.speed = animSpeed;
            player.setspeedX(speedX)
        },
        endFunc: function (player, effets) {
            //player.setspeedX(0)
        }
    }

    etats["standRight"] = {
        animation: 'stand',
        animParam: {
            speed: 0.1
        },
        priority: 0,
        startFunc: function (player, effets) {
            player.setspeedX(0)
        },
        runFunc: function (player, effets) {
            if (right.isDown) {
                player.switchEtat("walkRight")
                return;
            }
            if (left.isDown) {
                player.switchEtat("walkLeft")
                return;
            }
            if (down.isDown){
                player.switchEtat("lookUp")
                return;
            }
        },
        endFunc: function (player, effets) {

        }
    }

    etats["standLeft"] = {
        animation: 'standLeft',
        animParam: {
            speed: 0.1
        },
        priority: 1,
        startFunc: function (player, effets) {

        },
        runFunc: function (player, effets) {
            if (right.isDown) {
                player.switchEtat("walkRight")
                return;
            }
            if (left.isDown) {
                player.switchEtat("walkLeft")
                return;
            }
            if (down.isDown){
                player.switchEtat("lookUp")
                return;
            }
        },
        endFunc: function (player, effets) {

        }
    }

    etats["lookUp"] = {
        animation: 'lookup',
        animParam: {},
        priority: 3,
        startFunc: function (player, effets) {
            player.setspeedX(0)
        },
        runFunc: function (player, effets) {
            if (up.isDown){
                player.switchEtat("catch")
                return;
            }
            if (down.isUp){
                player.switchEtat("none")
                return;
            }
        },
        endFunc: function () {

        }
    }

    etats["catch"] = {
        animation: 'catch',
        animParam: {
            speed: 0.08,
        },
        unstopable: true,
        loop: false,
        priority: 4,
        startFunc: function () {

        },
        runFunc: function (player, effets) {
            if(player.animFinished && up.isUp){
                player.switchEtat("none")
            }
        },
        endFunc: function () {

        }
    }

    etats["pushRight"] = {
        animation: 'push',
        animParam: {},
        priority: 3,
        startFunc: function () {

        },
        runFunc: function (player, effets) {
            var speedX = 1;
            var animSpeed = this.animParam.speed
            if (effets.includes("slow")) {
                speedX = speedX / 2;
                animSpeed = animSpeed/2
            }
            if (right.isUp) {
                player.switchEtat("none")
                player.switchEtat("standRight")
                return;
            }
            if (ctrl.isUp || !effets.includes("near_coffer")){
                player.switchEtat("none")
                player.switchEtat("walkRight")
                return;
            }
            player.animation.speed = animSpeed;
            player.setspeedX(speedX)
        },
        endFunc: function () {

        }
    }

    etats["pushLeft"] = {
        animation: 'pushLeft',
        animParam: {},
        priority: 3,
        startFunc: function () {

        },
        runFunc: function (player, effets) {
            var speedX = -1;
            var animSpeed = this.animParam.speed
            if (effets.includes("slow")) {
                speedX = speedX / 2;
                animSpeed = animSpeed/2
            }
            if (left.isUp) {
                player.switchEtat("none")
                player.switchEtat("standLeft")
                return;
            }
            if (ctrl.isUp || !effets.includes("near_coffer")){
                player.switchEtat("none")
                player.switchEtat("walkLeft")
                return;
            }
            player.animation.speed = animSpeed;
            player.setspeedX(speedX)
        },
        endFunc: function () {

        }
    }

    etats.put = {
        animation: 'put',
        loop: false,
        animParam: {
            width: 135,
            height: 260,
            speed: 0.05,
            loop: false
        },
        priority: 5,
        startFunc: function () {

        },
        runFunc: function (player) {
            if(player.animFinished){
                player.switchEtat("none")
                player.switchEtat("standLeft")
            }
        },
        endFunc: function () {

        }
    }

    etats.getUp = {
        animation: 'getup',
        animParam: {
            width: 95,
            height: 210,
            speed: 0.1,
            loop: false
        },
        priority: 1,
        startFunc: function () {

        },
        runFunc: function () {

        },
        endFunc: function () {

        }
    }

    etats.climb = {
        animation: 'climb',
        animParam: {
            width: 155,
            height: 290,
            speed: 0.2,
            loop: false
        },
        priority: 1,
        startFunc: function () {

        },
        runFunc: function () {

        },
        endFunc: function () {

        }
    }

    etats.cloudClimb = {
        animation: 'cloudClimb',
        animParam: {
            width: 155,
            height: 305,
            speed: 0.03,
            loop: false
        },
        priority: 1,
        startFunc: function () {

        },
        runFunc: function () {

        },
        endFunc: function () {

        }
    }

    etats.outCloud = {
        animation: 'outCloud',
        animParam: {
            width: 115,
            height: 230,
            speed: 0.05,
            loop: false
        },
        priority: 1,
        startFunc: function () {

        },
        runFunc: function () {

        },
        endFunc: function () {

        }
    }

    etats.tobogan = {
        animation: 'tobogan',
        animParam: {},
        priority: 1,
        startFunc: function () {

        },
        runFunc: function () {

        },
        endFunc: function () {

        }
    }

    entity = new Entity(stage, anims, etats, params);
    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
}
