class ModelRender{

    /**
     *
     * @param delay
     * @param {Piece} piece
     */

    constructor(delay,piece) {

        this.delay = delay;
        this.piece = piece;
        this.updtadeFct = null;
        this.milli = 0;
        this.finish = false;

    }

    update()
    {
        let chrono = document.querySelector("header");
        this.updtadeFct = setInterval(()=>{
            ctx.clearRect(0, 0, 1000, 1000);
            this.piece.update();
            this.milli += DT*100;
            const info = {
                seconds : Math.floor(this.milli/1000),
                milli : -(Math.floor(this.milli/1000)*1000-this.milli),
            };
            if(!this.finish)
                chrono.innerHTML = `Chrono : ${info.seconds},${info.milli} s`;
        },DT*100);
    }

}