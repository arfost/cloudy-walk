function onAssetsLoaded() {

            initWorld();
            initMainChar();

            nuage = new PIXI.Sprite(PIXI.Texture.fromFrame('nuage.png'));

            nuage.x = -100;
            nuage.y = 50;

            nuage.vx = 1.5;
            nuage.vy = -0.5;

            stage.addChild(nuage);

            coffre = new PIXI.Sprite(PIXI.Texture.fromFrame('coffre.png'));

            coffre.x = 96;
            coffre.y = renderer.height / 2;

            //stage.addChild(coffre);
            
            
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
        