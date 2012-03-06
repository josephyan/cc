var tile = new Array(width);
for (var i = 0; i < width; i++) {
    tile[i] = new Array(height);
    for (var j = 0; j < height; j++) {
         tile[i][j] = null;
    }
}

function loadBackground(sources){
    console.log("Loadinging background");
    
    //Fill background
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
               initBackground(images);
            }
        };
        images[src].src = sources[src];
    }
}
function initBackground(images){
    /*var backgrounds = {
        tile: {
            x: 0,
            y: 0
        },
    };
    */
    /*for(var key in backgrounds){
        var background = new Kinetic.Image({
            image: images[key],
            x: 0,
            y: 0
        });
        background.x = backgrounds[key].x;
        background.y = backgrounds[key].y;
        
        layer.add(background);
    }*/
    
    for(var i = 0; i<width; i++){
        for(var j = 0; j<height; j++){
            tile[i][j] = new Kinetic.Image({
                image: images["tile"],
                x: 0,
                y: 0
            });
            tile[i][j].x = i*64;
            tile[i][j].y = j*64;
            layer.add(tile[i][j]);
        }
    }
    
        //make start and stop button
    var circle = new Kinetic.Circle({
         x: 0,
         y: 0,
         radius: 28,
         fill: "#00d00f",
         stroke: "black",
         strokeWidth: 4
    });
    circle.x = width * 64 + 32;
    circle.y = (height-1) * 64 + 32;
    
    circle.on("click", function(){
        if( running === false){
            runEnemy();
            running = true;
            //stage.start();
        }
        else{
            for (var i = 1; i < 99999; i++){
                window.clearTimeout(i);
            }
            running = false;
            //stage.stop();
        }
        var fill = this.getFill() == "red" ? "#00d00f" : "red";
        this.setFill(fill);
        layer.draw();
        
    }); 
    
    layer.add(circle);
    layer.draw();
 }