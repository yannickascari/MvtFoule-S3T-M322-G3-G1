let cvs = document.querySelector("#cvs");
let ctx = cvs.getContext("2d");
let piece = new Piece(ctx,100,100,500,500,50);
piece.drawPiece();
let pers = new Personne(ctx);
pers.draw();