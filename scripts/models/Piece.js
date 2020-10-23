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
            this.personnes.push(new Personne(cvs,o));
        }
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
            if(Math.sqrt(Math.pow(perso.x - rndPerso.x,2)+Math.pow(perso.y - rndPerso.y,2)) >= rndPerso.r + perso.r)
               continue;
            return false;
        }
        return true;
    }

    getRndPerso()
    {
        let r = this.getRndInteger(13,17)
        return {
            x : this.getRndInteger(this.x+r,this.x+this.w - r),
            y : this.getRndInteger(this.y+r,this.y+this.h-r),
            r : r
        };
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    drawPiece()
    {

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

}