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

    getDistanceToLine(person)
    {
        return Math.abs(this.cst_x*person.x+this.cst_y*person.y+this.h)/(Math.sqrt(Math.pow(this.cst_x,2)+Math.pow(this.cst_y,2)));
    }

    get allVectors()
    {
        let resultEin = new Map();
        let resultS = new Map();
        let resultI = new Map();
        let resultJ = new Map();
        let xn = new Map();
        let vn = new Map();
        for(const person of this.personnes) {
            resultEin.set(person, new Map());
            resultS.set(person, new Map());
            xn.set(person,{
                x: person.x,
                y: person.y
            });
            vn.set(person,{
                x: person.xvelocity,
                y: person.yvelocity
            });
            for (const otherPerson of this.personnes){
                if(person !== otherPerson) {
                    resultEin.get(person).set(otherPerson, person.getEinVector(otherPerson));
                    let r = person.getNorme(otherPerson);
                    r -= (person.r + otherPerson.r);
                    resultS.get(person).set(otherPerson, r);
                    if (resultS.get(person).get(otherPerson) < (otherPerson.r + person.r) / 10) {
                        resultI.set(person, person);
                        resultJ.set(person, otherPerson);
                    }
                }
            }
        }
        return {
            ein : resultEin,
            s : resultS,
            I : resultI,
            J : resultJ,
            x_n : xn,
            y_n : vn
        };
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

    plus(a)
    {
        if(a>0)
            return a;
        else return 0;
    }

    update() {
        this.drawPiece();
        let residue = 2. * EPSILON;
        let p = this.initP();
        let vectors = this.allVectors;
        let s = vectors.s;
        while (residue > EPSILON) {
            let residueX = 2. * EPSILONX;
            while (residueX > EPSILONX) {
                residueX = 0;
                for (const [k,m] of vectors.I)
                {
                    let otherPerson = vectors.J.get(m);
                    m.xvelocity += DT * p.get(m).get(otherPerson) * vectors.ein.get(m).get(otherPerson).x;
                    m.yvelocity += DT * p.get(m).get(otherPerson) * vectors.ein.get(m).get(otherPerson).y;
                    otherPerson.xvelocity -= DT * p.get(m).get(otherPerson) * vectors.ein.get(m).get(otherPerson).x;
                    otherPerson.yvelocity -= DT * p.get(m).get(otherPerson) * vectors.ein.get(m).get(otherPerson).y;
                    let d = {
                        x: m.x - otherPerson.x,
                        y: m.y - otherPerson.y
                    };
                    let alpha = DT * RHO * (this.ps(d, vectors.ein.get(m).get(otherPerson)) - (m.r + otherPerson.r) - vectors.s.get(m).get(otherPerson));
                    m.xvelocity -= alpha * vectors.ein.get(m).get(otherPerson).x;
                    m.yvelocity -= alpha * vectors.ein.get(m).get(otherPerson).y;
                    otherPerson.xvelocity += alpha * vectors.ein.get(m).get(otherPerson).x;
                    otherPerson.yvelocity += alpha * vectors.ein.get(m).get(otherPerson).y;
                }
                for (const personne of this.personnes) {
                    let pos = {
                        x: personne.x,
                        y: personne.y
                    }
                    personne.x = vectors.x_n.get(personne).x + DT * personne.xvelocity;
                    personne.y = vectors.x_n.get(personne).y + DT * personne.yvelocity;
                    personne.xvelocity = (personne.x - vectors.x_n.get(personne).x) / DT;
                    personne.yvelocity = (personne.y - vectors.x_n.get(personne).y) / DT;
                    let d = {
                        x : personne.x-pos.x,
                        y : personne.y-pos.y
                    };
                    residueX = Math.max(residueX,Math.sqrt(Math.pow(d.x,2)+Math.pow(d.y,2))/DT);
                }
                let residueS = 0;
                for (const [k,m] of vectors.I) {
                    let otherPerson = vectors.J.get(m);
                    let d = {
                        x : m.x - otherPerson.x,
                        y : m.y - otherPerson.y
                    };
                    let updated_s = this.plus(-p.get(m).get(otherPerson)/RHO+this.ps(d,vectors.ein.get(m).get(otherPerson))-(m.r+otherPerson.r));
                    residueS = Math.max(residueS,Math.abs(s.get(m).get(otherPerson)-updated_s));
                    s.get(m).set(otherPerson,updated_s);
                }
                residueX+=residueS;
            }
            residue = 0;
            for (const [k,m] of this.allVectors.I) {
                let otherPerson = this.allVectors.J.get(m);
                let d = {
                    x : m.x - otherPerson.x,
                    y : m.y - otherPerson.y
                };
                let dp = this.ps(d,this.allVectors.ein.get(m).get(otherPerson)-(m.r+otherPerson.r)-s.get(m).get(otherPerson));
                p.get(m).set(otherPerson,p.get(m).get(otherPerson)-RHO*dp);
                residue = Math.max(residue,Math.abs(dp));
            }
        }
        for(const person of this.personnes)
            person.draw();
        console.log(this.getDistanceToLine(this.personnes[0]));
    }

    ps(vec1,vec2)
    {
        return vec1.x*vec2.x+vec1.y*vec2.y;
    }

    initP()
    {
        let p = new Map();
        for (const person of this.personnes) {
            p.set(person,new Map());
            for(const person1 of this.personnes)
                p.get(person).set(person1,0);
        }
        return p;
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