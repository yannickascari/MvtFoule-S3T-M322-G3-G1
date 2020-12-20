class ModelRender extends CanvasElement{

    /**
     *
     * @param cvs
     * @param delay
     * @param {Piece} piece
     */

    constructor(cvs,delay,piece) {
        super(cvs);
        this.delay = delay;
        this.piece = piece;
        this.updtadeFct = null;
        this.milli = 0;
        const loadingCst = "...";
        this.index = 0;
        this.load = setInterval(()=>{
            let h1 = document.querySelector("h1");
            h1.innerHTML = "Modélisation en cours" + loadingCst.substr(0,this.index);
            if(this.index<3)
                this.index++;
            else
                this.index = 0;
        },1000);

    }

    update()
    {
        let chrono = document.querySelector("p");
        let chronoContent = "";
        this.updtadeFct = setInterval(()=>{
            this.canvas.clearRect(0, 0, 1000, 1000);
            this.piece.update();
            const info = {
                seconds : Math.floor(this.milli/1000),
                milli : -(Math.floor(this.milli/1000)*1000-this.milli),
            };
            if(!this.piece.allOutside()) {
                this.milli += DT * 100;
                chronoContent = `Chrono : ${info.seconds},${info.milli} s`
            }
            else{
                clearInterval(this.load);
                document.querySelector("h1").innerHTML = "Modelisation terminée";
            }
            this.piece.statistic().then(promise => {
               chrono.innerHTML = chronoContent +  `<br>Nombres de personnes dehors : ${promise.nbOutside===0?"Aucune":promise.nbOutside}<br>Nombres de personnes a l'interieur : ${promise.nbInside===0?"Aucune":promise.nbInside} `
            });
        },DT*100);
    }

}