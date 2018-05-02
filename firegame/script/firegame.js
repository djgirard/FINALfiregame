const STAGE_WIDTH = 600;
const STAGE_HEIGHT = 400;
const PERSON_TIME_IN_AIR = 4000;      // milliseconds
const PERSON_TIME = 6000;  // milliseconds

// HTML5 CANVAS ELEMENT
var canvas = document.createElement("canvas");
canvas.width = STAGE_WIDTH;
canvas.height = STAGE_HEIGHT;

document.body.appendChild(canvas);

// CreateJS STAGE
var stage = new createjs.StageGL(canvas);
stage.mouseMoveOutside = true;
createjs.Touch.enable(stage);

stage.on("dropperson", function () {
    createjs.Touch.disable(stage);
});


// PRELOAD IMAGES
var queue = new createjs.LoadQueue(false);
queue.loadFile("image/person.png");
queue.loadFile("image/ball-catch.png");
queue.loadFile("image/background.png");
queue.loadFile("image/player.png");
queue.load();
queue.on("complete", function () {
    

// CreateJS TICKER
createjs.Ticker.on("tick", stage);
createjs.Ticker.framerate = 60;

//
stage.on("dropperson", function () {
    createjs.Ticker.off("tick", addPerson);
});
    

// BACKGROUND OBJECT
var gym = new createjs.Bitmap("image/background.png");
gym.scaleX = STAGE_WIDTH / gym.getBounds().width;
gym.scaleY = STAGE_HEIGHT / gym.getBounds().height;
stage.addChild(gym);
  
// SCORE OBJECT
    var score = new createjs.Text(0, 'bold 50px sans-serif', '#FFF');
    score.x = 540;
    score.y = 8;

    // --- custom properties
    score.value = 0;

    // --- score a point on the caught ball event
    score.catchListener = stage.on("caughtperson", function () {
        score.value++;
        score.text = score.value;
        score.cache(0,0,200,50);
    });

    // --- Add score to stage
    stage.addChild(score);
    score.cache(0,0,200,50);
    
// PLAYER GRAPHICS
    var playerAlive = new Image();
    playerAlive.src = "image/player.png";

// PLAYER OBJECT
    var player = new createjs.Bitmap();
    player.image = playerAlive;
    player.width = player.getBounds().width;
    player.height = player.getBounds().height;
    player.x = STAGE_WIDTH/2 - player.width/2;
    player.y = STAGE_HEIGHT - player.height;

    // --- handle movement events
    player.moveListener = stage.on("stagemousemove", function (mouseEvent) {
        player.x = mouseEvent.stageX - player.width/2;
    });

    // --- Add player to stage
    stage.addChild(player);
    
// PERSON GRAPHICS
    var personFalling = new Image();
    personFalling.src = "image/person.png";

// PERSON CLASS
    function Person() {
        /* private member */
        var person = new createjs.Bitmap();
        person.image = personFalling;
        person.width = person.getBounds().width;
        person.height = person.getBounds().height;
        person.startx = STAGE_WIDTH - 100;
        person.regX = person.width/6;
        person.regY = person.height/6;

        // --- custom properties
        person.state = "Falling";
        person.moveToX = STAGE_WIDTH - 360;
        person.moveToY = STAGE_HEIGHT - 100, STAGE_WIDTH - 200;
        person.moveTime = PERSON_TIME_IN_AIR;

        // --- move the person using TweenJS
        createjs.Tween.get(person)
                .to({x: person.moveToX, 
                     y: STAGE_HEIGHT + person.height,},
                person.moveTime, createjs.Ease.getPowOut(3));


        // --- hitTest
        person.tickListener = person.on("tick", function () {
            // Hit test
            if ((person.y > 330) && (person.x <= person.moveToX)) {

                if ((person.x > player.x+12) && (person.x < player.x+128)) {
                    stage.dispatchEvent(new createjs.Event("caughtperson"));
                    createjs.Tween.removeTweens(person);
                    tween = createjs.Tween.get(person)
                            .to({x: person.moveToX + 64, 
                                 y: STAGE_HEIGHT/2},
                            person.moveTime/2, createjs.Ease.getPowOut(3))
                            .to({x: person.moveToX + 128, 
                                 y: STAGE_HEIGHT},
                            person.moveTime/2, createjs.Ease.getPowIn(3));
                } else {
                    alert("Game Over")
                    person.off("tick", person.tickListener);
                    stage.removeChild(person);
                    score.value = 0;
                    score.text = score.value;
                    score.cache (0,0,200,50)
                    stage.dispatchEvent(new createjs.Event("hitbyball"));
                }
                
            }
            
            else if ((person.y > 325) && (person.x > person.moveToX) && (person.x <= person.moveToX + 128)) {
                if ((person.x > player.x+12) && (person.x < player.x+128)) {
                    stage.dispatchEvent(new createjs.Event("caughtperson"));
                    createjs.Tween.removeTweens(person);
                    tween = createjs.Tween.get(person)
                            .to({x: person.moveToX + 192, 
                                 y: STAGE_HEIGHT/2},
                            person.moveTime/2, createjs.Ease.getPowOut(3))
                            .to({x: person.moveToX + 280, 
                                 y: STAGE_HEIGHT},
                            person.moveTime/2, createjs.Ease.getPowIn(3));
                } else {
                    alert("Game Over")
                    person.off("tick", person.tickListener);
                    stage.removeChild(person);
                    score.value = 0;
                    score.text = score.value;
                    score.cache (0,0,200,50)
                    stage.dispatchEvent(new createjs.Event("hitbyball"));
                }

            }
            
            
        });

        return person;
    }

// PERSON OBJECTS
    // --- Call addBall method EVERY FRAME
    var addPerson = createjs.Ticker.on("tick", function addPerson() {
        var randomNumber = Math.floor((Math.random() * 250) + 1);
        if (randomNumber === 1) {
            stage.addChild(Person());
        }
    });
    
});

    