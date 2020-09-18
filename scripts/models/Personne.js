class Personne extends CanvasElement{

    constructor(cvs) {
        super(cvs);
    }

    draw()
    {

        this.canvas.beginPath();
        this.canvas.fillStyle="#f57611";
        this.canvas.arc(300, 300, 15, 0, 2 * Math.PI);
        this.canvas.fill();
        this.canvas.stroke();

    }

}