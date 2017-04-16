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
                this.sprite.x = this.pos.x - (camPos.x - camPos.boundaryX)
                this.sprite.y = this.pos.y - (camPos.y - camPos.boundaryY)
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
        this.boost = false;
        this.antiBoost = false;
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

    offTurn(camPos, charAttitude) {
        if (charAttitude.etat.includes("push")) {
            this.pos.x += charAttitude.speedX;
        }
        if (this.hitTestPush(charAttitude.bound, this.getBound(), charAttitude.speedX)) {
            //console.log("and i feel it")
            charAttitude.effets.push('near_coffer')
        }
        if (this.hitTestPut(charAttitude.bound, this.getBound(), charAttitude.speedX)) {
            console.log("and i feel it")
            charAttitude.effets.push('near_coffer_put')
        }
        if (this.boost) {
            this.pos.x = this.pos.x + 2.5
        }
        if (this.antiBoost) {
            this.pos.x = this.pos.x - 2.5
        }
    }

    turn(camPos, charAttitude) {
        var deplacement = {};
        deplacement.x = 0;
        deplacement.y = 0;

        this.offTurn(camPos, charAttitude)

        if (charAttitude.effets.includes("near_coffer_put") && charAttitude.etat == "catch" && charAttitude.frameState.current == charAttitude.frameState.total -1) {
            this.switchState();
            charAttitude.etats.push({
                name: "put",
                param: {
                    x: this.pos.x + this.sprite.width / 2,
                    y: this.pos.y
                }
            })
        }
        if (((charAttitude.etat == "put" && charAttitude.frameState.current == 3) || (charAttitude.etat == "outCloud" && charAttitude.frameState.current == 5)) && this.opened) {
            this.switchState();
        }
        if(charAttitude.etat.includes("stand") && charAttitude.etatParam.up && charAttitude.effets.includes("near_coffer_put")){
            this.switchState();
            charAttitude.etats.push({
                name: "outCloud",
                param: {
                    x: this.pos.x + this.sprite.width / 2,
                    y: this.pos.y
                }
            })
        }
        this.pos.x += deplacement.x;
        this.pos.y += deplacement.y;
    }

    getBound() {
        var bound = {
            x: this.pos.x,
            y: this.pos.y,
            width: this.sprite.width,
            height: this.sprite.height
        }
        return bound;
    }

    hitTestPut(r1, r2, direction) {

        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        if (
            (r1.x > r2.x + r2.width - 10 && r1.x < r2.x + r2.width + 10 && direction == 0)
        ) {
            hit = true;
        }

        return hit;
    };
    hitTestPush(r1, r2, direction) {

        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        if (
            (r1.x > r2.x - 5 && r1.x < r2.x + 5 && direction <= 0) || (r1.x > r2.x + r2.width - 5 && r1.x < r2.x + r2.width + 5 && direction >= 0)
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
        this.active = true;
    }

    offTurn(camPos, charAttitude) {

        if (this.isFree && this.active) {
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

            if (this.pos.x + (this.sprite.width / 2) - 40 > charAttitude.x && this.close) {
                this.vx = -1.5
            }
            if (this.pos.x + (this.sprite.width / 2) + 40 < charAttitude.x && this.close) {
                this.vx = 1.5
            }
            deplacement.x += this.vx;
            deplacement.y += this.vy;

            this.pos.x += deplacement.x;
            this.pos.y += deplacement.y;
        }
        if (charAttitude.etat == "outCloud" && this.isHidden) {
            console.log("nuage out cloud", charAttitude.etatParam)
            if(this.ancientCharFrame === undefined){
                this.ancientCharFrame = 0
                this.pos.x = charAttitude.etatParam.x - this.sprite.width / 2
                this.pos.y = charAttitude.etatParam.y
                this.active = false;
            }
            if (charAttitude.frameState.current != this.ancientCharFrame) {
                this.pos.x = this.pos.x + 35;
                this.ancientCharFrame = charAttitude.frameState.current;
            } 
            if (charAttitude.frameState.current == charAttitude.frameState.total-1) {
                this.isHidden = false;
                this.ancientCharFrame = undefined
                if(!charAttitude.etatParam.mount){
                    this.active = true;
                    this.timeY = 180
                    this.vy = -1
                }
            } 
        }
        //console.log("nuage doit reapparaitre", charAttitude.etat == "pop" , this.pos.y == 5000)


    }

    turn(camPos, charAttitude) {
        this.offTurn(camPos, charAttitude);
        //console.log("test : ", this.pos.x + (this.sprite.width / 2) +50 >charAttitude.x , this.pos.x + (this.sprite.width /2) -50 < charAttitude.x)
        if (this.pos.x + (this.sprite.width / 2) + 50 > charAttitude.x && this.pos.x + (this.sprite.width / 2) - 50 < charAttitude.x && this.active) {
            this.close = true;
            charAttitude.effets.push("slow")
        }
        if(charAttitude.y<125){
            charAttitude.etatParam.onCloud = true
        }
        if(charAttitude.etatParam.onCloud && charAttitude.x < this.pos.x){
            charAttitude.etats.push({
                name: "climb",
            })
        }
        
        if(!this.active && charAttitude.etat == "walkRight" && charAttitude.x >= this.pos.x && !charAttitude.etatParam.onCloud){
            charAttitude.etats.push({
                name: "cloudClimb",
                param: {
                    x: this.pos.x + this.sprite.width / 2,
                    y: this.pos.y
                }
            })
        }
        if (charAttitude.etat == "catch" && this.close) {
            this.isFree = false;
            if (this.pos.x + (this.sprite.width / 2) < charAttitude.x) {
                this.pos.x += 1;
            }
            if (this.pos.x + (this.sprite.width / 2) > charAttitude.x) {
                this.pos.x += -1;
            }
            if (this.pos.y < charAttitude.y - 200) {
                this.pos.y += 1;
            }
            if (this.pos.y > charAttitude.y - 200) {
                this.pos.y += -1;
            }
        } else if (charAttitude.etat == "put" && !this.isFree) {
            if (charAttitude.frameState.current == 1) {
                this.pos.x = charAttitude.etatParam.x - this.sprite.width / 2,
                    this.pos.y = charAttitude.etatParam.y - 50
            } else if (charAttitude.frameState.current == 2) {
                this.pos.x = charAttitude.etatParam.x - this.sprite.width / 2,
                    this.pos.y = charAttitude.etatParam.y
            } else if (charAttitude.frameState.current == 3) {
                this.pos.x = charAttitude.etatParam.x - this.sprite.width / 2,
                    this.pos.y = -500
                    this.isHidden = true;
            }

        } else {
            this.isFree = true;
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

class Colline extends Thing {
    turn(camPos, charAttitude) {
        //console.log(this.pos.x, charAttitude.x, this.pos.x < charAttitude.x, this.pos.x -5 + this.sprite.width/2 > charAttitude.x)
        if (this.pos.x + 20 < charAttitude.x && this.pos.x - 5 + this.sprite.width / 2 > charAttitude.x && (charAttitude.etat.includes("walk") || charAttitude.etat.includes("push")) && !charAttitude.etatParam.onCloud) {
            console.log("et je tombe")
            charAttitude.etats.push({
                name: "climb",
            })
        } else if (this.pos.x < charAttitude.x && this.pos.x - 5 + this.sprite.width / 2 > charAttitude.x && (charAttitude.etat.includes("walk") || charAttitude.etat.includes("push")) && !charAttitude.etatParam.onCloud) {
            console.log("j'approche")
            charAttitude.speedY = -(charAttitude.speedX)
        }
        if (charAttitude.etat == "outCloud" && (charAttitude.x > this.pos.x - 100 && charAttitude.x < this.pos.x - 50)) {
            //console.log("charattitude and mountattitude", charAttitude, this.pos)
            charAttitude.etatParam.mount = true;
        }
    }
}