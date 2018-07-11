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
        move: (dir: Direction.LEFT | Direction.RIGHT) => boolean;
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
            }// end of if
            else if (this.dir === Direction.RIGHT){
                if ((this.key.realY - 1) * Unit < 0 || (this.key.realY) * Unit > Height){
                    return false;
                }
                else{
                    this.dir = Direction.UP;
                    return true;
                }
            }// end of else if
        }
        move(dir: Direction.LEFT | Direction.RIGHT): boolean{
            if(dir === Direction.LEFT){
                if(this.body[0].x <= 0){
                    return false;
                }
                else{
                    //can move
                    this.key = new Point(this.key.realX - 1, this.key.realY);
                    return true;
                }
            }// end of if 
            else{
                if(this.body[3].x >= Width){
                    return false;
                }
                else{
                    //can move
                    this.key = new Point(this.key.realX + 1, this.key.realY);
                    return true;
                }
            }// end of else
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
                case Direction.UP:
                // J
                return [
                    new Point(this.key.realX, this.key.realY - 1),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX, this.key.realY + 1),
                    new Point(this.key.realX - 1, this.key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                // |___
                return [
                    new Point(this.key.realX + 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX - 1, this.key.realY),
                    new Point(this.key.realX - 1, this.key.realY - 1),
                ]
                break;
                case Direction.DOWN:
                // ┌
                return [
                    new Point(this.key.realX, this.key.realY + 1),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX, this.key.realY - 1),
                    new Point(this.key.realX + 1, this.key.realY - 1),
                ]
                break;
                case Direction.LEFT:
                // --┐
                return [
                    new Point(this.key.realX - 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX + 1, this.key.realY),
                    new Point(this.key.realX + 1, this.key.realY + 1),
                ]
                break;
            }// end of switch
        }// end of get body()

        rotate(): boolean{
            if(this.dir !== Direction.DOWN){
                switch(this.dir){
                    case Direction.UP:
                    this.dir = Direction.RIGHT;
                    break;
                    case Direction.RIGHT:
                    this.dir = Direction.DOWN;
                    break;
                    case Direction.LEFT:
                    this.dir = Direction.UP;
                    break;
                }
                return true;
            }// end of if
            else{
                if(this.key.x <= 0){
                    return false;
                }
                else{
                    this.dir = Direction.LEFT;
                    return true;
                }
            }
        }// end of else
        move(dir: Direction.LEFT|Direction.RIGHT): boolean{
            if(dir === Direction.LEFT){
                if(this.dir !== Direction.DOWN){
                    if(this.key.x - Unit > 0){
                        //can move
                        this.key = new Point(this.key.realX - 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else {
                    if(this.key.x > 0){
                        //can move
                        this.key = new Point(this.key.realX - 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            }// end of if
            else{
                // move to right
                if(this.dir !== Direction.UP){
                    if(this.key.x + Unit < Width){
                        // can move
                        this.key = new Point(this.key.realX + 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else {
                    if(this.key.x + Unit < Width){
                        // can move
                        this.key = new Point(this.key.realX + 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            }// end of else
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
                case Direction.UP:
                // L
                return [
                    new Point(this.key.realX, this.key.realY - 1),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX, this.key.realY + 1),
                    new Point(this.key.realX + 1, this.key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                // ┌--
                return [
                    new Point(this.key.realX + 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX - 1, this.key.realY),
                    new Point(this.key.realX - 1, this.key.realY + 1),
                ]
                break;
                case Direction.DOWN:
                // ┐
                return [
                    new Point(this.key.realX, this.key.realY + 1),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX, this.key.realY - 1),
                    new Point(this.key.realX - 1, this.key.realY - 1),
                ]
                break;
                case Direction.LEFT:
                // --┘
                return [
                    new Point(this.key.realX - 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX + 1, this.key.realY),
                    new Point(this.key.realX + 1, this.key.realY - 1),
                ]
                break;
            }// end of switch
        }

        rotate(): boolean{
            if(this.dir !== Direction.UP){
                switch(this.dir){
                    case Direction.RIGHT:
                    this.dir = Direction.DOWN;
                    break;
                    case Direction.DOWN:
                    this.dir = Direction.LEFT;
                    break;
                    case Direction.LEFT:
                    this.dir = Direction.UP;
                    break;
                }
                return true;
            }// end of if
            else{
                if(this.key.x <= 0){
                    return false;
                }
                else{
                    this.dir = Direction.RIGHT;
                    return true;
                }
            }
        }
        move(dir: Direction.LEFT|Direction.RIGHT): boolean{
            if(dir === Direction.LEFT){
                // move to left
                if(this.dir !== Direction.UP){
                    if (this.key.x - Unit > 0){
                        this.key = new Point(this.key.realX - 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else {
                    if (this.key.x > 0){
                        this.key = new Point(this.key.realX - 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            }// end of if
            else{
                // move to right
                if(this.dir !== Direction.DOWN){
                    if (this.key.x + Unit < Width){
                        this.key = new Point(this.key.realX + 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else {
                    if (this.key.x < Width){
                        this.key = new Point(this.key.realX + 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            }// end of else
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
            return [
                new Point(this.key.realX, this.key.realY),
                new Point(this.key.realX + 1, this.key.realY),
                new Point(this.key.realX, this.key.realY + 1),
                new Point(this.key.realX + 1, this.key.realY + 1),
            ];
        }

        rotate(): boolean{
            return false;
        }
        move(dir: Direction.LEFT|Direction.RIGHT): boolean{
            if(dir === Direction.LEFT){
                // move to left
                if (this.key.x > 0){
                    // can move
                    this.key = new Point(this.key.realX - 1, this.key.realY);
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                // move to right
                if (this.key.x < Width){
                    // can move
                    this.key = new Point(this.key.realX + 1, this.key.realY);
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    }// end of class Shape_O

    // |_
    //   |  shape
    class Shape_S implements Shape{
        key: Point;        
        dir: Direction.UP|Direction.RIGHT = Direction.UP;
 
        constructor(x: number, y: number){
            this.key = new Point(x, y);
        }

        get body(){
            switch(this.dir){
                case Direction.UP:
                return [
                    new Point(this.key.realX, this.key.realY - 1),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX + 1, this.key.realY),
                    new Point(this.key.realX + 1, this.key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                return [
                    new Point(this.key.realX + 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX, this.key.realY + 1),
                    new Point(this.key.realX - 1, this.key.realY + 1),
                ]
                break;
            }
        }// end of get body()

        rotate(): boolean{
            if (this.dir !== Direction.UP){
                this.dir = Direction.UP;
                return true;
            }
            else{
                if(this.key.x > 0){
                    this.dir = Direction.RIGHT;
                    return true;
                }
                else{
                    return false;
                }
            }
        }
        move(dir: Direction.LEFT|Direction.RIGHT): boolean{
            if(dir === Direction.LEFT){
                // move to left
                if(this.dir === Direction.UP){
                    if(this.key.x > 0){
                        this.key = new Point(this.key.realX - 1, this.key.realY);
                        return true;
                    }
                    else {
                        return false
                    }
                }
                else{
                    if(this.key.x - Unit > 0){
                        this.key = new Point(this.key.realX - 1, this.key.realY);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            else{
                // move to right
                if (this.dir + Unit < Width){
                    this.key = new Point(this.key.realX + 1, this.key.realY);
                    return true;
                }
                else{
                    return false;
                }
            }
        }//end of method move
    }// end of class Shape_S

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
                case Direction.UP:
                return [
                    new Point(this.key.realX, this.key.realY - 1),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX - 1, this.key.realY),
                    new Point(this.key.realX - 1, this.key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                return [
                    new Point(this.key.realX + 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX, this.key.realY - 1),
                    new Point(this.key.realX - 1, this.key.realY - 1),
                ]
                break;
            }
        }

        rotate(): boolean{
            if (this.dir !== Direction.UP){
                this.dir = Direction.UP;
                return true;
            }
            else{
                if(this.key.x < Width){
                    this.dir = Direction.RIGHT;
                    return true;
                }
                else{
                    return false;
                }
            }
        }
        move(dir: Direction.LEFT|Direction.RIGHT): boolean{
            if(dir === Direction.LEFT){
                // move to left
                if (this.dir - Unit > 0){
                    this.key = new Point(this.key.realX - 1, this.key.realY);
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                // move to right
                if(this.dir === Direction.UP){
                    if(this.key.x < Width){
                        this.key = new Point(this.key.realX + 1, this.key.realY);
                        return true;
                    }
                    else {
                        return false
                    }
                }
                else{
                    if(this.key.x + Unit < Width){
                        this.key = new Point(this.key.realX + 1, this.key.realY);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
    }// end of class Shape_Z

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
                case Direction.UP:
                return [
                    new Point(this.key.realX - 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX + 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                return [
                    new Point(this.key.realX, this.key.realY - 1),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX, this.key.realY + 1),
                    new Point(this.key.realX - 1, this.key.realY),
                ]
                break;
                case Direction.DOWN:
                return [
                    new Point(this.key.realX - 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX + 1, this.key.realY),
                    new Point(this.key.realX, this.key.realY - 1),
                ]
                break;
                case Direction.LEFT:
                return [
                    new Point(this.key.realX, this.key.realY - 1),
                    new Point(this.key.realX, this.key.realY),
                    new Point(this.key.realX, this.key.realY + 1),
                    new Point(this.key.realX + 1, this.key.realY),
                ]
                break;
            }
        }
        rotate(): boolean{
            if(this.dir !== Direction.LEFT && this.dir !== Direction.RIGHT){
                if (this.dir === Direction.UP){
                    this.dir = Direction.RIGHT;
                }
                else {
                    this.dir = Direction.LEFT;
                }
                return true;
            }// end of if
            else if (this.dir === Direction.LEFT){
                if(this.key.x > 0){
                    this.dir = Direction.UP;
                    return true;
                }
                else {
                    return false;
                }
            }// end of else if  (this.dir === Direction.LEFT)
            else if (this.dir === Direction.RIGHT){
                if(this.key.x < Width){
                    this.dir = Direction.DOWN;
                    return true;
                }
                else {
                    return false;
                }
            }// end of else if (this.dir === Direction.RIGHT)
        }// end of rotate()
        move(dir: Direction.LEFT|Direction.RIGHT): boolean{
            if (dir === Direction.LEFT){
                if(this.dir !== Direction.LEFT){
                    if(this.key.x - Unit > 0){
                        this.key = new Point(this.key.realX - 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }// end of if
                else{
                    if(this.key.x > 0){
                        this.key = new Point(this.key.realX - 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }// end of else
            }// end of if
            else{
                if(this.dir !== Direction.RIGHT){
                    if(this.key.x - Unit > 0){
                        this.key = new Point(this.key.realX + 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }// end of if
                else{
                    if(this.key.x > 0){
                        this.key = new Point(this.key.realX + 1, this.key.realY);
                        return true;
                    }
                    else{
                        return false;
                    }
                }// end of else
            }// end of else
        }
    }

    
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