class GameRender{

    /**
     *
     * @param fps
     * @param {Piece} piece
     */

    constructor(fps,piece) {

        this.fps = fps;
        this.piece = piece;
        this.updtadeFct = null;

    }

    update()
    {
        this.updtadeFct = setInterval(()=>{
            ctx.clearRect(this.piece.cst_x, this.piece.cst_y, this.piece.w, this.piece.h);
            for (const personne of this.piece.personnes) {
                personne.move();
                personne.draw();
            }
        },this.fps);
    }

}