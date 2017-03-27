function onAssetsLoaded() {

    initWorld();
    initMainChar();

    nuage = new PIXI.Sprite(PIXI.Texture.fromFrame('nuage.png'));

    nuage.x = -100;
    nuage.y = 50;

    nuage.vx = 1.5;
    nuage.vy = -0.5;

    //stage.addChild(nuage);

    stage.updateLayersOrder = function () {
        this.children.sort(function (a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return b.zIndex - a.zIndex
        });
    };
    stage.updateLayersOrder();
    renderer.render(stage);

    requestAnimationFrame(animate);

}


function animate() {
    //anim.x++;

    nuage.x += nuage.vx;
    nuage.y += nuage.vy;
    if (nuage.x > 600) {
        nuage.x = 0;
    }
    if (nuage.y > 100) {
        nuage.vy = -0.5;
    }
    if (nuage.y < 50) {
        nuage.vy = 0.5;
    }

    entity.play();
    world.play(entity.getAttitude());
    renderer.render(stage);
    requestAnimationFrame(animate);
}
