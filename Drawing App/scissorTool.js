function ScissorTool(){
    
    this.icon = "assets/scissor.jpg";
    this.name = "scissor";
    
    var selectMode
    //0 - do nothing - free hand mode
    //1 - select area to cut
    //2 - paste
    var selectedArea;
    
    var selectButton;
    var selectedPixels; //store the cut pixels
    
    this.previousMouseX = -1;
    this.previousMouseY = -1;
    
    var angleSlider;
    var rotateAngle=0;
    
    this.draw = function(){
      if(mouseIsPressed){
         if(!mouseOnCanvas(canvas)){
             return
         }
          if(selectMode==0){ //freehand tool
              
              if(this.previousMouseX==-1){
                this.previousMouseX = mouseX;
                this.previousMouseY = mouseY;
              }else{
                  stroke(0);
                  noFill();
                  line(this.previousMouseX,
                       this.previousMouseY,
                       mouseX,mouseY);
                  this.previousMouseX = mouseX;
                  this.previousMouseY = mouseY;
              }
          }else if(selectMode==1){
              updatePixels();
              noStroke();
              fill(125,0,0,100);
              rect(selectedArea.x,
                   selectedArea.y,
                   selectedArea.w,
                   selectedArea.h);
          } 
      }
        else{
            
            if(selectMode==2){
                updatePixels(); //save curent canvas
                fill(0,0,255,100);
                
                push();
                translate(mouseX,mouseY);
                rotateAngle = radians(angleSlider.value());
                rotate(rotateAngle);
                rect(-selectedArea.w/2+10,
                     -selectedArea.h/2+10,
                    selectedArea.w-20,
                    selectedArea.h-20)
                
                pop();
                
                /*rect(mouseX-selectedArea.w/2+10,
                    -selectedArea.h/2+10,
                    selectedArea.w-20,
                    selectedArea.h-20);*/
            }
            
            //if user release mouse, set both mouse pos to -1
            this.previousMouseX = -1;
            this.previousMouseY = -1;
        }
        
    }
    
    this.selectButtonClicked = function(){
       console.log("ST button pressed");
        if(selectMode==0){
            selectMode+=1;
            selectButton.html("cut");
            loadPixels();//store the current frame
        }else if(selectMode==1){
            selectMode+=1;
            selectButton.html("end paste");
            updatePixels(); //refresh screen
            
            //store cut pixels
            selectedPixels = get(selectedArea.x,
                                 selectedArea.y,
                                 selectedArea.w,
                                 selectedArea.h);
        
        //draw a white rect over the selected area
        fill(255);
        noStroke();
        rect(selectedArea.x,
             selectedArea.y,
             selectedArea.w,
             selectedArea.h)
        }else if(selectMode==2){
             selectMode = 0;
             updatePixels();
             selectedArea = {x:0,y:0,w:100,h:100};
             selectButton.html("select area");
        }
        
    }
    
    this.unselectTool = function(){
        select(".options").html(""); 
    
    }
    
    this.populateOptions = function(){
        selectMode = 0;
        selectedArea = {x:0,y:0,w:100,h:100};
        
        selectButton = createButton("select area");
        selectButton.parent("#options");
        selectButton.mousePressed(this.selectButtonClicked);
        
        angleSlider = createSlider(0,360,0);
        angleSlider.parent("#options");
    }
    
    this.mousePressed = function(){
      
        if(!mouseOnCanvas(canvas)){
            return;
        }
        
        if(selectMode==1){
           selectedArea.x = mouseX;
           selectedArea.y = mouseY;  
       }else if(selectMode==2){
           
           push();
           translate(mouseX,mouseY);
           rotateAngle = radians(angleSlider.value());
           rotate(rotateAngle);
           image(selectedPixels,
                -selectedArea.w/2,
                -selectedArea.h/2);
           pop();
           
           /*image(selected Pixels,
                   mouseX-selectedArea.w/2,
                   mouseY-selectedArea.h/2);
           */
           
           loadPixels();
       }
    }
    
    this.mouseDragged = function(){
     if(selectMode==1){
         var w = mouseX - selectedArea.x;
         var h = mouseY - selectedArea.y;
         selectedArea.w = w;
         selectedArea.x = h;
      }
        console.log(selectedArea);
    }   
}