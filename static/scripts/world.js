function initWorld() {
    world = new World(stage)
}

class World {
    constructor(stage) {

        this.layers = [];

        this.layers.push(new Layer(stage, 'far_back', { x: 800, y: 600, posX: 0, posY: 0 }, 0.128));
        this.layers.push(new Layer(stage, 'medium_back', { x: 800, y: 200, posX: 0, posY: 200 }, 0.64));

        this.things = [];

        this.camPos = {
            x:0,
            y:0,
            boundaryX: 300,
            boundaryY: 300
        }

    }

    play(charAttitude) {
        if (charAttitude.locked) {
            for (var layer of this.layers) {
                layer.play(charAttitude);
            }
            this.camPos.x += charAttitude.speedX;
        }
    }
}

class Layer {
    constructor(stage, picture, position, offset) {
        var texture = PIXI.Texture.fromImage("../static/images/" + picture + ".png");
        var tile = new PIXI.extras.TilingSprite(texture, position.x, position.y);
        tile.position.x = position.posX;
        tile.position.y = position.posY;
        tile.tilePosition.x = 0;
        tile.tilePosition.y = 0;
        stage.addChild(tile);
        this.tile = tile;
        this.offset = offset;
    }

    play(charAttitude) {
        if (charAttitude.locked) {
            this.tile.tilePosition.x -= (charAttitude.speedX * this.offset)
        }
    }
}

class Thing {

    constructor(stage, pos, img) {
        this.stage = stage;
        this.pos = pos;
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(img + '.png'));
    }

    play(camPos) {
        if (
            ((camPos.x - camPos.boundaryX) < this.pos.x && (camPos.y + camPos.boundaryX) > this.pos.x) &&
            ((camPos.y - camPos.boundaryY) < this.pos.y && (camPos.y + camPos.boundaryY) > this.pos.y)) {
            if (!this.isAdded) {
                this._addSelf(camPos)
            }else{

            }
        } else {
            if (this.isAdded) {
                this._removeSelf()
            }
        }
    }

    _addSelf() {

    }

    _removeSelf() {

    }
}