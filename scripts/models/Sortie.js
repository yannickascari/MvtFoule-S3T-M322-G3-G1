class Sortie extends CanvasElement{

    constructor(cvs,x_a,y_a,x,y) {
        super(cvs);
        this.x_a = x_a;
        this.y_a = y_a;
        this.x = x;
        this.y = y;
    }

    draw()
    {

        this.canvas.moveTo(this.x_a,this.y_a);
        this.canvas.lineTo(this.x,this.y);
        this.canvas.strokeStyle = 'white';
        this.canvas.stroke();

    }

}