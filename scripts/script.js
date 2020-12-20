let cvs = document.querySelector("#cvs");
const COLOR = 'black';
let ctx = cvs.getContext("2d");
const obstacles = [];
obstacles[0] = new Obstacle(ctx,250,250,250,500);
obstacles[1] = new Obstacle(ctx,250,250,300,400);
obstacles[2] = new Obstacle(ctx,300,400,250,500);
let piece = new Piece(ctx,100,100,500,800,50,N,obstacles);
piece.drawPiece();
for (const obstacle of obstacles) {
    obstacle.draw();
}
for (const pieceElement of piece.personnes) {
    pieceElement.draw();
}
const gr = new ModelRender(20,piece);
gr.update();