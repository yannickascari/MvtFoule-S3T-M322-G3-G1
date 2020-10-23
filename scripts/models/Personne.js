class Personne extends CanvasElement{

    constructor(cvs,obj) {
        super(cvs);
        this.x = obj.x;
        this.y = obj.y;
        this.r = obj.r;
    }

    draw()
    {

        this.canvas.beginPath();
        this.canvas.fillStyle="#f57611";
        this.canvas.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.canvas.fill();
        this.canvas.stroke();

    }

    move()
    {

        this.x++;

    }

}