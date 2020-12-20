class Obstacle extends CanvasElement{

    constructor(cvs,x,y,x1,y1) {
        super(cvs);
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
    }

    draw()
    {
        ctx.beginPath();
        this.canvas.strokeStyle = COLOR;
        this.canvas.moveTo(this.x,this.y);
        this.canvas.lineTo(this.x1,this.y1);
        this.canvas.stroke();
    }

    get NVector()
    {
        let x = this.x1 - this.x;
        let y = -(this.y1 - this.y);
        if(this.length === 0)
        {
            x = 0;
            y = 1;
        }
        else{
            x/=this.length;
            y/=this.length;
        }
        return {
            x : x,
            y : y
        }
    }

    get length()
    {
        let x = this.x1 - this.x;
        let y = -(this.y1 - this.y);
        return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    }

}