const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let currentColor = "#000000";
let currentSize = 5;

let rainbowMode = false;
let hue = 0;

let undoStack = [];
let redoStack = [];

/* =====================
   CANVAS SIZE
===================== */

function resizeCanvas() {

    const snapshot = canvas.toDataURL();

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight * 0.7;

    const img = new Image();

    img.onload = () => {
        ctx.drawImage(img,0,0);
    };

    img.src = snapshot;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

/* =====================
   SAVE STATE
===================== */

function saveState(){

    undoStack.push(
        canvas.toDataURL()
    );

    if(undoStack.length > 30){
        undoStack.shift();
    }

    redoStack = [];
}

saveState();

/* =====================
   POSITION
===================== */

function getPosition(e){

    const rect =
    canvas.getBoundingClientRect();

    if(e.touches){

        return{

            x:
            e.touches[0].clientX
            - rect.left,

            y:
            e.touches[0].clientY
            - rect.top
        };
    }

    return{

        x:e.clientX - rect.left,

        y:e.clientY - rect.top
    };
}

/* =====================
   DRAWING
===================== */

function startDrawing(e){

    drawing = true;

    saveState();

    const pos =
    getPosition(e);

    ctx.beginPath();

    ctx.moveTo(
        pos.x,
        pos.y
    );
}

function draw(e){

    if(!drawing) return;

    const pos =
    getPosition(e);

    ctx.lineWidth =
    currentSize;

    ctx.lineCap =
    "round";

    if(rainbowMode){

        ctx.strokeStyle =
        `hsl(${hue},100%,50%)`;

        hue++;

    }else{

        ctx.strokeStyle =
        currentColor;
    }

    ctx.lineTo(
        pos.x,
        pos.y
    );

    ctx.stroke();
}

function stopDrawing(){

    drawing = false;

    ctx.beginPath();
}

/* =====================
   EVENTS
===================== */

canvas.addEventListener(
    "mousedown",
    startDrawing
);

canvas.addEventListener(
    "mousemove",
    draw
);

canvas.addEventListener(
    "mouseup",
    stopDrawing
);

canvas.addEventListener(
    "mouseleave",
    stopDrawing
);

canvas.addEventListener(
    "touchstart",
    startDrawing
);

canvas.addEventListener(
    "touchmove",
    draw
);

canvas.addEventListener(
    "touchend",
    stopDrawing
);

/* =====================
   COLOR PICKER
===================== */

document
.getElementById(
"colorPicker"
)
.addEventListener(
"change",
(e)=>{

currentColor =
e.target.value;

rainbowMode =
false;

}
);

/* =====================
   BRUSH SIZE
===================== */

document
.getElementById(
"brushSize"
)
.addEventListener(
"input",
(e)=>{

currentSize =
e.target.value;

}
);

/* =====================
   PENCIL
===================== */

document
.getElementById(
"pencilBtn"
)
.onclick = ()=>{

rainbowMode =
false;

};

/* =====================
   ERASER
===================== */

document
.getElementById(
"eraserBtn"
)
.onclick = ()=>{

rainbowMode =
false;

currentColor =
"#ffffff";

};

/* =====================
   RAINBOW
===================== */

document
.getElementById(
"rainbowBtn"
)
.onclick = ()=>{

rainbowMode =
true;

};

/* =====================
   CLEAR
===================== */

document
.getElementById(
"clearBtn"
)
.onclick = ()=>{

if(
confirm(
"Clear board?"
)
){

saveState();

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

}
};

/* =====================
   UNDO
===================== */

document
.getElementById(
"undoBtn"
)
.onclick = ()=>{

if(
undoStack.length <= 1
) return;

redoStack.push(
undoStack.pop()
);

let img =
new Image();

img.onload = ()=>{

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

ctx.drawImage(
img,
0,
0
);

};

img.src =
undoStack[
undoStack.length-1
];
};

/* =====================
   REDO
===================== */

document
.getElementById(
"redoBtn"
)
.onclick = ()=>{

if(
redoStack.length === 0
) return;

const state =
redoStack.pop();

undoStack.push(
state
);

let img =
new Image();

img.onload = ()=>{

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

ctx.drawImage(
img,
0,
0
);

};

img.src =
state;
};

/* =====================
   SAVE PNG
===================== */

document
.getElementById(
"saveBtn"
)
.onclick = ()=>{

const link =
document.createElement(
"a"
);

link.download =
"writing-board.png";

link.href =
canvas.toDataURL(
"image/png"
);

link.click();
};

/* =====================
   SHARE
===================== */

document
.getElementById(
"shareBtn"
)
.onclick = async()=>{

try{

canvas.toBlob(
async(blob)=>{

const file =
new File(
[blob],
"writing-board.png",
{
type:"image/png"
}
);

if(
navigator.canShare &&
navigator.canShare(
{files:[file]}
)
){

await navigator.share({

title:
"Writing Board",

text:
"Check out my drawing!",

files:[file]

});

}else{

alert(
"Sharing not supported on this device."
);

}

},
"image/png"
);

}catch(error){

console.log(
error
);

}
};

/* =====================
   DARK MODE
===================== */

document
.getElementById(
"darkBtn"
)
.onclick = ()=>{

document.body
.classList.toggle(
"dark"
);

};

/* =====================
   GRID PAPER
===================== */

document
.getElementById(
"gridBtn"
)
.onclick = ()=>{

canvas.style.backgroundImage =

`
linear-gradient(
#ddd 1px,
transparent 1px
),
linear-gradient(
90deg,
#ddd 1px,
transparent 1px
)
`;

canvas.style.backgroundSize =
"25px 25px";
};

/* =====================
   NOTEBOOK LINES
===================== */

document
.getElementById(
"lineBtn"
)
.onclick = ()=>{

canvas.style.backgroundImage =

`
repeating-linear-gradient(
white,
white 29px,
#dbeafe 30px
)
`;
};