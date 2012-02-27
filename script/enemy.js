var open_list = [];
var close_list = [];
var path = [];
var current_enemy = null;

function loadEnemy(sources){
    console.log("Loading Enemy.......");
    
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function(){
            if (++loadedImages >= numImages) {
               initEnemy(images);
            }
        };
        images[src].src = sources[src];
    }
}

function initEnemy(images){
    var enemies = {
        derpina: {
            x: -60,
            y: 4
        },
    };
    
    for(var key in enemies){
        (function(){
            var privous_key = key;
            var enemy = new Kinetic.Image({
                image: images[key],
                x: 0,
                y: 0
            });
            enemy.x = enemies[key].x;
            enemy.y = enemies[key].y;
            enemy_layer.add(enemy);
        })();
    }
    enemy_layer.draw();
}

function runEnemy(){
    console.log("Running");
    current_enemy = enemy_layer.getChildren();
    
    var coordinate = current_enemy[0].getPosition();
    var x = Math.round(coordinate.x/64) ;
    var y = Math.round(coordinate.y/64) ;
    console.log("Derp, I'm here, X: " +x);
    console.log("Derp, I'm here, Y: " +y);
    addToOpenList(x,y);
    addToCloseList(0);
    findPath(x,y);
    printTrace(x,y, 11, 9);
    setInterval(moveEnemy, 100);
    //findDirection(current_enemy[0]);
    //move(current_enemy[0]);
    //enemy_layer.draw();
}

function moveEnemy(){
    //findDirection(current_enemy[0]);
    if (recalculate === true){
        open_list = [];
        close_list = [];
        path = [];
        var coordinate = current_enemy[0].getPosition();
        var x = Math.round(coordinate.x/64) ;
        var y = Math.round(coordinate.y/64) ;
        findPath(x,y);
        printTrace(x,y, 11, 9);
        recalculate === false;
    }
    move(current_enemy[0]);
    enemy_layer.draw();
}

function move(enemy){
    var x = (path[1].x-path[0].x)*64;
    var y = (path[1].y-path[0].y)*64;
    enemy.move(x, y);
    path.splice(0,1);
    console.log("path length is: " +path.length);
    if (path.length === 1)
        foreverAlone();
    /*if (direction === "right")
        enemy.move(64, 0);
    else
        enemy.move(0, 64);*/
    
}

function findPath(x,y){
    if (x === 11 && y ===9){
        console.log("path found");
        for(var i =0; i <close_list.length; i++){
            console.log("Step: " +i +" Path: " +close_list[i].x +" " +close_list[i].y);
        }
        return true;
    }
    else{
        //find openspot and add them to the openlist
        findOpen(x, y);
        //find the shortest F on openlist and move it to closed list
        findShortest();
        findPath(close_list[close_list.length-1].x, close_list[close_list.length-1].y);
    }
}

function printTrace(ox, oy, dx, dy){
    if (ox === dx && oy ===dy){
        path[path.length] = {x:dx, y:dy};
        path.reverse();
        if(debug === true){
           console.log("here is your trace");
        }
        for(var i=0; i<path.length; i++){
            console.log("x: " +path[i].x +" y: " +path[i].y);
        }
        return true;
    }
    else{
        path[path.length] = {x:dx, y:dy};
        //find it on closed list
        var i = findOnCloseList(dx, dy);
        if(debug === true){
            console.log("finding on close list: " +close_list[i].x +" " +close_list[i].y);
            console.log("the p values are: " +close_list[i].px +" " +close_list[i].py);
            console.log("what is i: " +i);
        }
        printTrace(ox, oy, close_list[i].px, close_list[i].py);
    }
}

function findOnCloseList(x, y){
    for(var i = 0; i < close_list.length; i++){
        if (close_list[i].x === x && close_list[i].y === y){
            console.log("finding on close list: " +close_list[i].x +" " +close_list[i].y);
            console.log("the p values are: " +close_list[i].px +" " +close_list[i].py);
            console.log("what is i: " +i);
            return i;
        }
    }
}

