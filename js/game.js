
var waititsfun = (function () {

    var states = {
        game: "game",
    };

    var lilly, cursors, scoreboard, score, water, allfrogs;
    var frogs = [];
    var gameState = function (game) { };
    var gamepad = new BrowserUtils.Controllers.Gamepad();
    var idleState = function (game) { };

    gameState.prototype = {

        init: function () {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.pageAlignVertically = true;
            game.scale.pageAlignHorizontally = true;
        },

        preload: function () {
            game.stage.backgroundColor = '#D5E5FF';
            game.load.image('frog', '/frog/sprites/frog.png');
            game.load.image('lilly', '/frog/sprites/lillypad.png');
            game.load.image('water', '/frog/sprites/water.png');
            game.load.image('fish', '/frog/sprites/fish.png');
            game.load.image("bkgrnd", '/frog/sprites/bkgrnd.png');
        },

        frogFactory: function (params) {
            var frogstartX = game.rnd.integerInRange(20, 620);
            var frogXvelocity = game.rnd.integerInRange(-100, 100);
            var froggravity = game.rnd.integerInRange(500, 1000);

            froggy = allfrogs.create(frogstartX, -50, 'frog');

            game.physics.arcade.enable(froggy);
            froggy.body.collideWorldBounds = true;
            froggy.body.gravity.y = froggravity;
            froggy.body.bounce.setTo(1, 1);
            froggy.body.velocity.x = frogXvelocity;
            var fish = game.add.sprite(0, 500, 'fish');
            game.physics.arcade.enable(fish);
            fish.body.allowGravity = false;
            var fishtween = game.add.tween(fish)
            fishtween.onComplete.add(function () { fish.kill(); }, this);
            frogs.push({ thefrog: froggy, thefish: fish, thefishtween: fishtween });
        },

        create: function () {
            score = 0;

            cursors = game.input.keyboard.createCursorKeys();

            scoreboard = game.add.text(10, 10, '0');

            game.add.tileSprite(0, 0, 640, 480, 'bkgrnd');

            water = game.add.sprite(0, 443, 'water');
            game.physics.arcade.enable(water);
            water.body.immovable = true;

            lilly = game.add.sprite(320, 400, 'lilly');
            game.physics.arcade.enable(lilly);
            lilly.body.immovable = true;
            lilly.body.collideWorldBounds = true;

            allfrogs = game.add.physicsGroup(Phaser.Physics.ARCADE);

            for (var i = 0; i < 3; i++) {
                this.frogFactory();
            }
        },

        update: function () {

            if (frogs.length < 3) { this.frogFactory(); }

            for (var i = 0; i < frogs.length; i++) {

                var thefrog = frogs[i].thefrog;
                var thefish = frogs[i].thefish;
                var thefishtween = frogs[i].thefishtween;

                if (thefrog.body.velocity.y > 0) {
                    game.physics.arcade.collide(lilly, thefrog, function () {
                        score += 10;
                        scoreboard.text = score.toString();
                    });

                    game.physics.arcade.collide(water, thefrog, function () {
                        thefrog.body.velocity.y = 0;
                        thefrog.body.velocity.x = 0;
                        thefrog.body.y = thefrog.body.y + 20;
                        thefrog.body.allowGravity = false;
                        thefish.body.x = thefrog.body.x - 29;
                        //properties, duration, ease, autoStart, delay, repeat, yoyo
                        thefishtween.to({ y: 400 }, 800, Phaser.Easing.Elastic.InOut, true, 100, 0, true);
                    });
                }

                if (game.physics.arcade.overlap(thefish, thefrog)) {
                    thefrog.kill();
                    frogs.splice(i, 1);
                }
            }

            game.physics.arcade.collide(allfrogs);

            lilly.body.velocity.x = 0;

            var gpad = gamepad.GetRightStick();

            if (cursors.left.isDown) {
                lilly.body.velocity.x = -450;
            }
            else if (cursors.right.isDown) {
                lilly.body.velocity.x = 450;
            }
        }
    };

    var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'gameDiv');
    game.state.add(states.game, gameState);
    game.state.start(states.game);

    return {
        pause: function togglePause() {
            game.destroy();
            //game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
        }
    };

})();