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
    play(camPos, charPos) {
        //this.animation.x += this.speedX;
        //this.animation.y += this.speedY;
        //var futurEtat = "";
        this.x = charPos.x;
        this.y = charPos.y;
        charPos.etats.sort(() => (a, b) => {
            return this.etats[b.name].priority - this.etats[a.name].priority
        })

        if (charPos.etats[0]) {
            console.log("choix etat a proposer : ", charPos.etats[0], charPos.etats)
            this.switchEtat(charPos.etats[0].name, charPos.etats[0].param);
        }
        //console.log("pouet pouet frame state : ", this.animation._currentTime, this.animation.currentFrame, this.animation.totalFrames)
        
        this.etat.runFunc(this, charPos.effets, this.etat.param)
        this.setScreenX((charPos.x - (camPos.x - camPos.boundaryX))*camPos.scale);
        this.setScreenY((charPos.y - (camPos.y - camPos.boundaryY))*camPos.scale);
        //this.animation.scale.x = camPos.scale;
        //this.animation.scale.y = camPos.scale;

    }
    switchEtat(etat, param) {
        console.log("nouvel etat : ", etat, this.etat, this.etats[etat])
        if (this.etats[etat] && this.etat.priority < this.etats[etat].priority) {
            this.applyEtat(etat, param);
        } else if (etat === "none" && !(this.etat.unstopable && !this.animFinished)) {
            this.applyEtat(this.defaultEtat, param);
        } else if (!this.etats[etat] && etat !== "none") {
            console.error("etat non defini : ", etat, this.etats, this.etats[etat])
        }
    }
    applyEtat(etat, param) {
        if (this.etat) {
            this.etat.endFunc(this, this.etat.param)
        }
        if (!this.etats[etat]) {
            console.error("etat non defini : ", etat, this.etats, this.etats[etat])
            return;
        }
        this.etatName = etat;
        this.etat = this.etats[etat];
        this.etat.param = param ? param : {};
        this.switchAnim(this.etat.animation, this.etat.animParam)
        this.etat.startFunc(this, param);


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
    switchAnim(anim, param) {
        if (this.animName != anim) {
            this.animFinished = false;
            if (this.animation) {
                this.animation.stop()
                this.stage.removeChild(this.animation);
            };
            this.animation = this.animations[anim];
            this.animation.gotoAndPlay(1);
            if (param) {
                this.animation.animationSpeed = param.speed ? param.speed : 0.2;
                if (param.width !== undefined) {
                    this.animation.width = param.width
                }
                if (param.height !== undefined) {
                    this.animation.height = param.height
                }
                this.animation.zIndex = param.zIndex ? param.zIndex : 1;
            }
            
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
            etatParam: this.etat.param,
            animFinished: this.animFinished,
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
    for (var i = 1; i <= 3; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        climb.push(PIXI.Texture.fromFrame('climb0' + i + '.png'));
    }

    var sit = [];
    for (var i = 4; i <= 4; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        sit.push(PIXI.Texture.fromFrame('climb0' + i + '.png'));
    }

    var cloudClimb = [];
    for (var i = 1; i <= 2; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        cloudClimb.push(PIXI.Texture.fromFrame('cloud_climb0' + i + '.png'));
    }
    cloudClimb.push(PIXI.Texture.fromFrame('cloud_climb0' + 2 + '.png'));
    cloudClimb.push(PIXI.Texture.fromFrame('getup0' + 3 + '.png'));
    cloudClimb.push(PIXI.Texture.fromFrame('getup0' + 3 + '.png'));
    cloudClimb.push(PIXI.Texture.fromFrame('getup0' + 3 + '.png'));
    var mountClimb = [];
    for (var i = 3; i <= 6; i++) {
        // magically works since the spritesheet was loaded with the pixi loader
        mountClimb.push(PIXI.Texture.fromFrame('cloud_climb0' + i + '.png'));
    }

    var outCloud = [];
    for (var i = 4; i > 1; i--) {
        // magically works since the spritesheet was loaded with the pixi loader
        outCloud.push(PIXI.Texture.fromFrame('put0' + i + '.png'));
    }
    for (var i = 3; i > 0; i--) {
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
    anims['sit'] = sit;
    anims['climb'] = climb;
    anims['cloudClimb'] = cloudClimb;
    anims['mountClimb'] = mountClimb;
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
                animSpeed = animSpeed / 2
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
            if (down.isDown) {
                player.switchEtat("lookUp")
                return;
            }
            player.animation.animationSpeed = animSpeed;
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
                animSpeed = animSpeed / 2
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
            if (down.isDown) {
                player.switchEtat("lookUp")
                return;
            }
            player.animation.animationSpeed = animSpeed;
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
        startFunc: function (player, param) {
            player.setspeedX(0)
        },
        runFunc: function (player, effets, param) {
            if (right.isDown) {
                player.switchEtat("walkRight")
                return;
            }
            if (left.isDown) {
                player.switchEtat("walkLeft")
                return;
            }
            if (down.isDown) {
                player.switchEtat("lookUp")
                return;
            }
            if (up.isDown) {
                this.param.up = true;
            } else {
                this.param.up = false;
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
            if (down.isDown) {
                player.switchEtat("lookUp")
                return;
            }
            if (up.isDown) {
                this.param.up = true;
            } else {
                this.param.up = false;
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
            if (up.isDown) {
                player.switchEtat("catch")
                return;
            }
            if (down.isUp) {
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
            if (player.animFinished && up.isUp) {
                player.switchEtat("none")
                return;
            }
        },
        endFunc: function () {

        }
    }

    etats["pushRight"] = {
        animation: 'push',
        animParam: {
            speed: 0.2
        },
        priority: 3,
        startFunc: function () {

        },
        runFunc: function (player, effets) {
            var speedX = 1;
            var animSpeed = this.animParam.speed
            if (effets.includes("slow")) {
                speedX = speedX / 2;
                animSpeed = animSpeed / 2
            }
            if (right.isUp) {
                player.switchEtat("none")
                player.switchEtat("standRight")
                return;
            }
            if (ctrl.isUp || !effets.includes("near_coffer")) {
                player.switchEtat("none")
                player.switchEtat("walkRight")
                return;
            }
            player.animation.animationSpeed = animSpeed;
            player.setspeedX(speedX)
        },
        endFunc: function () {

        }
    }

    etats["pushLeft"] = {
        animation: 'pushLeft',
        animParam: {
            speed: 0.2
        },
        priority: 3,
        startFunc: function () {

        },
        runFunc: function (player, effets) {
            var speedX = -1;
            var animSpeed = this.animParam.speed
            if (effets.includes("slow")) {
                speedX = speedX / 2;
                animSpeed = animSpeed / 2
            }
            if (left.isUp) {
                player.switchEtat("none")
                player.switchEtat("standLeft")
                return;
            }
            if (ctrl.isUp || !effets.includes("near_coffer")) {
                player.switchEtat("none")
                player.switchEtat("walkLeft")
                return;
            }
            player.animation.animationSpeed = animSpeed;
            player.setspeedX(speedX)
        },
        endFunc: function () {

        }
    }

    etats.put = {
        animation: 'put',
        loop: false,
        animParam: {
            speed: 0.05
        },
        priority: 5,
        startFunc: function () {

        },
        runFunc: function (player) {
            if (player.animFinished) {
                player.switchEtat("none")
                player.switchEtat("standLeft")
                return;
            }
        },
        endFunc: function () {

        }
    }

    etats.getUp = {
        animation: 'getup',
        loop: false,
        animParam: {
            speed: 0.1
        },
        priority: 7,
        startFunc: function (player) {
            player.setspeedY(-1)
            player.setspeedX(0)
        },
        runFunc: function (player) {
            //console.log("getUp up", player.y, player.speedY)
            if (player.y <= 250 && player.speedY != 0) {
                player.setspeedY(0);
                //console.log("getUp stop up")
                player.y = 250;
            }
            if (player.animFinished) {
                player.setspeedY(0);
                player.y = 250;
                player.switchEtat("none");
                player.switchEtat("standRight")
                return;
            }
        },
        endFunc: function (player) {
            //console.log("getUp fin : ", player.y)
        }
    }

    etats.sit = {
        animation: 'sit',
        animParam: {
            speed: 0.1
        },
        priority: 6,
        startFunc: function (player, param) {
            //console.log("sit cptFall", this.cptFall)
        },
        runFunc: function (player) {
            //console.log("sit cptFall run", this.cptFall, player.speedY)
            if (player.y >= 300 && (player.speedY != 0 || player.speedX != 0)) {
                player.setspeedY(0)
                player.setspeedX(0)
                //console.log("y on stop climb : ", player.y)
            }
            if (right.isDown && !(player.speedY != 0 || player.speedX != 0)) {
                player.switchEtat("getUp")
                return;
            }
        },
        endFunc: function () {

        }
    }

    etats.climb = {
        animation: 'climb',
        loop: false,
        animParam: {
            width: 135,
            height: 250,
            speed: 0.1
        },
        priority: 5,
        startFunc: function (player) {
            player.setspeedX(0)
            this.cptFall = 0
            //console.log("y on start climb : ", player.y)
        },
        runFunc: function (player, effets, param) {
            if (player.animation.currentFrame == 1) {
                player.setspeedX(-2)
            }
            if (player.animation.currentFrame == 2) {
                player.setspeedY(2)
            }
            this.cptFall += player.speedY;
            if (this.cptFall > 80 && player.speedY != 0) {
                player.setspeedY(0)
                //console.log("y on stop climb : ", player.y)
            }
            if (player.animFinished) {
                player.switchEtat("sit")
                return;
            }
        },
        endFunc: function (player) {
            //player.setspeedY(0)
            //player.setspeedX(0)
            //console.log("x,y on stop climb : ", player.x, player.y)
        }
    }

    etats.mountClimb = {
        animation: 'mountClimb',
        loop: false,
        animParam: {
            width: 95,
            height: 220,
            speed: 0.03
        },
        priority: 4,
        startFunc: function (player) {
            player.setspeedY(-1.5)
            player.setspeedX(0.3)
            player.x += 60;
        },
        runFunc: function (player, effets, param) {
            if(player.animation.currentFrame == 2){
                player.setspeedX(1.5)
            }
            if(player.x > param.x +5){
                player.setspeedX(0)
            }
            if(player.y < param.y - player.getBound().height/2 +95){
                player.setspeedY(0)
            }
            if (player.animFinished) {
                player.x = param.x +5
                player.y = param.y - player.getBound().height/2 +95
                player.setspeedX(0);
                player.setspeedY(0);
                if(left.isDown){
                    player.setspeedX(-5)
                    player.switchEtat("climb")
                }
                if(right.isDown){
                    player.switchEtat("tobogan", param)
                }
            }
        },
        endFunc: function () {

        }
    }

    etats.cloudClimb = {
        animation: 'cloudClimb',
        loop: false,
        removeOnFinish: true,
        animParam: {
            width: 105,
            height: 235,
            speed: 0.1,
            loop: false
        },
        priority: 4,
        startFunc: function (player) {
            player.setspeedY(-3)
            player.setspeedX(1)
        },
        runFunc: function (player, effets, param) {
            console.log("position relative : ", player.getBound(), param)
            if(player.x >= param.x-10){
                player.setspeedX(0);
            }
            if(player.y>= param.y + player.getBound().height/2 -22){
                player.setspeedY(0);
            }
            if (player.animation.currentFrame == 3) {
                player.x = param.x
                player.y = param.y - player.getBound().height/2 +52
                player.setspeedX(0);
                player.setspeedY(0);
            }
        },
        endFunc: function (player, param) {
            console.log("position relative finale: ", player.getBound(), param)
            player.x = param.x
            player.y = param.y - player.getBound().height/2 +12
        }
    }

    etats.outCloud = {
        animation: 'outCloud',
        loop: false,
        removeOnFinish: true,
        animParam: {
            width: 115,
            height: 230,
            speed: 0.05
        },
        priority: 5,
        startFunc: function () {},
        runFunc: function () {},
        endFunc: function () {}
    }

    etats.tobogan = {
        animation: 'tobogan',
        animParam: {},
        priority: 5,
        startFunc: function (player) {
            player.setspeedX(3)
            player.setspeedY(1)
        },
        runFunc: function (player, effets, param) {
            if(player.x > param.x + 60){
                player.setspeedX(0.50)
                player.setspeedY(2)
            }
            if(player.y > 250){
                player.setspeedY(0.5)
                player.setspeedX(2)
                player.switchEtat("sit")
            }
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