function findShortest(){
    var min_f = open_list[0].h+open_list[0].g;
    var min_i = 0;
    var current_f = 0;
    for(var i = 0; i<open_list.length; i++){
        currentf = open_list[i].h + open_list[i].g;
        if(current_f < min_f){
            min_f = current_f;
            min_i = i;
        }
    }
    addToCloseList(min_i);
}
function findOpen(x, y){
    //check souranding
    //check if it's on openlist
    //if not, add
    console.log("Trying to find open for: " +x +" " +y);
    if (x=== -1 && y === 0){    //starting
        addToOpenList(0,0,-1,0);
    }
    else if(x===0 && y===0){ //top left corner
        if(matrix[x+1][y] !== "taken")
        {
            if(notOnOpenList(x+1, y)&&notOnCloseList(x+1, y))
                addToOpenList(x+1, y, x, y);
        }
        if(matrix[x][y+1] !== "taken")
        {
            if(notOnOpenList(x,y+1)&&notOnCloseList(x,y+1))
                addToOpenList(x,y+1, x, y);
        }
    }
    else if(x===11 && y===0){ //top right corner
        if(matrix[x-1][y] !== "taken")
        {
            if(notOnOpenList(x-1,y)&&notOnCloseList(x-1,y))
                addToOpenList(x-1, y, x, y);
        }
        if(matrix[x][y+1] !== "taken")
        {
            if(notOnOpenList(x,y+1)&&notOnCloseList(x,y+1))
                addToOpenList(x,y+1, x, y);
        }
    }
    else if(x===0 && y===9){ //bottom left corner
        if(matrix[x+1][y] !== "taken")
        {
            if(notOnOpenList(x+1,y)&&notOnCloseList(x+1,y))
                addToOpenList(x+1, y, x, y);
        }
        if(matrix[x][y-1] !== "taken")
        {
            if(notOnOpenList(x,y-1)&&notOnCloseList(x,y-1))
                addToOpenList(x,y-1, x, y);
        }
    }
    else if(x===11 && y===9){
        //search is done
        console.log("search should be done");
    }
    else if(x===0 && y < 9 && y > 0){ //left bar
        if(matrix[x+1][y] !== "taken")
        {
            if(notOnOpenList(x+1,y)&&notOnCloseList(x+1,y))
                addToOpenList(x+1, y, x, y);
        }
        if(matrix[x][y+1] !== "taken")
        {
            if(notOnOpenList(x,y+1)&&notOnCloseList(x,y+1))
                addToOpenList(x,y+1, x, y);
        }
        if(matrix[x][y-1] !== "taken")
        {
            if(notOnOpenList(x,y-1)&&notOnCloseList(x,y-1))
                addToOpenList(x,y-1, x, y);
        }
    }
    else if(y===0 && x < 11 && x > 0){ //top bar
        if(matrix[x+1][y] !== "taken")
        {
            if(notOnOpenList(x+1,y)&&notOnCloseList(x+1,y))
                addToOpenList(x+1, y, x, y);
        }
        if(matrix[x][y+1] !== "taken")
        {
            if(notOnOpenList(x,y+1)&&notOnCloseList(x,y+1))
                addToOpenList(x,y+1, x, y);
        }
        if(matrix[x-1][y] !== "taken")
        {
            if(notOnOpenList(x-1,y)&&notOnCloseList(x-1, y))
                addToOpenList(x-1,y, x, y);
        }
    }
    else if(x===11 && y < 9 && y > 0){ //right bar
        if(matrix[x-1][y] !== "taken")
        {
            if(notOnOpenList(x-1,y)&&notOnCloseList(x-1,y))
                addToOpenList(x-1, y, x, y);
        }
        if(matrix[x][y-1] !== "taken")
        {
            if(notOnOpenList(x,y-1)&&notOnCloseList(x,y-1))
                addToOpenList(x,y-1, x, y);
        }
        if(matrix[x][y+1] !== "taken")
        {
            if(notOnOpenList(x,y+1)&&notOnCloseList(x,y+1))
                addToOpenList(x,y+1, x, y);
        }
    }
    else if(y===9 && x < 11 && x > 0){ //bottom bar
        if(matrix[x-1][y] !== "taken")
        {
            if(notOnOpenList(x-1,y)&&notOnCloseList(x-1,y))
                addToOpenList(x-1, y, x, y);
        }
        if(matrix[x][y-1] !== "taken")
        {
            if(notOnOpenList(x,y-1)&&notOnCloseList(x,y-1))
                addToOpenList(x,y-1, x, y);
        }
        if(matrix[x+1][y] !== "taken")
        {
            if(notOnOpenList(x+1,y)&&notOnCloseList(x+1,y))
                addToOpenList(x+1,y, x, y);
        }
    }
    else{ //general
        if(matrix[x-1][y] !== "taken")
        {
            if(notOnOpenList(x-1,y)&&notOnCloseList(x-1,y))
                addToOpenList(x-1, y, x, y);
        }
        if(matrix[x][y-1] !== "taken")
        {
            if(notOnOpenList(x,y-1)&&notOnCloseList(x,y-1))
                addToOpenList(x,y-1, x, y);
        }
        if(matrix[x+1][y] !== "taken")
        {
            if(notOnOpenList(x+1,y)&&notOnCloseList(x+1,y))
                addToOpenList(x+1,y, x, y);
        }
        if(matrix[x][y+1] !== "taken")
        {
            if(notOnOpenList(x,y+1)&&notOnCloseList(x,y+1))
                addToOpenList(x,y+1,x,y);
        }
    }
}

