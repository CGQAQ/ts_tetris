namespace Tetris{
    export const Unit = 50;
    export const Width = 10 * Unit;
    export const Height = 15 * Unit;

    const block_color = 'rgb(111,111,111)';

    class Point{
        private _x;
        private _y;

        constructor(x: number, y:number){
            this.x = x;
            this.y = y;
        }
        
        public get x() : number {
            return this._x * Unit;
        }

        public get realX() : number {
            return this._x;
        }
        
        public set x(x : number) {
            this._x = x;
        }
        
        public get y() : number {
            return this._y * Unit;
        }
        
        public get realY() : number {
            return this._y;
        }

        public set y(y : number) {
            this._y = y;
        }
    }// end class Point
    
    
    interface Shape{
        key: Point;
        dir: Direction;
        rotate: () => boolean;
        move: () => boolean;
    }// end of interface Shape

    enum Direction{
        UP,             /// should be default
        RIGHT,
        DOWN,           /// some shapes do not need two below
        LEFT,
    }// end of enum Direction


    //  ---- shape
    class Shape_I implements Shape{
        key: Point;
        dir: Direction.UP|Direction.RIGHT = Direction.UP;

        constructor(x: number, y: number){
            this.key = new Point(x, y);
        }

        get body(){
            switch (this.dir){
                case Direction.UP: 
                    return [
                        new Point(this.key.realX - 1, this.key.realY),
                        new Point(this.key.realX, this.key.realY),
                        new Point(this.key.realX + 1, this.key.realY),
                        new Point(this.key.realX + 2, this.key.realY),
                    ]
                    break;
                case Direction.RIGHT:
                    return [
                        new Point(this.key.realX, this.key.realY - 1),
                        new Point(this.key.realX, this.key.realY),
                        new Point(this.key.realX, this.key.realY + 1),
                        new Point(this.key.realX, this.key.realY + 2),
                    ]
                    break;
            }
        }
        rotate(): boolean{
            if (this.dir === Direction.UP){
                if ((this.key.realX - 1) * Unit < 0 || (this.key.realX + 2) * Unit > Width){
                    return false;
                }
                else{
                    this.dir = Direction.RIGHT;
                    return true;
                }
            }
            else if (this.dir === Direction.RIGHT){
                if ((this.key.realY - 1) * Unit < 0 || (this.key.realY) * Unit > Height){
                    return false;
                }
                else{
                    this.dir = Direction.UP;
                    return true;
                }
            }
        }
        move(): boolean{
            return true;
        }
    }// end of class Shape_I

    // |___ shape
    class Shape_J implements Shape{
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            this.key = new Point(x, y);
        }

        get body(){
            switch(this.dir){

            }
        }

        rotate(): boolean{
            return true;
        }
        move(): boolean{
            return true;
        }
    }// end of class Shape_J

    // ___| shape
    class Shape_L implements Shape{
        key: Point;     
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            this.key = new Point(x, y);
        } 

        get body(){
            switch(this.dir){

            }
        }

        rotate(): boolean{
            return true;
        }
        move(): boolean{
            return true;
        }
    }// end of class Shape_L

    // # shape 
    class Shape_O implements Shape{
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            this.key = new Point(x, y);
        }

        get body(){
            switch(this.dir){

            }
        }

        rotate(): boolean{
            return true;
        }
        move(): boolean{
            return true;
        }
    }// end of class Shape_O

    // |_
    //   |  shape
    class Shape_S implements Shape{
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            this.key = new Point(x, y);
        }

        get body(){
            switch(this.dir){

            }
        }

        rotate(): boolean{
            return true;
        }
        move(): boolean{
            return true;
        }
    }// end of class Shape_S

    //___ 
    // |   shape
    class Shape_T implements Shape{
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            this.key = new Point(x, y);
        }

        get body(){
            switch(this.dir){

            }
        }

        rotate(): boolean{
            return true;
        }
        move(): boolean{
            return true;
        }
    }

    // __
    //  /    shape
    // /__
    class Shape_Z implements Shape{
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            this.key = new Point(x, y);
        }

        get body(){
            switch(this.dir){

            }
        }

        rotate(): boolean{
            return true;
        }
        move(): boolean{
            return true;
        }
    }// end of class Shape_Z

    
    export function run(ctx: CanvasRenderingContext2D){
        ctx.fillStyle = 'rgb(180,180,180)';
        ctx.fillRect(0, 0, Width, Height);
        ctx.beginPath();
        ctx.fillStyle = block_color;

        //a l
        let l = new Shape_I(2,3);

        l.body.forEach((e) => {
            ctx.fillRect(e.x, e.y, Unit, Unit)
            console.log(e.x, e.y)
        })
        l.dir = Direction.RIGHT;
        l.body.forEach((e) => {
            ctx.fillRect(e.x, e.y, Unit, Unit)
            console.log(e.x, e.y)
        })

    }// end function run
}


function main(){
    const canvas = window.document.querySelector('canvas');
    if(canvas !== null){
        // init canvas size
        canvas.width = Tetris.Width;
        canvas.height = Tetris.Height;

        // get canvas 2d context
        const ctx = canvas.getContext('2d');
        if (ctx === null){
            console.error("Unable to initialize 2d. Your browser or machine may not support it.");
            return;
        }

        // context has been got, let's start doing sth
        ctx.clearRect(0, 0, Tetris.Width, Tetris.Height);
        Tetris.run(ctx);
    } // end if
    else{
        console.error('canvas not found!');
    }// end else
}
main();