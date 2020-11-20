let cvs = document.querySelector("#cvs");
const COLOR = 'black';
let ctx = cvs.getContext("2d");
let piece = new Piece(ctx,100,100,500,800,50,40);
piece.drawPiece();
for (const pieceElement of piece.personnes) {
    pieceElement.draw();
}
let gr = new GameRender(20,piece);
gr.update();