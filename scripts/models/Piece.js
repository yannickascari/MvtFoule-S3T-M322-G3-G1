class Piece extends CanvasElement{

    /**
     *
     * @param cvs
     * @param x
     * @param y
     * @param h
     * @param w
     * @param h_s
     * @param nbP
     */
    constructor(cvs,x,y,h,w,h_s,nbP) {
        super(cvs);
        this.x = x;
        this.y = y;
        this.cst_x = x;
        this.cst_y = y;
        this.w = w;
        this.h = h;
        this.h_s = h_s;
        this.personnes = [];
        for(let i = 0;i<nbP;++i)
        {
            let o = this.getRndPerso();
            while (!this.isNotSuperImposed(o))
                o = this.getRndPerso();
            let object = this.getVectorToExit(o);
            const coefficient = Piece.getRndInteger(VELOCITY_MIN,VELOCITY_MAX);
            let vx = object.x*coefficient;
            let vy = object.y*coefficient;
            let person = new Personne(cvs,o,vx,vy);
            this.personnes.push(person);
        }
    }

    ft()
    {

    }

    get allVectors()
    {
        let resultEin = {};
        let resultS = {};
        for(const person of this.personnes){
            resultEin[person] = [];
            resultS[person] = [];
            for(const otherPerson of this.personnes)
                if(person !== otherPerson) {
                    resultEin[person].push(person.getEinVector(otherPerson));
                    let s = person.getNorme(person)
                }
        }
        return resultEin;
    }

    /**
     *
     * @param
     * @returns {{x,y}}
     */

    getVectorToExit(o)
    {
        let vExit = {
            x : this.exitPosition.x - o.x,
            y : this.exitPosition.y - o.y,
        };
        let norme = Math.sqrt(Math.pow(vExit.x,2)+Math.pow(vExit.y,2));
        return {
            x : vExit.x/norme,
            y : vExit.y/norme
        };
    }

    get exitPosition()
    {
        return {
            x : this.cst_x,
            y : this.cst_y+this.h/2
        };
    }

    drawLine(a_x,a_y)
    {

        ctx.beginPath();
        this.canvas.strokeStyle = COLOR;
        this.canvas.moveTo(this.x,this.y);
        this.canvas.lineTo(this.x+a_x,this.y+a_y);
        this.canvas.stroke();

    }

    isNotSuperImposed(rndPerso)
    {
        for (const perso of this.personnes) {
            if(perso.noCollisionPerson(rndPerso))
                continue;
            return false;
        }
        return true;
    }

    getRndPerso()
    {
        let r = Piece.getRndInteger(13,17)
        return {
            x : Piece.getRndInteger(this.x+r,this.x+this.w - r),
            y : Piece.getRndInteger(this.y+r,this.y+this.h-r),
            r : r
        }

    }

    static getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    drawPiece()
    {
        this.x = this.cst_x;
        this.y = this.cst_y;
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


    update()
    {
        this.drawPiece();
        for (const person of this.personnes) {
            person.move();
            for(const otherPerson of this.personnes)
                if(!(otherPerson === person))
                    if(!otherPerson.noCollisionPerson(person)) {
                        otherPerson.handleCollision(person);
                    }
            if(!person.isOutside) {
                let collisionObject = this.pieceCollision(person);
                person.pieceCollision(collisionObject.collisionType,this);
            }
            person.draw();
        }
    }

    /**
     *
     * @param person {Personne}
     * @returns {*}
     */

    pieceCollision(person)
    {
        let midLeft = this.cst_x+this.h/2;
        let y1 = midLeft-this.h_s/2;
        let y2 = midLeft+this.h_s/2;
        let firstCondition = !(person.x-person.r>=this.cst_x && person.x+person.r <= this.cst_x+this.w);
        let secondCondition = !(person.y + person.r<=this.cst_y+this.h && person.y-person.r>=this.cst_y);
        let exitCondition = person.y-person.r>y1 && person.y+person.r<y2 && firstCondition;

        if(exitCondition)
        {
            return {
                collision : false,
                collisionType : "exit",
            }
        }
        else if(firstCondition && secondCondition)
        {
            return {
                collision : true,
                collisionType : "XY"
            };
        }
        else if(firstCondition)
            return {
                collision : true,
                collisionType : "X"
            };
        else if(secondCondition)
            return {
                collision : true,
                collisionType: "y"
            };
        return {
            collision : false,
            collisionType: null
        };
    }


}