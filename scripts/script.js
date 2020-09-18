let cvs = document.querySelector("#cvs");
let ctx = cvs.getContext("2d");
ctx.beginPath();
ctx.strokeStyle = 'black';
ctx.strokeRect(100,100,500,500);
ctx.moveTo(100,200);
ctx.lineTo(100,300);
ctx.strokeStyle = 'white';
ctx.stroke();