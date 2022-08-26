  function EllipseTool(){
    this.icon = "assets/ellipse.jpg";
    this.name = "ellipse";
    var previousMouseX = -1;
    var previousMouseY = -1;
    var firstMouseX = -1;
    var firstMouseY = -1;
    var dropbox = null;
      
    this.draw = function(){
    
        if(!mouseOnCanvas(canvas)) {
         return;
      }
        
      if(mouseIsPressed){
         //determine if is filled or unfilled eclipse

          if(dropbox.value()=="Filled"){
             fill(colourP.selectedColour);
          }else{
               noFill();
          }

            if(previousMouseX == -1){
                previousMouseX = mouseX;
                previousMouseY = mouseY;
                firstMouseX = mouseX;
                firstMouseY = mouseY;
            }
            else{
              updatePixels();
              var rLength = (mouseX-firstMouseX)*2;
              var rWidth = (mouseY-firstMouseY)*2;
              ellipse(firstMouseX+rLength/2, firstMouseY+rWidth/2,rLength, rWidth);
             previousMouseX = mouseX;
             previousMouseY = mouseY;
           }
        }
         else{
           previousMouseX = -1;
           previousMouseY = -1;
           loadPixels();
         }
       };

          this.populateOptions = function(){
          dropbox = createSelect();
          dropbox.option("Filled");
          dropbox.option("Unfilled");
          dropbox.parent ("#options");
          }

         this.unselectTool = function(){
             select("#options").html("");
         }
  }
