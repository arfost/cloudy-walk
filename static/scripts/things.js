class Thing {

    constructor(stage, pos, img, size) {
        this.name = img;
        this.stage = stage;
        this.pos = pos;
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(img + '.png'));
        this.sprite.width = size.width;
        this.sprite.height = size.height;
        this.sprite.zIndex = pos.zIndex;
        this.isAdded = false;
    }

    play(camPos, charAttitude) {
        if (
            ((camPos.x - camPos.boundaryX) < this.pos.x + this.sprite.width && (camPos.x + camPos.boundaryX) > this.pos.x) &&
            ((camPos.y - camPos.boundaryY) < this.pos.y + this.sprite.height && (camPos.y + camPos.boundaryY) > this.pos.y)) {
            if (!this.isAdded) {
                this._addSelf(camPos)
            } else {

                this.turn(camPos, charAttitude);

                this.sprite.x = this.pos.x - (camPos.x - camPos.boundaryX)
                this.sprite.y = this.pos.y - (camPos.y - camPos.boundaryY)
            }
        } else {
            if (this.isAdded) {
                this._removeSelf()
            }
            this.offTurn(camPos, charAttitude)
        }

    }
    _addSelf(camPos) {
        console.log("adding sprite", this.name)
        this.stage.addChild(this.sprite);
        this.stage.updateLayersOrder();
        this.isAdded = true;
    }

    _removeSelf() {
        console.log("removing sprite", this.name)
        this.stage.removeChild(this.sprite);
        this.stage.updateLayersOrder();
        this.isAdded = false;
    }

    turn(camPos, charAttitude) { }
    offTurn(camPos, charAttitude) { }
}

class Coffre extends Thing {

    constructor(stage, pos, img, size) {

        super(stage, pos, img, size)

        this.open = new PIXI.Sprite(PIXI.Texture.fromFrame(img + '_open.png'));
        this.open.width = size.width;
        this.open.height = size.height;
        this.open.zIndex = pos.zIndex;

        this.closed = this.sprite;

        this.opened = false;
    }

    switchState() {
        if (this.opened) {
            //console.log("close coffer")
            this.opened = false
            this.stage.removeChild(this.sprite);
            this.sprite = this.closed
            this.stage.addChild(this.sprite);
        } else {
            //console.log("open coffer")
            this.opened = true
            this.stage.removeChild(this.sprite);
            this.sprite = this.open
            this.stage.addChild(this.sprite);
        }
        this.stage.updateLayersOrder();
    }

    turn(camPos, charAttitude) {
        var deplacement = {};
        deplacement.x = 0;
        deplacement.y = 0;

        if (charAttitude.etat == "push") {
            //console.log("i see him push : ", charAttitude.bound, this.getBound(), this.hitTestRectangle(charAttitude.bound, this.getBound()))
            if (this.hitTestRectangle(charAttitude.bound, this.getBound(), charAttitude.speedX)) {
                //console.log("and i feel it")
                deplacement.x += charAttitude.speedX;
            }
        }

        if (charAttitude.etat == "catch") {
            if (!this.opened) {
                this.switchState();
            }
            if (charAttitude.effets.includes("catched") && Math.abs(this.pos.x - charAttitude.x + 150) < 100) {
                console.log("and i put")
                charAttitude.effets.push("put")
            }
        } else if (this.opened) {
            this.switchState();
        }
        this.pos.x += deplacement.x;
        this.pos.y += deplacement.y;
    }

    getBound() {
        var bound = {
            x: this.sprite.x,
            y: this.sprite.y,
            width: this.sprite.width,
            height: this.sprite.height
        }
        return bound;
    }

    hitTestRectangle(r1, r2, direction) {

        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        if (
            (r1.x == r2.x && direction == -1) || (r1.x == r2.x + r2.width && direction == 1)
        ) {
            hit = true;
        }

        return hit;
    };
}

class Nuage extends Thing {

    constructor(stage, pos, img, size) {
        super(stage, pos, img, size)

        this.isFree = true;
        this.timeY = 40;
        this.vx = 1.5;
        this.vy = 1;
    }

    offTurn(camPos, charAttitude) {

        if (this.isFree) {
            var deplacement = {};
            deplacement.x = 0;
            deplacement.y = 0;
            //console.log("turn", this.timeX)

            if (this.timeY == 0) {
                this.vy = -this.vy
                this.timeY = 40;
            } else {
                this.timeY--;
            }

            if(this.pos.x > charAttitude.x && !this.close){
                this.vx = -1.5
            }
            if(this.pos.x < charAttitude.x && !this.close){
                this.vx = 1.5
            }
            deplacement.x += this.vx;
            deplacement.y += this.vy;

            this.pos.x += deplacement.x;
            this.pos.y += deplacement.y;
        }

    }

    turn(camPos, charAttitude) {
        this.offTurn(camPos, charAttitude);
        if (!charAttitude.effets.includes("put")) {
            if (this.vx > 0 && charAttitude.x < this.pos.x + (this.sprite.width / 2) - 30 || this.vx < 0 && charAttitude.x > this.pos.x + (this.sprite.width / 2) + 20) {
                this.vx = -this.vx;
                this.close = true;
            }else{
                this.close = false
            }
        }


        if (charAttitude.effets.includes("catch") && this.close && this.isFree) {
            this.isFree = false;
            //this.pos.x = charAttitude.x - this.sprite.width / 2;

        } else {
            console.log("is free")
            this.isFree = true;
        }
        if (!this.isFree) {

            if (charAttitude.effets.includes("put")) {
                this.pos.y += 5
                this.pos.x += -3
            } else {
                charAttitude.effets.push("catched");
            }
        }
        if (charAttitude.effets.includes("suppr")) {
            this.pos.y += 5000
        }
    }

    getBound() {
        var bound = {
            x: this.sprite.x,
            y: this.sprite.y,
            width: this.sprite.width,
            height: this.sprite.height
        }
        return bound;
    }
}