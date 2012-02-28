var attack_area_33 = new Kinetic.Rect({
    x: -68,
    y: -68,
    width: 192,
    height: 192,
    fill: "#00D2FF",
    stroke: "black",
    alpha: 0.2,
    strokeWidth: 2
});

//Add score board
var souls = 100;
var box = new Kinetic.Shape(function(){
    var context = this.getContext();
    context.beginPath();
    context.rect(780, 5, 130, 50);
    context.lineWidth = 4;
    context.strokeStyle = "black";
    context.fillStyle = "yellow";
    context.fill();
    context.stroke();
    context.closePath();
 
    // add text
    context.font = "18pt Calibri";
    context.fillStyle = "black";
    context.fillText("Souls: " +souls, 790, 37);
});

var meme_army = [];

function loadMeme(sources){
    console.log("Loading Meme.......");
    
    var memes = {
        lol: {
            x: 775,
            y: 66
        },
        wdir: {
            x: 770,
            y: 130
        },
    };
    
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].src = sources[src];
    }
    for (var src in memes){
        addMeme(images[src], images[src + "_glow"], memes[src]);
    }
    meme_layer.add(box);
}

function addMeme(old_meme_image, glow_meme_image, meme_coordinate){
    console.log("Adding new meme");
    var meme_image = new Image();
    meme_image.src = old_meme_image.src;
    meme_image.onload = function(){
        add(meme_image, glow_meme_image, meme_coordinate);
    }
}

function add(meme_image, glow_meme_image, meme_coordinate){
    var meme = new Kinetic.Image({
        image: meme_image,
        x: 0, 
        y: 0
    });
    
    meme.x = meme_coordinate.x;
    meme.y = meme_coordinate.y;
       
    meme.draggable(true);
    meme.on("dragstart", function(){
        //meme.moveToTop();
        meme_layer.add(attack_area_33);
        meme_layer.draw();
    })
    
    meme.on("dragmove", function(){
        console.log("dragging");
        var position = meme.getPosition();
        console.log("X meme position is: " +position.x);
        console.log("Y meme position is: " +position.y);
        attack_area_33.setPosition(position.x, position.y);
        meme_layer.draw();
    })
    
    meme.on("dragend", function(){
        var position = meme.getPosition();
        console.log("X meme position is: " +position.x);
        console.log("Y meme position is: " +position.y);
        
        var grid_position = {};
        grid_position.x = Math.round(position.x/64) ;
        grid_position.y = Math.round(position.y/64) ;
        console.log("grid x is " +grid_position.x);
        console.log("grid y is " +grid_position.y);

        if( grid_position.x > 11 || grid_position.y > 9||grid_position.x<0||grid_position.y<0)
        {   
            console.log("can't put meme outside battlefield");
            meme.x = meme_coordinate.x;
            meme.y = meme_coordinate.y;
        }
        else{
            if( matrix[grid_position.x ][grid_position.y]==="empty" ){
                matrix[grid_position.x][grid_position.y] = "taken";
                current_enemy = enemy_layer.getChildren();
                var coordinate = current_enemy[0].getPosition();
                var enemyx = Math.round(coordinate.x/64) ;
                var enemyy = Math.round(coordinate.y/64) ;
                initForPathFinding();
                var istherepath =findPath(enemyx,enemyy);
                console.log("path? " +istherepath);
                if(istherepath===false){
                    matrix[grid_position.x][grid_position.y] = "empty";
                    console.log("Why you blocking all pass??!!")
                    meme.x = meme_coordinate.x;
                    meme.y = meme_coordinate.y;
                }
                else{
                    matrix[grid_position.x][grid_position.y] = "taken";
                    meme.x = grid_position.x * 64 + 4;
                    meme.y = grid_position.y * 64 + 4;
                    meme.draggable(false);
                    souls = souls -50;
                    addMeme(meme_image, glow_meme_image, meme_coordinate);
                    recalculate = true;
                    meme_army[meme_army.length] = {x:grid_position.x, y:grid_position.y};
                }
            }
            else{
                console.log("spot already taken")
                meme.x = meme_coordinate.x;
                meme.y = meme_coordinate.y;
            }
        }
        meme_layer.remove(attack_area_33);
        meme_layer.draw();
    });
            
    meme.on("mouseover", function(){
        meme.setImage(glow_meme_image, meme_coordinate);
        meme_layer.draw();
        document.body.style.cursor = "pointer";
    });
            
    meme.on("mouseout", function(){
        meme.setImage(meme_image, meme_coordinate);
        meme_layer.draw();
        document.body.style.cursor = "default";
    });
    meme_layer.add(meme);
    meme_layer.draw();
}

function detect(i){
    if(meme_army.length >0){
        console.log("detecting");
        x = meme_army[i].x;
        y = meme_army[i].y;
    //if(x === 0 && y<9 && y>0){ //left bar
        if( matrix[x+1][y+1]==="walking")
            shot(x, y, x+1, y+1);
        else if(matrix[x][y+1]==="walking")
            shot(x, y, x, y+1);
        else if(matrix[x-1][y-1]==="walking")
            shot(x, y, x-1, y-1);
        else if(matrix[x+1][y]==="walking")
            shot(x, y, x+1, y);
        else if(matrix[x+1][y-1]==="walking")
            shot(x, y, x+1, y-1);
        else if(matrix[x][y-1]==="walking")
            shot(x, y, x, y-1);
        else if(matrix[x-1][y]==="walking")
            shot(x, y, x-1, y);
        else if(matrix[x-1][y-1]==="walking")
            shot(x, y, x-1, y-1);
        else
            stage.stop();
            //}
     }
}

function shot(ox, oy, dx, dy){
    stage.start();
    console.log("lol lol lol lol");
    /*Add score board
    var lol = new Kinetic.Shape(function(){
        var context = this.getContext();
        context.font = "12pt Calibri";
        context.fillStyle = "red";
        context.fillText("lol", ox*64, oy*64);
    });*/
    //bullet_layer.add(lol);
    //bullet_layer.draw();
    //setInterval(loling, 100);
    //setTimeout(loling, 1000);
    //lol.move(
    
}

function loling(){
    current_lol = bullet_layer.getChildren();
    current_lol[0].move(5,5);
    bullet_layer.draw();
}