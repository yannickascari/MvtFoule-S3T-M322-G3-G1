class Personne extends CanvasElement{

    constructor(cvs,obj,xvelocity,yvelocity,acceleration) {
        super(cvs);
        this.x = obj.x;
        this.y = obj.y;
        this.r = obj.r;
        this.yvelocity = yvelocity;
        this.xvelocity = xvelocity;
        this.nbOutside = 0;
        this.blueValue = 100;
        this.coefficient = acceleration;
        this.cst_velocity = {
            x : xvelocity,
            y : yvelocity,
        };
    }

    draw()
    {

        this.canvas.beginPath();
        const color = "rgba(0,0,255,255)";
        this.canvas.fillStyle=color;
        this.canvas.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.canvas.fill();
        this.canvas.stroke();

    }


    /**
     *
     * @param pieceC {Piece}
     */

    isOutside(pieceC)
    {
        return this.x - this.r <= pieceC.x;
    }

    getEinVector(person)
    {
        let norme = this.getNorme(person);
        return {
            x : (this.x - person.x)/norme,
            y : (this.y - person.y)/norme,
        };
    }

    getNorme(person)
    {
        return Math.sqrt(Math.pow(this.x - person.x,2)+Math.pow(this.y - person.y,2));
    }

    noCollisionPerson(person)
    {
        let norme = this.getNorme(person);
        let ein = {
            x : (this.x - person.x)/norme,
            y : (this.y - person.y)/norme,
        };
        let x2x1 = {
            x : this.x - person.x,
            y : this.y - person.y,
        }
        return ein.x * x2x1.x + ein.y * x2x1.y >= this.r + person.r;
    }

    resetVelocity()
    {
        this.yvelocity = this.cst_velocity.y;
        this.xvelocity = this.cst_velocity.x;
    }



}