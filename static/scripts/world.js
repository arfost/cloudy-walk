function initWorld() {
    world = new World(stage)
}

class World {
    constructor(stage) {
        var farTexture = PIXI.Texture.fromImage("../static/images/far_back.png");
        var far = new PIXI.extras.TilingSprite(farTexture, 800, 600);
        far.position.x = 0;
        far.position.y = 0;
        far.tilePosition.x = 0;
        far.tilePosition.y = 0;
        stage.addChild(far);

        var midTexture = PIXI.Texture.fromImage("../static/images/medium_back.png");
        var mid = new PIXI.extras.TilingSprite(midTexture, 800, 300);
        mid.position.x = 0;
        mid.position.y = 200;
        mid.tilePosition.x = 0;
        mid.tilePosition.y = 0;
        stage.addChild(mid);

        this.far = far;
        this.mid = mid;
    }

    play(mainCharSped) {
        this.far.tilePosition.x -= (mainCharSped * 0.128);
        this.mid.tilePosition.x -= (mainCharSped * 0.64);
    }
}