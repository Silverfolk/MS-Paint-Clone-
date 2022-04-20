const activeToolEl=document.getElementById('active-tool');
const brushColorBtn=document.getElementById('brush-color');
const brushIcon=document.getElementById('brush');
const brushSize=document.getElementById('brush-size');
const brushSlider=document.getElementById('brush-slider');
const eraser=document.getElementById('eraser');
const clearCanvasBtn=document.getElementById('clear-canvas');
const saveStorageBtn=document.getElementById('save-storage');
const loadStorageBtn=document.getElementById('load-storage');
const clearStorageBtn=document.getElementById('clear-storage');
const downloadBtn=document.getElementById('download');
const bucketColorBtn=document.getElementById('bucket-color');
const {body}=document;


// Global Variables
const canvas=document.createElement('canvas');
canvas.id='canvas';
const context=canvas.getContext('2d');
// once we created a context we want to get it into the body
let currentSize=10;
let bucketColor= "#FFFFFF";
let currentColor='#A51DAB';
let isEraser=false;
let isMouseDown=false;
let drawnArray=[];

// Create Canvas
function createCanvas(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight-50;
    context.fillStyle=bucketColor;//bucket color here is our background color 
    context.fillRect(0,0,canvas.width,canvas.height);
    body.appendChild(canvas);
    switchToBrush();//as while page is loaded we want brush to be selected by default
}



  // Setting Brush Size 
  brushSlider.addEventListener('change',()=>{
   currentSize=`${brushSlider.value}`;
   displayBrushSize();
  });

  // Formatting Brush Size
function displayBrushSize(){
  if(currentSize<10){
    brushSize.innerText=`0${brushSlider.value}`;
  }
  else{
 brushSize.innerText =brushSlider.value;
  }
}

  // Setting Brush Color 
  brushColorBtn.addEventListener('change',()=>{
     currentColor=`#${brushColorBtn.value}`;//as current will not pass # so template string will be like this
      isEraser=false;
      
    });

  // Setting Background Color 
  bucketColorBtn.addEventListener('change',()=>{
    bucketColor=`#${bucketColorBtn.value}`//as bucketcolor will not pass '#' 
    createCanvas();//as value will be update 
    restoreCanvas();//  in order to store previous made line we use restore canvas to restore previous data
  });

  // Note:-Eraser will act as same as brush whose color is same as that of background color
  // Eraser
  eraser.addEventListener('click',()=>{
   isEraser=true;
   brushIcon.style.color='white';
   eraser.style.color='black';
   activeToolEl.textContent='Eraser';
   currentColor=bucketColor;
   currentSize=10;//change
  });

  // Switch back to Brush
  function switchToBrush(){
    isEraser=false;
    brushIcon.style.color='black';
    eraser.style.color='white';
    activeToolEl.textContent='Brush';
    currentColor=`#${brushColorBtn.value}`;
    currentSize=10;
    brushSlider.value=10;
    displayBrushSize();
  }

  // Get Mouse Position
  function getMousePosition(event){
    const boundaries=canvas.getBoundingClientRect();
    return{
      // it will return x and y co-ordinate
      x:event.clientX-boundaries.left,
      y:event.clientY-boundaries.top,
    };
  }

  // Mouse Down
  canvas.addEventListener('mousedown',(event)=>{
    isMouseDown = true;
    const currentPosition = getMousePosition(event);
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentSize;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
  
  });



  // Mouse Move
canvas.addEventListener('mousemove', (event) => {
  
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser
    );
  } else {
    storeDrawn(undefined);
  } 
  
}); 

  // Mouse Up
  canvas.addEventListener('mouseup',()=>{
 isMouseDown=false;
  });

  // Clear Canvas 
  clearCanvasBtn.addEventListener('click',()=>{
    createCanvas();
    drawnArray=[];
    // Active Tool
    activeToolEl.innerText='Canvas Cleared';//edited
    setTimeout(switchToBrush,1500);
  })

  // Draw what is stored in DrawnArray
  function restoreCanvas(){
    for (let i = 1; i < drawnArray.length; i++) {
      context.beginPath();
      context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
      context.lineWidth = drawnArray[i].size;
      context.lineCap = 'round';
      if (drawnArray[i].eraser) {
        context.strokeStyle = bucketColor;
      } else {
        context.strokeStyle = drawnArray[i].color;
      }
      context.lineTo(drawnArray[i].x, drawnArray[i].y);
      context.stroke();
    }
  };
  // Store Drawn Lines DrawnArray
  function storeDrawn(x,y,size,color,erase){
    const line={
      x,
      y,
      size,
      color,
      erase,
    };
    console.log(line);
    drawnArray.push(line);
  }

  // Save To Local Storage
  saveStorageBtn.addEventListener('click',()=>{
     localStorage.setItem('savedCanvas',JSON.stringify(drawnArray));//here we are storing drawingArray object into localStorage and localStorage store the data in the form of string so we are converting it-->instead of 'savedCanvas' we can also give some other name ye bas khali ek naam hai "similar as we store in hashmap where one side we have key and other side we have value"
    //  Active Tool
    activeToolEl.textContent='Canvas Saved';
    setTimeout(switchToBrush,1500);
    });

  // Load from Local Storage
  loadStorageBtn.addEventListener('click',()=>{
   if(localStorage.getItem('savedCanvas')){//if only there is something in localstorage then it will work
    drawnArray=JSON.parse(localStorage.savedCanvas);//as the string we have saved in our localStorage will now be converted into object to get those drawing back in our app
    restoreCanvas();

    //  Active Tool
    activeToolEl.textContent='Canvas Loaded';
    setTimeout(switchToBrush,1500);
   }
   else{
     //  Active Tool
    activeToolEl.textContent='No Canvas Found';
    setTimeout(switchToBrush,1500);
   }
  });

  // Clear Local Storage
  clearStorageBtn.addEventListener('click',()=>{
    localStorage.removeItem('savedCanvas');
   
    //  Active Tool
    activeToolEl.textContent='Local Storage Cleared';
    setTimeout(switchToBrush,1500);
  });

  // Download Image
  downloadBtn.addEventListener('click',()=>{
    downloadBtn.href=canvas.toDataURL('image/jpeg',1);//The HTMLCanvasElement.toDataURL() method returns a data URI containing a representation of the image in the format specified by the type parameter.
    downloadBtn.download='Silverfolk-img.jpeg';
  })

  // Event Listener
  brushIcon.addEventListener('click',switchToBrush);

  // On Load 
  createCanvas();