namespace Tetris{
    export const Unit = 50;
    export const Width = 10 * Unit;
    export const Height = 15 * Unit;

    const I_color = '#7FFF99';
    const J_color = '#FF7F82';
    const L_color = '#464646';
    const O_color = '#008080';
    const S_color = '#A37FFF';
    const Z_color = '#A8BEF7';
    const T_color = '#EEFF7F';

    const bg_color = 'rgb(222,222,222)';




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


    enum Tetromino_types{
        Blank,
        I,
        J,
        L,
        O,
        S,
        Z,
        T,
    }

    enum Tetromino_states{
        Alive,
        Dead,
    }

    class UMap{
        private data: Tetromino_types[][];
        width: number;
        length: number;

        constructor(){
            this.data = [];
            this.width = Width / Unit;
            this.length = Height / Unit
            this.empty();
        }

        empty(){
            for(let y = 0; y < this.length; y++){
                this.data[y] = []
                for(let x = 0; x < this.width; x++){
                    this.data[y][x] = Tetromino_types.Blank;
                }
            }
        }

        // private last: Point[];
        set(x: number, y: number, t: Tetromino_types){ 
            this.data[y][x] = t;
        }

        // must call before move or rotate! [may be put this in shape class is better]
        // clearLast() {
        //     while(true){
        //         const p = this.last.pop()
        //         if (p!==undefined){
        //             this.set(p.realX, p.realY, Block_types.Blank, Tetromino_states.Dead);
        //         }
        //         else{
        //             break;
        //         }
        //     }
        // }

        private in_a_row(){
            // determines if scored
            let ys: number[] = [];
            for(let y = 0; y < this.length; y++){
                let a = 0;
                for(let x = 0; x < this.width; x++){
                    if (this.data[y][x] === Tetromino_types.Blank){
                        a ++;
                    }
                }
                if (a === 0){
                    ys.push(y);
                }
            }
            return ys;
        }// end of in_a_row

        handle_remove_rows(){
            const ys = this.in_a_row()
            if (ys.length === 0){
                return;
            }
            else{
                // handle it
                ys.forEach((y: number)=> {
                    for(let x = 0; x < Width; x++){
                        this.data[y][x] = Tetromino_types.Blank;
                    }
                    for (let _y = y; y > 0; y--){
                        for(let x = 0; x < Width; x++){
                            this.data[y][x] = this.data[y - 1][x];
                        }
                    }
                });
            }
        }


        foreach(f: (x: number, y: number, t: Tetromino_types) => void | boolean){
            for(let y = 0; y < this.length; y++){
                for(let x = 0; x < this.width; x++){
                    if (f(x, y, this.data[y][x]) === false){
                        return;
                    }
                }
            }
        }
    }

    const game_map: UMap = new UMap();
    
    
    abstract class Shape{
        readonly type: Tetromino_types;
        key: Point = new Point(4, 1);
        dir: Direction;
        state: Tetromino_states = Tetromino_states.Alive;
        abstract body(key?: Point);
        private put_to_map(map: UMap) {
            this.body().forEach((p: Point) => {
                map.set(p.realX, p.realY, this.type);
            });
        }

        protected clear_on_map(map: UMap) {
            this.body().forEach((p: Point) => {
                map.set(p.realX, p.realY, Tetromino_types.Blank);
            });
        }

        protected setDir(dir: Direction) {
            if(this.state === Tetromino_states.Alive){
                this.clear_on_map(game_map);
            }
            this.dir = dir;
            this.put_to_map(game_map);
        }

        protected setPos(p: Point) {
            if(this.state === Tetromino_states.Alive){
                this.clear_on_map(game_map);
            }
            this.key = p;
            this.put_to_map(game_map);
        }

        move(){

        }

        rotate(){

        }

        predict(){

        }
    }// end of interface Shape

    enum Direction{
        UP,             /// should be default
        RIGHT,
        DOWN,           /// some shapes do not need two below
        LEFT,
    }// end of enum Direction


    //  ---- shape
    class Shape_I extends Shape{
        readonly type: Tetromino_types = Tetromino_types.I;
        key: Point;
        dir: Direction.UP|Direction.RIGHT = Direction.UP;

        constructor(x: number, y: number){
            super();
            this.setPos(new Point(x, y));
        }

