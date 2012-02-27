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
    var backgrounds = {
        background: {
            x: 0,
            y: 0
        },
    };
    
    for(var key in backgrounds){
        (function(){
            var privous_key = key;
            var background = new Kinetic.Image({
                image: images[key],
                x: 0,
                y: 0
            });
            background.x = backgrounds[key].x;
            background.y = backgrounds[key].y;
            
            layer.add(background);
        })();
    }
    
        //make start and stop button
    var circle = new Kinetic.Circle({
         x: 805,
         y: 605,
         radius: 28,
         fill: "#00d00f",
         stroke: "black",
         strokeWidth: 4
    });
    
    circle.on("click", function(){
        if( running === false){
            runEnemy();
            running = true;
        }
        else{
            for (var i = 1; i < 99999; i++){
                window.clearInterval(i);
            }
            running = false;
        }
        var fill = this.getFill() == "red" ? "#00d00f" : "red";
        this.setFill(fill);
        layer.draw();
        
    }); 
    
    layer.add(circle);
    layer.draw();
 }