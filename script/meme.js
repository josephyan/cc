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

//var meme_army = [];

var meme_army = new Array(12);
for (var i = 0; i < 12; i++) {
    meme_army[i] = new Array(10);
    for (var j = 0; j < 10; j++) {
         meme_army[i][j] = false;
    }
}

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
        y: 0, 
        alpha: 0.8,
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
        //console.log("dragging");
        var position = meme.getPosition();
        //console.log("X meme position is: " +position.x);
        //console.log("Y meme position is: " +position.y);
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
                    var name = "m"+grid_position.x +grid_position.y;
                
                    var lol = new Kinetic.Shape(function(){
                        var context = this.getContext();
                        context.font = "14pt Calibri";
                        context.fillStyle = "red";
                        context.fillText("LOL LOL LOL", 0, 0);
                    });
                    var lol2 = new Kinetic.Shape(function(){
                        var context = this.getContext();
                        context.font = "14pt Calibri";
                        context.fillStyle = "red";
                        context.fillText("LOL LOL LOL", 0, 0);
                    });
                    lol.hide();
                    lol2.hide();
                    meme_layer.add(lol);
                    meme_layer.add(lol2);
                    lol.name = "1" +name;
                    lol2.name = "2" +name;
                    lol.x = grid_position.x * 64 +32;
                    lol.y = grid_position.y * 64 +32;
                    lol2.x = grid_position.x * 64 +32;
                    lol2.y = grid_position.y * 64 +32;
                    
                    matrix[grid_position.x][grid_position.y] = "taken";
                    meme.x = grid_position.x * 64 + 4;
                    meme.y = grid_position.y * 64 + 4;
                    meme.name = name;
                    console.log("meme name" +meme.name);
                    meme.draggable(false);
                    souls = souls -50;
                    addMeme(meme_image, glow_meme_image, meme_coordinate);
                    recalculate = true;
                    
                    meme_army[grid_position.x][grid_position.y] = true;
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

