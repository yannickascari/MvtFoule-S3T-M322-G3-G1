class Piece extends CanvasElement{

    static COLOR = 'black';

    constructor(cvs,x,y,h,w,h_s) {
        super(cvs);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.h_s = h_s;
    }

    drawLine(a_x,a_y)
    {

        ctx.beginPath();
        this.canvas.strokeStyle = Piece.COLOR;
        this.canvas.moveTo(this.x,this.y);
        this.canvas.lineTo(this.x+a_x,this.y+a_y);
        this.canvas.stroke();

    }

    drawPiece()
    {

        this.drawLine(this.w,0);
        this.x += this.w;
        this.drawLine(0,this.h);
        this.y += this.h;
        this.drawLine(-this.w,0);
        this.x -= this.w;
        this.y -= this.h;
        this.drawLine(0,(this.h/2)-(this.h_s/2));
        this.y += this.h/2+this.h_s/2;
        this.drawLine(0,(this.h/2)-(this.h_s/2));

    }

}