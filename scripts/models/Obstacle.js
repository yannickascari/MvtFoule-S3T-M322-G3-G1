class Obstacle extends CanvasElement{

    constructor(cvs,x,y,x1,y1) {
        super(cvs);
        this.pos = [[x,y],[x1,y1]]
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
    }

    draw()
    {
        this.canvas.beginPath();
        this.canvas.strokeStyle = COLOR;
        this.canvas.moveTo(this.x,this.y);
        this.canvas.lineTo(this.x1,this.y1);
        this.canvas.stroke();
    }

    get NVector()
    {
        let y1 = this.x1 - this.x;
        let x1 = -(this.y1 - this.y);
        if(this.length === 0)
        {
            x1 = 0;
            y1 = 1;
        }
        else{
            x1/=this.length;
            y1/=this.length;
        }
        return {
            x : x1,
            y : y1
        }
    }

    get length()
    {
        let y = this.x1 - this.x;
        let x = -(this.y1 - this.y);
        return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    }

}