function notOnOpenList(x, y){    
    var length = open_list.length;
    for (var i=0; i < length; i++){
        if( x=== open_list[i].x && y === open_list[i].y)
            return false;
    }
    return true;
}

function notOnCloseList(x, y){
    var length = close_list.length;
    for (var i=0; i < length; i++){
        if( x=== close_list[i].x && y === close_list[i].y)
            return false;
    }
    return true;
}

function addToOpenList(tempx, tempy, parentx, parenty){
    var parentNode = findMeOnCloseList(parentx, parenty);
    if (debug === true){
        console.log("Add me to openlist: " +tempx +" " +tempy);
    }
    if(close_list.length ===0){
        var temph = 11 - tempx + 9 - tempy;
        open_list[open_list.length] ={
            x : tempx,
            y : tempy,
            px : parentx,
            py : parenty,
            g : 0,
            h : temph
        };
    }
    else{
        var tempg = close_list[parentNode].g;
        var temph = 11 - tempx + 9 - tempy;
        open_list[open_list.length] ={
            x : tempx,
            y : tempy,
            px: parentx,
            py: parenty,
            g : tempg + 1,
            h : temph
        };
        if (debug ===true){
            console.log("adding openlist x " +open_list[open_list.length-1].x);
            console.log("adding openlist y " +open_list[open_list.length-1].y);
            console.log("adding openlist g " +open_list[open_list.length-1].g);
            console.log("adding openlist h " +open_list[open_list.length-1].h);
        }
    }
}

function addToCloseList(i){
    if(debug === true){
        console.log("adding me to close list: " +open_list[i].x +" " +open_list[i].y);
    }
    close_list[close_list.length] ={
            px: open_list[i].px,
            py: open_list[i].py,
            x : open_list[i].x,
            y : open_list[i].y,
            g : open_list[i].g,
            h : open_list[i].h
        };
     open_list.splice(i, 1);
}
function findMeOnOpenList(tempx, tempy){
    if(debug === true){
        console.log("let's try to find on open list: " +tempx +" " +tempy);
    }
    for(var i=0; i<open_list.length; i++){
        if(tempx === open_list[i].x && tempy === open_list[i].y)
            return i;
    }
}

function findMeOnCloseList(tempx, tempy){
    if(debug === true){
        console.log("let's try to find on close list: " +tempx +" " +tempy);
    }
    for(var i=0; i<close_list.length; i++){
        if(tempx === close_list[i].x && tempy === close_list[i].y)
            return i;
    }
}

function foreverAlone(){
    for (var i = 1; i < 99999; i++){
        window.clearInterval(i);
    }
    died_image = new Image();
    died_image.onload = function(){
        loadForeverAlone(died_image);
    }
    died_image.src = "img/forever_alone_large.png";
}

function loadForeverAlone(died_image){
    var died = new Kinetic.Image({
                image: died_image,
                x: 0,
                y: 0
    });
    enemy_layer.add(died);
    died.moveToTop();
    enemy_layer.draw();
}