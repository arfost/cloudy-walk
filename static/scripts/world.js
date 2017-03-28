function initWorld() {
    world = new World(stage)
}

class World {
    constructor(stage) {

        this.layers = [];

        this.layers.push(new Layer(stage, 'far_back', { x: 800, y: 600, posX: 0, posY: 0, zIndex:5 }, 0.128));
        this.layers.push(new Layer(stage, 'medium_back', { x: 800, y: 200, posX: 0, posY: 200, zIndex:4 }, 1));

        this.things = [];

        this.things.push(new Thing(stage, {x:500, y:300, zIndex:3}, 'coffre'))

        this.camPos = {
            x: 0,
            y: 300,
            boundaryX: 300,
            boundaryY: 300,
            deltaX: 0,
            deltaY: 0,
            zoom:1,
            deltaZoom:0
        }

    }

    play(charAttitude) {
        if (charAttitude.locked) {
            this.camPos.x += charAttitude.speedX;
            this.camPos.deltaX = charAttitude.speedX

            this.camPos.y += charAttitude.speedY;
            this.camPos.deltaY = charAttitude.speedY
        } else {
            this.camPos.deltaX = 0
            this.camPos.deltaY = 0
        }
        for (var layer of this.layers) {
            layer.play(this.camPos);
        }
        for (var thing of this.things) {
            thing.play(this.camPos, charAttitude);
        }
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

    constructor(stage, pos, img) {
        this.name = img;
        this.stage = stage;
        this.pos = pos;
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(img + '.png'));
        this.sprite.zIndex = pos.zIndex;
        this.isAdded = false;
    }

    play(camPos) {
        if (
            ((camPos.x - camPos.boundaryX) < this.pos.x && (camPos.x + camPos.boundaryX) > this.pos.x) &&
            ((camPos.y - camPos.boundaryY) < this.pos.y && (camPos.y + camPos.boundaryY) > this.pos.y)) {
            if (!this.isAdded) {
                this._addSelf(camPos)
            } else {
                this.sprite.x -= camPos.deltaX;
                this.sprite.y -= camPos.deltaY;
            }
        } else {
            if (this.isAdded) {
                this._removeSelf()
            }
        }
    }
    _addSelf(camPos) {
        console.log("adding sprite", this.name)
        this.sprite.x = this.pos.x - (camPos.x - camPos.boundaryX)
        this.sprite.y = this.pos.y - (camPos.y - camPos.boundaryY)
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
}