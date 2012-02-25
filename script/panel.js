function loadKitchen(sources, callback){
    console.log("loading kitchen........");
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    console.log("image count " +numImages);
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function(){
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

function isNearOutline(animal, outline){
    var a = animal;
    var o = outline;
    if (a.x > o.x - 20 && a.x < o.x + 20 && a.y > o.y - 20 && a.y < o.y + 20) {
        return true;
    }
    else {
        return false;
    }
}

function drawBackground(background, background_image, text){
    var canvas= background.getCanvas();
    var context = background.getContext();
    context.drawImage(background_image, 0, 0);
    
    context.font = "38pt Calibri";
    context.textAlign = "right";
    context.fillStyle = "orange";
    context.fillText(text, canvas.width, 38);
}

function initKitchen(images){
    console.log("initing kitchen.......");
    var stage = new Kinetic.Stage("main", 1024, 640);
    var background = new Kinetic.Layer();
    var stuff_layer = new Kinetic.Layer();
    
    var stuffs = {
        ds: {
            x: 770,
            y: 66
        },
    };
    
    for(var key in stuffs){
        (function(){
            var privous_key = key;
            var st = stuffs[key];
            
            var stuff = new Kinetic.Image({
                image: images[key],
                x: 0,
                y: 0
            });
           
            stuff.x = st.x;
            stuff.y = st.y;
            console.log(stuff.x, stuff.y);
            stuff.draggable(true);
            stuff.on("dragstart", function(){
                stuff.moveToTop();
                stuff_layer.draw();
            })
            
            stuff.on("dragend", function(){
                stuff.draggable(false);
            });
            
            stuff.on("mouseover", function(){
                stuff.setImage(images[privous_key + "_glow"]);
                stuff_layer.draw();
                document.body.style.cursor = "pointer";
            });
            
            stuff.on("mouseout", function(){
                stuff.setImage(images[privous_key]);
                stuff_layer.draw();
                document.body.style.cursor = "default";
            });
            
            stuff_layer.add(stuff);
        })();
    }
    
    stage.add(background);
    stage.add(stuff_layer);
    
    drawBackground(background, images.background, "CRAZY CHEF");
}
    