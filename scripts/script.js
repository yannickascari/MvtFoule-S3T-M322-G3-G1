let cvs = document.querySelector("#cvs");
let ctx = cvs.getContext("2d");
ctx.beginPath();
ctx.strokeStyle = 'black';
ctx.strokeRect(100,100,500,500);
let sortie = new Sortie(ctx,100,300,100,350);
sortie.draw();