function detect(){
    current_meme = meme_layer.getChildren();
    var lol1 = null;
    var lol2 = null;
    var name1 = null;
    var name2 = null;
     meme_layer.draw();
    for(var i = 0; i < 12; i++){
        for(var j = 0; j < 10; j++){
            if(meme_army[i][j]===true){
                //console.log("detecting");
                x = i;
                y = j;
                name1 = "1"+"m"+x+y;
                name2 = "2"+"m"+x+y;
                //find the lol objects among all children
                for (var k = 0; k < current_meme.length; k++){
                    if(current_meme[k].name === name1)
                        lol1 = current_meme[k];
                    if(current_meme[k].name === name2)
                        lol2 = current_meme[k];
                }
                
                if(x === 0 && y<9 && y>0){ //left bar
                    if( matrix[x+1][y+1]==="walking"){
                        shot(x, y, x+1, y+1, lol1, lol2);
                    }
                    else if(matrix[x][y+1]==="walking"){
                        shot(x, y, x, y+1, lol1, lol2);
                    }
                    else if(matrix[x+1][y]==="walking"){
                        shot(x, y, x+1, y, lol1, lol2);
                    }
                    else if(matrix[x+1][y-1]==="walking"){
                        shot(x, y, x+1, y-1, lol1, lol2);
                    }
                    else if(matrix[x][y-1]==="walking"){
                        shot(x, y, x, y-1, lol1, lol2);
                    }
                    else{
                        lol1.hide();
                        lol2.hide();
                        //console.log("not detected");
                        //meme_layer.draw();
                    }
                } 
                else if(y === 0 && x<11 && x>0){ //top bar
                    if( matrix[x+1][y+1]==="walking"){
                        shot(x, y, x+1, y+1, lol1, lol2);
                    }
                    else if(matrix[x][y+1]==="walking"){
                        shot(x, y, x, y+1, lol1, lol2);
                    }
                    else if(matrix[x+1][y]==="walking"){
                        shot(x, y, x+1, y, lol1, lol2);
                    }
                    else if(matrix[x-1][y]==="walking"){
                        shot(x, y, x-1, y, lol1, lol2);
                    }
                    else if(matrix[x-1][y+1]==="walking"){
                        shot(x, y, x-1, y+1, lol1, lol2);
                    }
                    else{
                        lol1.hide();
                        lol2.hide();
                        //console.log("not detected");
                        //meme_layer.draw();
                    }
                }     
                else if(x === 11 && y<9 && y>0){ //right bar
                    if(matrix[x][y+1]==="walking"){
                        shot(x, y, x, y+1, lol1, lol2);
                    }
                    else if(matrix[x-1][y-1]==="walking"){
                        shot(x, y, x-1, y-1, lol1, lol2);
                    }
                    else if(matrix[x][y-1]==="walking"){
                        shot(x, y, x, y-1, lol1, lol2);
                    }
                    else if(matrix[x-1][y]==="walking"){
                        shot(x, y, x-1, y, lol1, lol2);
                    }
                    else if(matrix[x-1][y+1]==="walking"){
                        shot(x, y, x-1, y+1, lol1, lol2);
                    }
                    else{
                        lol1.hide();
                        lol2.hide();
                        //console.log("not detected");
                        //meme_layer.draw();
                    }
                }     
                else if(y === 9 && x<11 && x>0){ //bottom bar
                    if(matrix[x-1][y-1]==="walking"){
                        shot(x, y, x-1, y-1, lol1, lol2);
                    }
                    else if(matrix[x+1][y]==="walking"){
                        shot(x, y, x+1, y, lol1, lol2);
                    }
                    else if(matrix[x+1][y-1]==="walking"){
                        shot(x, y, x+1, y-1, lol1, lol2);
                    }
                    else if(matrix[x][y-1]==="walking"){
                        shot(x, y, x, y-1, lol1, lol2);
                    }
                    else if(matrix[x-1][y]==="walking"){
                        shot(x, y, x-1, y, lol1, lol2);
                    }
                    else{
                        lol1.hide();
                        lol2.hide();
                        //console.log("not detected");
                        //meme_layer.draw();
                    }
                }
                else if(x === 0 && y===9){ //bottom left corner
                    if(matrix[x+1][y]==="walking"){
                        shot(x, y, x+1, y, lol1, lol2);
                    }
                    else if(matrix[x+1][y-1]==="walking"){
                        shot(x, y, x+1, y-1, lol1, lol2);
                    }
                    else if(matrix[x][y-1]==="walking"){
                        shot(x, y, x, y-1, lol1, lol2);
                    }
                    else{
                        lol1.hide();
                        lol2.hide();
                        //console.log("not detected");
                        //meme_layer.draw();
                    }
                }
                else if(x === 11 && y===0){ //top right corner
                    if(matrix[x][y+1]==="walking"){
                        shot(x, y, x, y+1, lol1, lol2);
                    }
                    else if(matrix[x-1][y]==="walking"){
                        shot(x, y, x-1, y, lol1, lol2);
                    }
                    else if(matrix[x-1][y+1]==="walking"){
                        shot(x, y, x-1, y+1, lol1, lol2);
                    }
                    else{
                        lol1.hide();
                        lol2.hide();
                        //console.log("not detected");
                        //meme_layer.draw();
                    }
                } 
                else{ //general
                    if( matrix[x+1][y+1]==="walking"){
                        shot(x, y, x+1, y+1, lol1, lol2);
                    }
                    else if(matrix[x][y+1]==="walking"){
                        shot(x, y, x, y+1, lol1, lol2);
                    }
                    else if(matrix[x-1][y-1]==="walking"){
                        shot(x, y, x-1, y-1, lol1, lol2);
                    }
                    else if(matrix[x+1][y]==="walking"){
                        shot(x, y, x+1, y, lol1, lol2);
                    }
                    else if(matrix[x+1][y-1]==="walking"){
                        shot(x, y, x+1, y-1, lol1, lol2);
                    }
                    else if(matrix[x][y-1]==="walking"){
                        shot(x, y, x, y-1, lol1, lol2);
                    }
                    else if(matrix[x-1][y]==="walking"){
                        shot(x, y, x-1, y, lol1, lol2);
                    }
                    else if(matrix[x-1][y+1]==="walking"){
                        shot(x, y, x-1, y+1, lol1, lol2);
                    }
                    else{
                        lol1.hide();
                        lol2.hide();
                        //console.log("not detected");
                        //meme_layer.draw();
                    }
                }
               
            }
        }
    }
}

function shot(ox, oy, dx, dy, lol1, lol2){
/*    //console.log("lol");
    name1 = "1"+"m"+ox+oy;
    name2 = "2"+"m"+ox+oy;
    //find the lol objects among all children
    for (var k = 0; k < current_meme.length; k++){
        if(current_meme[k].name === name1)
            lol1 = current_meme[k];
        if(current_meme[k].name === name2)
            lol2 = current_meme[k];
    }*/
    life = life - 20;
    lol1.x = ox*64+32;
    lol1.y = oy*64+32;
    lol2.x = ox*64+32;
    lol2.y = oy*64+32;
    lol1.moveToTop();
    lol2.moveToTop();
    lol1.show();
    lol2.show();
    lol1.rotate(Math.PI / 12);
    lol2.rotate(Math.PI / 8);
    
}
