class Personne extends CanvasElement{

    constructor(cvs,obj,xvelocity,yvelocity,acceleration) {
        super(cvs);
        this.x = obj.x;
        this.y = obj.y;
        this.r = obj.r;
        this.yvelocity = yvelocity;
        this.xvelocity = xvelocity;
        this.nbOutside = 0;
        this.isOutside = false;
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

    move()
    {

        this.x += this.xvelocity;
        this.y += this.yvelocity;

    }

    noHorizontalVelocity()
    {
        this.xvelocity = 0;
    }

    noVerticalVelocity()
    {
        this.yvelocity = 0;
    }

    /**
     *
     * @param CollisionType
     * @param piece {Piece}
     */

    pieceCollision(CollisionType,piece)
    {
        if(CollisionType === "XY"){
            this.noHorizontalVelocity();
            this.noVerticalVelocity();
        }
        else if(CollisionType === "Y")
            this.noVerticalVelocity();
        else if(CollisionType === "X") {
            this.noHorizontalVelocity();
            if(this.y>=piece.exitPosition.y)
                this.yvelocity = -Math.abs(this.yvelocity);
            else
                this.yvelocity = Math.abs(this.yvelocity);
        }
        else if(CollisionType === "exit") {
            this.resetVelocity();
            this.isOutside = true;
            this.yvelocity = this.xvelocity/4;
            this.nbOutside++;
        }

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

    increaseBlue(person)
    {
        this.blueValue=(255-this.getNorme(person));
    }

    /**
     *
     * @param person {Personne}
     * @returns {boolean}
     */

    isFasterThan(person)
    {
        let speed = (this.cst_velocity.x + this.cst_velocity.y)/2;
        let speedPerson = (person.cst_velocity.x + person.cst_velocity.y)/2;
        return speed>speedPerson;
    }

    /**
     *
     * @param person {Personne}
     */

    handleCollision(person)
    {
        this.increaseBlue(person);
        /*if(this.isFasterThan(person))
        {
            person.yvelocity = this.yvelocity;
            person.xvelocity = this.xvelocity;
        }
        else{
            this.xvelocity = person.xvelocity;
            this.yvelocity = person.yvelocity;
        }*/
    }

    resetVelocity()
    {
        this.yvelocity = this.cst_velocity.y;
        this.xvelocity = this.cst_velocity.x;
    }



}