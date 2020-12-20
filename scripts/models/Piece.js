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
     * @param obstacles{Array<Obstacle>}
     */
    constructor(cvs,x,y,h,w,h_s,nbP,obstacles) {
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
            let person = new Personne(cvs,o,vx,vy,coefficient);
            this.personnes.push(person);
        }

        this.obstacles = obstacles;

    }

    wp(v1,v2) {
        return (v1.x*v2.y-v1.y*v2.x);
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
            resultI.set(person,[]);
            for (const otherPerson of this.personnes){
                if(person !== otherPerson) {
                    resultEin.get(person).set(otherPerson, person.getEinVector(otherPerson));
                    let r = person.getNorme(otherPerson);
                    r -= (person.r + otherPerson.r);
                    resultS.get(person).set(otherPerson, r);
                    if (resultS.get(person).get(otherPerson) < (otherPerson.r + person.r) / 10) {
                        resultI.get(person).push(otherPerson);
                    }
                }
            }
        }
        let Jo = new Map();
        let X = new Map();
        let S = new Map();
        let E = new Map();
        for (const obstacle of this.obstacles) {
            X.set(obstacle,new Map());
            E.set(obstacle,new Map());
            S.set(obstacle,new Map());
            for(const person of this.personnes) {
                let v = {
                    x: person.x - obstacle.x,
                    y: person.y - obstacle.y
                }
                let l = this.wp(v, obstacle.NVector);
                let XVector = {
                    x: null,
                    y: null
                };
                if (l < 0) {
                    XVector.x = obstacle.x;
                    XVector.y = obstacle.y;
                } else if (l > obstacle.length) {
                    XVector.x = obstacle.x1;
                    XVector.y = obstacle.y1;
                } else {

                    let tau = {
                        x: obstacle.NVector.x,
                        y: obstacle.NVector.y
                    }
                    //console.log(tau);
                    XVector.x = obstacle.x + l * tau.x;
                    XVector.y = obstacle.y + l * tau.y;
                }
                X.get(obstacle).set(person,XVector);
                let emap = {
                    x: null,
                    y: null
                }
                emap.x = X.get(obstacle).get(person).x - person.x;
                emap.y = X.get(obstacle).get(person).y - person.y;
                let Smap = Math.sqrt(Math.pow(emap.x, 2) + Math.pow(emap.y, 2));
                emap.x /= Smap;
                emap.y /= Smap;
                Smap -= (1 + person.r);
                E.get(obstacle).set(person,emap);
                S.get(obstacle).set(person,Smap);
                if (S.get(obstacle).get(person) < (1 + person.r) / 10)
                {
                    Jo.set(obstacle,person);
                }
            }
        }
        return {
            ein : resultEin,
            s : resultS,
            I : resultI,
            x_n : xn,
            v_n : vn,
            X : X,
            S : S,
            E : E,
            Jo : Jo
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

    /**
     *
     * @param person
     */

    isOut(person)
    {
        return person.x < this.cst_x - 0.01;
    }

    plus(a)
    {
        if(a>0)
            return a;
        else return 0;
    }

    update() {
        let residue = 2. * EPSILON;
        let p = this.initp();
        let P = this.initP();
        let vectors = this.allVectors;
        let s = vectors.s;
        let S = vectors.S;

        while (residue > EPSILON) {
            let residueX = 2. * EPSILONX;
            while (residueX > EPSILONX) {
                residueX = 0;
                for (const [m,arr] of vectors.I)
                {
                    for(const otherPerson of arr)
                    {
                        m.xvelocity += DT * p.get(m).get(otherPerson) * vectors.ein.get(m).get(otherPerson).x;
                        otherPerson.xvelocity -= DT * p.get(m).get(otherPerson) * vectors.ein.get(m).get(otherPerson).x;
                        m.yvelocity += DT * p.get(m).get(otherPerson) * vectors.ein.get(m).get(otherPerson).y;
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
                }
                for(const [io,j] of vectors.Jo)
                {
                    j.xvelocity -= DT*P.get(io).get(j)*vectors.E.get(io).get(j).x;
                    j.yvelocity -= DT*P.get(io).get(j)*vectors.E.get(io).get(j).y;
                    let d = {
                        x : vectors.X.get(io).get(j).x - j.x,
                        y : vectors.X.get(io).get(j).y - j.y
                    };
                    let alpha = DT*RHO*(this.ps(d,vectors.E.get(io).get(j))-(1+j.r)-S.get(io).get(j));
                    j.xvelocity+=alpha*vectors.E.get(io).get(j).x;
                    j.yvelocity+=alpha*vectors.E.get(io).get(j).y;
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
                for (const [m,arr] of vectors.I)
                {
                    for(const otherPerson of arr) {
                        let d = {
                            x: m.x - otherPerson.x,
                            y: m.y - otherPerson.y
                        };
                        let updated_s = this.plus(-p.get(m).get(otherPerson) / RHO + this.ps(d, vectors.ein.get(m).get(otherPerson)) - (m.r + otherPerson.r));
                        residueS = Math.max(residueS, Math.abs(s.get(m).get(otherPerson) - updated_s));
                        s.get(m).set(otherPerson, updated_s);
                    }
                }
                for(const [io,j] of vectors.Jo)
                {
                    let d = {
                        x : vectors.X.get(io).get(j).x - j.x,
                        y : vectors.X.get(io).get(j).y - j.y
                    }
                    let updatedS = this.plus(-P.get(io).get(j)/RHO+this.ps(d,vectors.E.get(io).get(j))-(1+j.r));
                    residueS = Math.max(residueS,Math.abs(S.get(io).get(j)-updatedS)/DT);
                    S.get(io).set(j,updatedS);
                }
                residueX+=residueS;
            }
            residue = 0;
            for (const [m,arr] of vectors.I)
            {
                for(const otherPerson of arr) {
                    let d = {
                        x: m.x - otherPerson.x,
                        y: m.y - otherPerson.y
                    };
                    let dp = this.ps(d, this.allVectors.ein.get(m).get(otherPerson) - (m.r + otherPerson.r) - s.get(m).get(otherPerson));
                    p.get(m).set(otherPerson, p.get(m).get(otherPerson) - RHO * dp);
                    residue = Math.max(residue, Math.abs(dp));
                }
            }

            for(const [io,j] of vectors.Jo)
            {
                let d = {
                    x : vectors.X.get(io).get(j).x - j.x,
                    y : vectors.X.get(io).get(j).y - j.y
                }
                let dp = this.ps(d,vectors.E.get(io).get(j))-(1+j.r)-S.get(io).get(j);
                P.get(io).set(j,P.get(io).get(j)-RHO*dp);
                residue = Math.max(residue,Math.abs(dp));
            }
        }
        for(const person of this.personnes)
            person.draw();
        this.drawPiece();
        for(const obstacle of this.obstacles)
            obstacle.draw();

        for(const personne of this.personnes)
        {
            if(!this.isOut(personne))
            {
                let sortie = this.getVectorToExit(personne);
                personne.xvelocity = sortie.x*personne.coefficient;
                personne.yvelocity = sortie.y*personne.coefficient;
                personne.x += personne.xvelocity * DT;
                personne.y += personne.yvelocity * DT;
            }
        }

    }

    ps(vec1,vec2)
    {
        return vec1.x*vec2.x+vec1.y*vec2.y;
    }

    initp()
    {
        let p = new Map();
        for (const person of this.personnes) {
            p.set(person,new Map());
            for(const person1 of this.personnes)
                p.get(person).set(person1,0);
        }
        return p;
    }

    initP()
    {
        let p = new Map();
        for (const person of this.obstacles) {
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