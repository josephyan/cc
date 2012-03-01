var path = [];
var current_enemy = null;

var open_list = new Array(12);
for (var i = 0; i < 12; i++) {
    open_list[i] = new Array(10);
    for (var j = 0; j < 10; j++) {
         open_list[i][j] = false;
    }
}
var close_list = new Array(12);
for (var i = 0; i < 12; i++) {
    close_list[i] = new Array(10);
    for (var j = 0; j < 10; j++) {
         close_list[i][j] = false;
    }
}
var current_node_x = 0;
var current_node_y = 0;

var move_counter = 32;
var id = null;
var life = 100;

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
            x: 4,
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
            enemy.hide();
        })();
    }
    enemy_layer.draw();
    initEnemyRun();
}

function initEnemyRun(){
    for (var i = 0; i < 12; i++) {
        open_list[i] = new Array(10);
        for (var j = 0; j < 10; j++) {
            open_list[i][j] = false;
        }
    }
    for (var i = 0; i < 12; i++) {
        close_list[i] = new Array(10);
        for (var j = 0; j < 10; j++) {
             close_list[i][j] = false;
        }
    }
    path = [];
    current_enemy = enemy_layer.getChildren();
    current_enemy[0].show();
    var coordinate = current_enemy[0].getPosition();
    var x = Math.round(coordinate.x/64) ;
    var y = Math.round(coordinate.y/64) ;
    addToOpenList(x, y, x, y);
    addToCloseList(x, y);
    current_node_x = x;
    current_node_y = y;
    findPath(x,y);
    printTrace(x,y, 11, 9);
    matrix[x][y] =="walking";
}

function initForPathFinding(){
    for (var i = 0; i < 12; i++) {
        open_list[i] = new Array(10);
        for (var j = 0; j < 10; j++) {
            open_list[i][j] = false;
        }
    }
    for (var i = 0; i < 12; i++) {
        close_list[i] = new Array(10);
        for (var j = 0; j < 10; j++) {
             close_list[i][j] = false;
        }
    }
    current_enemy = enemy_layer.getChildren();
    var coordinate = current_enemy[0].getPosition();
    var x = Math.round(coordinate.x/64);
    var y = Math.round(coordinate.y/64);
    addToOpenList(x, y, x, y);
    addToCloseList(x, y);
    current_node_x = x;
    current_node_y = y;
    matrix[x][y]="walking";
}

function runEnemy(){
    var i = path.length -1;
    var j = path.length -2;
    var x = path[j].x - path[i].x;
    var y = path[j].y - path[i].y;

    if(life === 0)
    {
        current_enemy = enemy_layer.getChildren();
        //enemy_layer.remove(current_enemy[0]);
        enemy_layer.draw();
    }
    else if(move_counter === 32){
        if (recalculate === true){
            console.log("recalculating");
            path = [];
            var coordinate = current_enemy[0].getPosition();
            var x = Math.round(coordinate.x/64) ;
            var y = Math.round(coordinate.y/64) ;
            printTrace(x,y, 11, 9);
            recalculate = false;
        }
        else{
            matrix[path[j].x][path[j].y] = "walking";
            matrix[path[i].x][path[i].y] = "empty";
            path.pop();
            move_counter = 1;
            if (path.length === 1)
                foreverAlone();
            move(x, y);
        }
    }    
    else{
        move_counter = move_counter + 1;
        move(x, y);
    }
    detect();
    id = setTimeout(runEnemy, 40);
}

function move(x, y){
    current_enemy = enemy_layer.getChildren();
    current_enemy[0].move(x*2, y*2);
    enemy_layer.draw();
    return true;
}

function findPath(x,y){
    if (x === 11 && y ===9){
        console.log("path found");
        return true;
    }
    else{
        //find openspot and add them to the openlist
        findOpen(x, y);
        //find the shortest F on openlist and move it to closed list
        //no path avaiable if search same node on close list twice
        //or open list is empty, but still no path avaiable
        if (findShortest()=== false){
            console.log("no path found")
            return false;
        }
        else{
            return findPath(current_node_x, current_node_y);
        }
    }
}

function printTrace(ox, oy, dx, dy){
    if (ox === dx && oy ===dy){
        path[path.length] = {x:dx, y:dy};
        path[path.length] = {x:dx, y:dy};
        //path.reverse();
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
        printTrace(ox, oy, close_list[dx][dy].px, close_list[dx][dy].py);
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
    var min_f = 1000;
    var min_i = 0;
    var min_j = 0;
    var current_f = 0;
    for(var i = 0; i< 12; i++){
        for(var j = 0; j<10; j++){
            if (open_list[i][j] !== false){
                current_f = open_list[i][j].h+open_list[i][j].g;
                if(current_f < min_f){
                    min_f = current_f;
                    min_i = i;
                    min_j = j;
                }
            }
        }
    }
    if (min_f !== 1000){
        addToCloseList(min_i, min_j);
        return true;
    }
    else{
        return false;
    }
}

function findOpen(x, y){
    //check souranding
    //check if it's on openlist
    //if not, add
    //console.log("Trying to find open for: " +x +" " +y);
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
    if(open_list[x][y] === false)
        return true;
    else
        return false;
}

function notOnCloseList(x, y){
    if(close_list[x][y] === false)
        return true;
    else
        return false;
}

function addToOpenList(tempx, tempy, parentx, parenty){
    var temph = 11 - tempx + 9 - tempy;
    if(tempx === parentx && tempy === parenty){
        open_list[tempx][tempy]={
            px: parentx,
            py: parenty,
            g: 0,
            h: temph
        }
    }
    else{
        open_list[tempx][tempy]={
            px: parentx,
            py: parenty,
            g: close_list[parentx][parenty].g+1,
            h: temph
        };
    }
}

function addToCloseList(x, y){
     close_list[x][y] = {
        px: open_list[x][y].px,
        py: open_list[x][y].py,
        g: open_list[x][y].g,
        h: open_list[x][y].h
     };
     current_node_x = x;
     current_node_y = y;
     open_list[x][y] = false;
}

function foreverAlone(){
    //for (var i = 1; i < 99999; i++){
    console.log("id" +id);
       clearTimeout(id);
    //}
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