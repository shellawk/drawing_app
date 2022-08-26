function RectTool(){

       this.icon = "assets/rect.jpg";
       this.name = "rect";
       var previousMouseX = -1;
       var previousMouseY = -1;
       var firstMouseX = -1;
       var firstMouseY = -1;
       var dropbox = null;


        this.draw = function(){
            console.log("in rect tool");
            if(!mouseOnCanvas(canvas)){
                return;  
            }
            //if mouse is pressed
            if(mouseIsPressed){
                 if(dropbox.value()=="Filled"){
                     fill(colourP.selectedColour);
                 }else{
                     noFill();
                 } 
                   //check if previousX and Y are -1
                   //if yes, set them to the current mouse X and mouse Y
                   if(previousMouseX == -1){
                       previousMouseX = mouseX;
                       previousMouseY = mouseY;
                       firstMouseX = mouseX;
                       firstMouseY = mouseY;
                   }else{
                       //erase the old rect
                       updatePixels();
                       var rLength = (mouseX - firstMouseX);
                       var rWidth = (mouseY - firstMouseY);
                       rect(firstMouseX, firstMouseY, rLength, rWidth);
                       previousMouseX = mouseX;
                       previousMouseY = mouseY;
                   }
            }else{
                previousMouseX = -1;
                previousMouseY = -1;
                //save the canvas pixel
                loadPixels();
            }
        }

        //call when the tool icon is selected
         this.populateOptions = function(){
            dropbox = createSelect();
            dropbox.option("Filled");
            dropbox.option("Unfilled");
            dropbox.parent("#options");
       }
      
          this.unselectTool = function(){
                 select("#options").html("");
       }
         

}