        body(key = this.key){
            switch (this.dir){
                case Direction.UP: 
                    return [
                        new Point(key.realX, key.realY - 1),
                        new Point(key.realX, key.realY),
                        new Point(key.realX, key.realY + 1),
                        new Point(key.realX, key.realY + 2),
                    ]
                    break;
                case Direction.RIGHT:
                    return [
                        new Point(key.realX - 1, key.realY),
                        new Point(key.realX, key.realY),
                        new Point(key.realX + 1, key.realY),
                        new Point(key.realX + 2, key.realY),
                    ]
                    break;
            }
        }
    }// end of class Shape_I

    // |___ shape
    class Shape_J extends Shape{
        readonly type: Tetromino_types = Tetromino_types.J;
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            super();
            this.setPos(new Point(x, y));
        }

        body(key = this.key){
            switch(this.dir){
                case Direction.UP:
                // J
                return [
                    new Point(key.realX, key.realY - 1),
                    new Point(key.realX, key.realY),
                    new Point(key.realX, key.realY + 1),
                    new Point(key.realX - 1, key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                // |___
                return [
                    new Point(key.realX + 1, key.realY),
                    new Point(key.realX, key.realY),
                    new Point(key.realX - 1, key.realY),
                    new Point(key.realX - 1, key.realY - 1),
                ]
                break;
                case Direction.DOWN:
                // ┌
                return [
                    new Point(key.realX, key.realY + 1),
                    new Point(key.realX, key.realY),
                    new Point(key.realX, key.realY - 1),
                    new Point(key.realX + 1, key.realY - 1),
                ]
                break;
                case Direction.LEFT:
                // --┐
                return [
                    new Point(key.realX - 1, key.realY),
                    new Point(key.realX, key.realY),
                    new Point(key.realX + 1, key.realY),
                    new Point(key.realX + 1, key.realY + 1),
                ]
                break;
            }// end of switch
        }// end of get body()
    }// end of class Shape_J

    // ___| shape
    class Shape_L extends Shape{
        readonly type: Tetromino_types = Tetromino_types.L;
        key: Point;     
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            super()
            this.setPos(new Point(x, y));
        } 

        body(key = this.key){
            switch(this.dir){
                case Direction.UP:
                // L
                return [
                    new Point(key.realX, key.realY - 1),
                    new Point(key.realX, key.realY),
                    new Point(key.realX, key.realY + 1),
                    new Point(key.realX + 1, key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                // ┌--
                return [
                    new Point(key.realX + 1, key.realY),
                    new Point(key.realX, key.realY),
                    new Point(key.realX - 1, key.realY),
                    new Point(key.realX - 1, key.realY + 1),
                ]
                break;
                case Direction.DOWN:
                // ┐
                return [
                    new Point(key.realX, key.realY + 1),
                    new Point(key.realX, key.realY),
                    new Point(key.realX, key.realY - 1),
                    new Point(key.realX - 1, key.realY - 1),
                ]
                break;
                case Direction.LEFT:
                // --┘
                return [
                    new Point(key.realX - 1, key.realY),
                    new Point(key.realX, key.realY),
                    new Point(key.realX + 1, key.realY),
                    new Point(key.realX + 1, key.realY - 1),
                ]
                break;
            }// end of switch
        }
    }// end of class Shape_L

    // # shape 
    class Shape_O extends Shape{
        readonly type: Tetromino_types = Tetromino_types.O;
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            super();
            this.setPos(new Point(x, y));
        }

        body(key = this.key){
            return [
                new Point(key.realX, key.realY),
                new Point(key.realX + 1, key.realY),
                new Point(key.realX, key.realY + 1),
                new Point(key.realX + 1, key.realY + 1),
            ];
        }
    }// end of class Shape_O

    // |_
    //   |  shape
    class Shape_S extends Shape{
        readonly type: Tetromino_types = Tetromino_types.S;
        key: Point;        
        dir: Direction.UP|Direction.RIGHT = Direction.UP;
 
        constructor(x: number, y: number){
            super();
            this.setPos(new Point(x, y));
        }

        body(key = this.key){
            switch(this.dir){
                case Direction.UP:
                return [
                    new Point(key.realX, key.realY - 1),
                    new Point(key.realX, key.realY),
                    new Point(key.realX + 1, key.realY),
                    new Point(key.realX + 1, key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                return [
                    new Point(key.realX + 1, key.realY),
                    new Point(key.realX, key.realY),
                    new Point(key.realX, key.realY + 1),
                    new Point(key.realX - 1, key.realY + 1),
                ]
                break;
            }
        }// end of get body()
    }// end of class Shape_S

    // __
    //  /    shape
    // /__
    class Shape_Z extends Shape{
        readonly type: Tetromino_types = Tetromino_types.Z;
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            super();
            this.setPos(new Point(x, y));
        }

        body(key = this.key){
            switch(this.dir){
                case Direction.UP:
                return [
                    new Point(key.realX, key.realY - 1),
                    new Point(key.realX, key.realY),
                    new Point(key.realX - 1, key.realY),
                    new Point(key.realX - 1, key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                return [
                    new Point(key.realX + 1, key.realY),
                    new Point(key.realX, key.realY),
                    new Point(key.realX, key.realY - 1),
                    new Point(key.realX - 1, key.realY - 1),
                ]
                break;
            }
        }
    }// end of class Shape_Z

    //___ 
    // |   shape
    class Shape_T extends Shape{
        readonly type: Tetromino_types = Tetromino_types.T;
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number){
            super();
            this.setPos(new Point(x, y));
        }

        body(key = this.key){
            switch(this.dir){
                case Direction.UP:
                return [
                    new Point(key.realX - 1, key.realY),
                    new Point(key.realX, key.realY),
                    new Point(key.realX + 1, key.realY),
                    new Point(key.realX, key.realY + 1),
                ]
                break;
                case Direction.RIGHT:
                return [
                    new Point(key.realX, key.realY - 1),
                    new Point(key.realX, key.realY),
                    new Point(key.realX, key.realY + 1),
                    new Point(key.realX - 1, key.realY),
                ]
                break;
                case Direction.DOWN:
                return [
                    new Point(key.realX - 1, key.realY),
                    new Point(key.realX, key.realY),
                    new Point(key.realX + 1, key.realY),
                    new Point(key.realX, key.realY - 1),
                ]
                break;
                case Direction.LEFT:
                return [
                    new Point(key.realX, key.realY - 1),
                    new Point(key.realX, key.realY),
                    new Point(key.realX, key.realY + 1),
                    new Point(key.realX + 1, key.realY),
                ]
                break;
            }
        }
    }

    
    export function run(){
        //handle game process

        // test!
        let a = new Shape_I(1,3);
        a.rotate()
        let b = new Shape_J(4,3);
        b.state = Tetromino_states.Dead;
        let c = new Shape_L(6,3);
        c.state = Tetromino_states.Dead;
        let d = new Shape_O(0,8);
        d.state = Tetromino_states.Dead;
        let e = new Shape_S(3,8);
        e.state = Tetromino_states.Dead;
        let f = new Shape_T(7,8);
        f.state = Tetromino_states.Dead;
        let g = new Shape_Z(4,12);
        g.state = Tetromino_states.Dead;
        // end of test

    }// end function run


    export function render(ctx: CanvasRenderingContext2D){
        // render method
        ctx.fillStyle = bg_color;
        ctx.fillRect(0, 0, Width, Height);
        
        console.log(game_map)
        game_map.foreach((x: number, y: number, t: Tetromino_types) => {
            switch (t){
                case Tetromino_types.I:
                ctx.fillStyle = I_color;
                break;
                case Tetromino_types.J:
                ctx.fillStyle = J_color;
                break;
                case Tetromino_types.L:
                ctx.fillStyle = L_color;
                break;
                case Tetromino_types.O:
                ctx.fillStyle = O_color;
                break;
                case Tetromino_types.Z:
                ctx.fillStyle = Z_color;
                break;
                case Tetromino_types.S:
                ctx.fillStyle = S_color;
                break;
                case Tetromino_types.T:
                ctx.fillStyle = T_color;
                break;
                default:
                return;
            }
            ctx.fillRect(x * Unit, y * Unit, Unit, Unit);
        });
    }
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

        // render block
        let last_frame = null;
        const render = (t) => {
            if (!last_frame) last_frame = t;

            const time = t - last_frame;
            if (time > 1000){
                Tetris.render(ctx);
                last_frame = t;
            }
            
            window.requestAnimationFrame(render)
        }   
        window.requestAnimationFrame(render);
        // end render block

        // context has been got, let's start doing sth
        //ctx.clearRect(0, 0, Tetris.Width, Tetris.Height);
        Tetris.run();
    } // end if
    else{
        console.error('canvas not found!');
    }// end else
}
main();