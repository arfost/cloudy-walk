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

    var num0 = keyboard(18);
    num0.press = function () {
        world.moveHill()
    };

    var x = keyboard(87);
    x.press = function () {
        world.boostcoffer()
    };

    
}

class World {
    constructor(stage) {

        this.layers = [];

        this.layers.push(new Layer(stage, 'sky', { x: 4204, y: 438, posX: 0, posY: 0, zIndex: 6 }, 0.256));
        this.layers.push(new Layer(stage, 'far_back', { x: 4604, y: 600, posX: 0, posY: 0, zIndex: 5 }, 0.512));
        this.layers.push(new Layer(stage, 'medium_back', { x: 4604, y: 200, posX: 0, posY: 250, zIndex: 4 }, 1));

        this.things = [];

        this.things.push(new Thing(stage, { x: -900, y: 25, zIndex: 3 }, 'arbre', { width: 227, height: 343 }))
        this.things.push(new Colline(stage, { x: 1900, y: 25, zIndex: 3 }, 'colline', { width: 335, height: 425 }))
        this.things.push(new Coffre(stage, { x: -200, y: 220, zIndex: 3 }, 'coffre', { width: 155, height: 112 }))
        this.things.push(new Nuage(stage, { x: -300, y: 5000, zIndex: 1 }, 'nuage', { width: 130, height: 95 }))

        this.camPos = {
            x: 300,
            y: 300,
            boundaryX: 300,
            boundaryY: 300,
            deltaX: 0,
            deltaY: 0,
            zoom: 1,
            deltaZoom: 0
        }

    }

    moveHill(){
        for(var thing of this.things){
            if(thing.name == "colline"){
                if(thing.pos.x == 1900){
                    thing.pos.x = 400
                }else{
                    thing.pos.x = 1900
                }
            }
        }
    }

    boostcoffer(){
        for(var thing of this.things){
            if(thing.name == "coffre"){
                thing.boost += 50;
            }
        }
    }

    play(mainChar) {

        var charAttitude = mainChar.getAttitude();
        charAttitude.newEffets = []
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
            effets: charAttitude.newEffets
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
        tile.tilePosition.x = 2500;
        tile.tilePosition.y = 0;
        tile.zIndex = position.zIndex;
        stage.addChild(tile);
        this.tile = tile;
        this.offset = offset;
    }

    play(camPos) {
        this.tile.tilePosition.x -= (camPos.deltaX * this.offset)
        this.tile.position.y -= (camPos.deltaY * this.offset)
    }
}
