const inputHandler = document.querySelector("#launchModel");
inputHandler.addEventListener("click",()=>{
    document.querySelector("h1").innerHTML = "Modélisation en cours";
    document.querySelector("#begin").style.visibility = "hidden";
    const nb = document.querySelector("#boules").value;
    document.querySelector("div").style.visibility = "visible";
    let cvs = document.querySelector("#cvs");
    let ctx = cvs.getContext("2d");
    const obstacles = [];
    const hasObstacle = document.querySelector("#avec").checked
    if(hasObstacle) {
        obstacles[0] = new Obstacle(ctx, 250, 250, 250, 500);
        obstacles[1] = new Obstacle(ctx, 250, 250, 500, 400);
        obstacles[2] = new Obstacle(ctx, 250, 500, 500, 400);
    }
    let piece = new Piece(ctx,100,100,500,800,50,nb,obstacles,hasObstacle);
    piece.drawPiece();
    for (const obstacle of obstacles) {
        obstacle.draw();
    }
    for (const pieceElement of piece.personnes) {
        pieceElement.draw();
    }
    const gr = new ModelRender(ctx,20,piece);
    gr.update();
});