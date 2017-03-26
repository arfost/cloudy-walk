function initWorld() {
    world = new World(stage)
}

class World {
    constructor(stage) {
        
        this.layers = [];

        this.layers.push(new Layer(stage, 'far_back', {x:800, y:600, posX:0, posY:0}, 0.128));
        this.layers.push(new Layer(stage, 'medium_back', {x:800, y:200, posX:0, posY:200}, 0.64));

    }

    play(charAttitude) {
        for (var layer of this.layers){
            layer.play(charAttitude);
        }
    }
}

class Layer {
    constructor(stage, picture, position, offset){
        var texture = PIXI.Texture.fromImage("../static/images/"+picture+".png");
        var tile = new PIXI.extras.TilingSprite(texture, position.x, position.y);
        tile.position.x = position.posX;
        tile.position.y = position.posY;
        tile.tilePosition.x = 0;
        tile.tilePosition.y = 0;
        stage.addChild(tile);
        this.tile = tile;
        this.offset = offset;
    }

    play(charAttitude){
        if(charAttitude.locked){
            this.tile.tilePosition.x -= (charAttitude.speedX * this.offset)
        }
    }
}