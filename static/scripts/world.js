function initWorld() {
    world = new World(stage)
    world.locked = true;
    //lock the camera
    var shift = keyboard(16);
    shift.press = function () {
        console.log("unlock")
        world.locked = false;
    };
    //Left arrow key `release` method
    shift.release = function () {
        console.log("lock")
        world.locked = true;
    };
}

class World {
    constructor(stage) {

        this.layers = [];

        this.layers.push(new Layer(stage, 'far_back', { x: 800, y: 600, posX: 0, posY: 0, zIndex:5 }, 0.128));
        this.layers.push(new Layer(stage, 'medium_back', { x: 800, y: 200, posX: 0, posY: 200, zIndex:4 }, 1));

        this.things = [];

        this.things.push(new Coffre(stage, {x:500, y:220, zIndex:3}, 'coffre', {width:195, height:142}))

        this.camPos = {
            x: 300,
            y: 300,
            boundaryX: 300,
            boundaryY: 300,
            deltaX: 0,
            deltaY: 0,
            zoom:1,
            deltaZoom:0
        }

    }

    play(mainChar) {

        var charAttitude = mainChar.getAttitude();
        //console.log("charAttitude : ", charAttitude)
        for (var layer of this.layers) {
            layer.play(this.camPos);
        }
        for (var thing of this.things) {
            thing.play(this.camPos, charAttitude);
        }
        if (this.locked) {
            this.camPos.x += charAttitude.speedX;
            this.camPos.deltaX = charAttitude.speedX

            this.camPos.y += charAttitude.speedY;
            this.camPos.deltaY = charAttitude.speedY
        } else {
            this.camPos.deltaX = 0
            this.camPos.deltaY = 0
        }
        var charPos = {
            x: charAttitude.x + charAttitude.speedX,
            y: charAttitude.y + charAttitude.speedY,
            effets: charAttitude.effets
        }
        mainChar.play(this.camPos, charPos)
    }
}

class Layer {
    constructor(stage, picture, position, offset) {
        var texture = PIXI.Texture.fromImage("static/images/" + picture + ".png");
        var tile = new PIXI.extras.TilingSprite(texture, position.x, position.y);
        tile.position.x = position.posX;
        tile.position.y = position.posY;
        tile.tilePosition.x = 0;
        tile.tilePosition.y = 0;
        tile.zIndex = position.zIndex;
        stage.addChild(tile);
        this.tile = tile;
        this.offset = offset;
    }

    play(camPos) {
        this.tile.tilePosition.x -= (camPos.deltaX * this.offset)
        this.tile.tilePosition.y -= (camPos.deltaY * this.offset)
    }
}

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

    turn(camPos, charAttitude){}
}

class Coffre extends Thing{

    turn(camPos, charAttitude){
        var deplacement = {};
        deplacement.x = 0;
        deplacement.y = 0;

        if(charAttitude.push){
            //console.log("i see him push : ", charAttitude.bound, this.getBound(), this.hitTestRectangle(charAttitude.bound, this.getBound()))
            if(this.hitTestRectangle(charAttitude.bound, this.getBound())){
                console.log("and i feel it")
                deplacement.x += charAttitude.speedX;
            }
        }
        this.pos.x += deplacement.x;
        this.pos.y += deplacement.y;
    }

    getBound(){
        var bound = {
            x: this.sprite.x,
            y: this.sprite.y,
            width: this.sprite.width,
            height: this.sprite.height
        }
        return bound;
    }

    hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    if (
        r1.x == r2.x || r1.x == r2.x + r2.width
    ) {
        hit = true;
    }

    return hit;
};
}

class Nuage extends Thing{

    turn(camPos, charAttitude){
        var deplacement = {};
        deplacement.x = 0;
        deplacement.y = 0;

        
        this.pos.x += deplacement.x;
        this.pos.y += deplacement.y;
    }

    getBound(){
        var bound = {
            x: this.sprite.x,
            y: this.sprite.y,
            width: this.sprite.width,
            height: this.sprite.height
        }
        return bound;
    }
}