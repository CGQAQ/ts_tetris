namespace Tetris{
    const Unit = 45;
    const Width = 10;
    const Height = 20;
    const DefaultSpeed = 550;
    const Fast_Move_Speed = 50;
    const Init_Y = -1;

    const I_color = '#7FFF99';
    const J_color = '#FF7F82';
    const L_color = '#464646';
    const O_color = '#008080';
    const S_color = '#A37FFF';
    const Z_color = '#A8BEF7';
    const T_color = '#EEFF7F';

    const bg_color = 'rgb(222,222,222)';

    export class Game{
        readonly canvas: HTMLCanvasElement;
        readonly map: UMap;
        readonly sounds: {
            bgm: HTMLAudioElement[], 
            line_cleared: HTMLAudioElement,
            move: HTMLAudioElement,
            rotate: HTMLAudioElement,
        };

        canvas_2d_context: CanvasRenderingContext2D;
        tetromino: Tetromino;
        score: number;
        speed: number;
        process_id: number;
        width: number;
        height: number;
        private unit: number;

        next: Tetromino;

        private init(){
            this.score = 0;
            this.map.empty();
            this.tetromino = null;
            this.next = null;
            this.speed = DefaultSpeed;

            const t = Math.floor(Math.random() * 10000 % 3);
            this.sounds.bgm[t].play();
        }

        // 
        scale(unit: number){
            this.width = this.width / this.unit * unit;
            this.height = this.height / this.unit * unit
            this.unit = unit;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

        resize(width: number, height: number){
            this.width = width * this.unit;
            this.height = height * this.unit;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

        constructor(width: number = Width, height: number = Height, unit: number = Unit, canvas: HTMLCanvasElement){
            this.width = width * unit;
            this.height = height * unit;
            this.unit = unit;
            this.map = new UMap(this.width, this.height);
            this.canvas = canvas;


            // bgms
            let bg1 = new Audio();
            let bg2 = new Audio();
            let bg3 = new Audio();

            // sound effects
            let lineClear = new Audio();
            let move = new Audio();
            let rotate = new Audio();

            this.sounds = {bgm: [bg1, bg2, bg3], line_cleared: lineClear, move, rotate}

            bg1.src = "./../assets/bgm/bg1.mp3";
            bg1.loop = true;
            bg2.src = "./../assets/bgm/bg2.mp3";
            bg2.loop = true;
            bg3.src = "./../assets/bgm/bg3.mp3";
            bg3.loop = true;
            lineClear.src = "./../assets/sound/lineClear.mp3";
            move.src = "./../assets/sound/move.mp3";
            rotate.src = "./../assets/sound/rotate.mp3";

            const body = document.querySelector('body');

            body.appendChild(bg1);
            body.appendChild(bg2);
            body.appendChild(bg3);
            body.appendChild(lineClear);
            body.appendChild(move);
            body.appendChild(rotate);


            this.init();
        }// end of constructor

        render(){
            const self = this
            const ctx = self.canvas_2d_context;

            // render method
            ctx.fillStyle = bg_color;
            ctx.fillRect(0, 0, this.width, this.height);
            
            // console.log(this.map)
            this.map.foreach((x: number, y: number, t: Tetromino_types) => {
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
                ctx.fillRect(x * self.unit, y * self.unit, self.unit, self.unit);
            });

            // predict 
            if (this.tetromino !== null){
                this.tetromino.predict().forEach((p) => {
                    switch (this.tetromino.type){
                        case Tetromino_types.I:
                        ctx.strokeStyle = I_color;
                        break;
                        case Tetromino_types.J:
                        ctx.strokeStyle = J_color;
                        break;
                        case Tetromino_types.L:
                        ctx.strokeStyle = L_color;
                        break;
                        case Tetromino_types.O:
                        ctx.strokeStyle = O_color;
                        break;
                        case Tetromino_types.Z:
                        ctx.strokeStyle = Z_color;
                        break;
                        case Tetromino_types.S:
                        ctx.strokeStyle = S_color;
                        break;
                        case Tetromino_types.T:
                        ctx.strokeStyle = T_color;
                        break;
                        default:
                        return;
                    }
                    ctx.strokeRect(p.x, p.y, self.unit, self.unit);
                });// end of foreach
            }// end of if

            window.requestAnimationFrame(self.render.bind(self));
        }// end of render

        run(){
            //handle game process
    
            // test!
            // let a = new Tetromino_I(1,3);
            // let b = new Tetromino_J(4,3);
            // b.state = Tetromino_states.Dead;
            // let c = new Tetromino_L(6,3);
            // c.state = Tetromino_states.Dead;
            // let d = new Tetromino_O(0,8);
            // d.state = Tetromino_states.Dead;
            // let e = new Tetromino_S(3,8);
            // e.state = Tetromino_states.Dead;
            // let f = new Tetromino_T(7,8);
            // f.state = Tetromino_states.Dead;
            // let g = new Tetromino_Z(4,12);
            // g.state = Tetromino_states.Dead;
            // end of test

            const self = this;
    
            document.onkeydown = function(ev) {
                switch(ev.key){
                    case Key.KeyHome:
                    break;
                    case Key.keyEnd:
                    self.map.empty();
                    break;
                    case Key.KeyUp:
                    if(self.tetromino.rotate()){
                        self.sounds.rotate.play();
                    }
                    break;
                    case Key.KeyDown:
                    if(self.speed !== Fast_Move_Speed){
                        self.speed = Fast_Move_Speed;
                        clearTimeout(self.process_id);
                        self.process_id = setTimeout(self.process.bind(self), self.speed);
                    }
                    break;
                    case Key.keyLeft:
                    if(self.tetromino.move(Direction.LEFT)){
                        self.sounds.move.play();
                    }
                    break;
                    case Key.KeyRight:
                    if(self.tetromino.move(Direction.RIGHT)){
                        self.sounds.move.play();
                    }
                    break;
                }
            }
    
            document.onkeyup = function(ev){
                switch(ev.key){
                    case Key.KeyDown:
                    self.speed = DefaultSpeed;
                    clearTimeout(self.process_id);
                    self.process_id = setTimeout(self.process.bind(self), self.speed);
                    break;
                }
            }

            self.process_id = setTimeout(this.process.bind(this), self.speed);

            // init canvas size
            self.canvas.width = game.width;
            self.canvas.height = game.height;

            // get canvas 2d context
            self.canvas_2d_context = self.canvas.getContext('2d');
            if (self.canvas_2d_context === null){
                console.error("Unable to initialize 2d. Your browser or machine may not support it.");
                return;
            }
            window.requestAnimationFrame(self.render.bind(self));
        }// end function run

        generate_tetromino(): Tetromino{
            const self = this;
            const t = Math.floor(Math.random() * 10000 % 7);
            switch(t){
                case 0:
                return new Tetromino_I(4, Init_Y, self.map);
                break;
                case 1:
                return new Tetromino_J(4, Init_Y, self.map);
                break;
                case 2:
                return new Tetromino_L(4, Init_Y, self.map);
                break;
                case 3:
                return new Tetromino_O(4, Init_Y, self.map);
                break;
                case 4:
                return new Tetromino_Z(4, Init_Y, self.map);
                break;
                case 5:
                return new Tetromino_S(4, Init_Y, self.map);
                break;
                case 6:
                return new Tetromino_T(4, Init_Y, self.map);
                break;
            }// end of switch
        }

        process(){
            const self = this;
            // console.log(self.tetromino)
            // if(self.tetromino !== null) console.log(self.tetromino.state === Tetromino_states.Alive ? "Alive": "dead")  //test pass!
            
            if(self.tetromino === null || self.tetromino.state === Tetromino_states.Dead){

                if(self.tetromino !== null && self.tetromino.key.realY === Init_Y){
                    // console.log(self.tetromino.key.realY)
                    this.sounds.bgm.forEach((bgm) => {
                        bgm.pause()
                        bgm.currentTime = 0;
                    })
                    alert("游戏结束！分数： " + self.score + "点击确定重新开始");
                    self.init();
                }

                

                if(self.tetromino === null){
                    self.tetromino = this.generate_tetromino();
                }
                else if(self.tetromino !== null && self.next !== null){
                    self.tetromino = self.next;
                    self.next = this.generate_tetromino();
                }


                if(self.next === null){
                    self.next = this.generate_tetromino();
                }

                switch(self.next.type){
                    case Tetromino_types.I:
                    console.log("下一个： 长棍");
                    break;
                    case Tetromino_types.J: 
                    console.log("下一个： J型伞把");
                    break;
                    case Tetromino_types.L: 
                    console.log("下一个： L型伞把");
                    break;
                    case Tetromino_types.O: 
                    console.log("下一个： 方块");
                    break;
                    case Tetromino_types.Z: 
                    console.log("下一个： Z型拐爪");
                    break;
                    case Tetromino_types.S: 
                    console.log("下一个： S型拐爪");
                    break;
                    case Tetromino_types.T: 
                    console.log("下一个： T型伞把");
                    break;
                }// end of switch
            }// end of if
            
            self.tetromino.move(Direction.DOWN);
            
            // console.log(self.tetromino.key.realY)
            if(self.tetromino.state === Tetromino_states.Dead){
                const line = self.map.handle_remove_rows();
                if(line > 0){
                    switch(line){
                        case 1:
                        self.score += 10;
                        break;
                        case 2: 
                        self.score += 20;
                        break;
                        case 3: 
                        self.score += 50;
                        break;
                        case 4: 
                        self.score += 100;
                        break;
                        default:
                        throw Error('Unusual line clear!');
                    }
                    self.sounds.line_cleared.play();
                    console.log('Score： ' + self.score);
                }
            }

            
            self.process_id = setTimeout(this.process.bind(this), self.speed);
            // console.count("process!");
        }
    }

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

        constructor(width: number, height: number){
            this.data = [];
            this.width = width / Unit;
            this.length = height / Unit
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
            if(y < 0) return;
            this.data[y][x] = t;
        }

        get(x: number, y: number): Tetromino_types|never{
            if(x < this.width && x >= 0 && y < this.length){
                if(y < 0) return Tetromino_types.Blank;
                return this.data[y][x];
            }
            else{
                throw new Error("#101: x or y out of range!");
            }
        }

        valid(p: Point){
            if(p.realX < this.width && p.realX >= 0 && p.realY < this.length){
                return true;
            }
            else {
                return false
            }
        }

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

        handle_remove_rows(): number {
            const ys = this.in_a_row();
            if (ys.length !== 0){
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
            return ys.length;
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
    
    abstract class Tetromino{
        readonly type: Tetromino_types;
        map: UMap;
        key: Point = new Point(4, 1);
        dir: Direction = Direction.UP;
        state: Tetromino_states = Tetromino_states.Alive;
        abstract body(key?: Point, dir?: Direction): Point[];

        constructor(x: number, y: number, map: UMap){
            this.key = new Point(x, y);
            this.map = map;
            // console.log(this.key, this.map);
            if(!this.can_put(this.key)){
                throw Error("Wrong tetromino position");
            }
        }

        private put_to_map(map: UMap) {
            const self = this;
            // console.log(this.body())
            this.body().forEach((p: Point) => {
                if(p.realY < 0) return;
                map.set(p.realX, p.realY, this.type);
            });
        }

        protected clear_on_map(map: UMap) {
            this.body().forEach((p: Point) => {
                map.set(p.realX, p.realY, Tetromino_types.Blank);
            });
        }

        protected setDir(dir: Direction) {
            this.clear_on_map(this.map);
            this.dir = dir;
            this.put_to_map(this.map);
        }

        protected setPos(p: Point) {
            this.clear_on_map(this.map);
            this.key = p;
            this.put_to_map(this.map);
        }

        can_put(key: Point = this.key, dir: Direction = this.dir): boolean{
            // console.log(dir);
            // console.log("body ::: " + this.body(key, dir))
            let count = 0;
            this.body(key, dir).forEach((p) => {
                if(!this.map.valid(p) || this.map.get(p.realX, p.realY) !== Tetromino_types.Blank){
                    for(let item of this.body()){
                        if(item.realX === p.realX && item.realY === p.realY){   // except itself!
                            return;
                        }
                    }
                    count ++;
                }
            });
            if(count === 0)
                return true;
            else
                return false;
        }

        to_be_death(key: Point){
            if(
                (!this.map.valid(key) && key.realX >= 0 && key.realX < this.map.width) ||  // already reach bottom
                (!this.can_put(key, undefined) && this.map.valid(key))                      // already on top of Tetromino
            ){
                return true;
            }
            else
                return false;
        }

        move(dir: Direction.LEFT|Direction.RIGHT|Direction.DOWN): boolean{
            if(this.state !== Tetromino_states.Dead){
                let newp;
                switch(dir){
                    case Direction.LEFT: 
                        newp = new Point(this.key.realX - 1, this.key.realY)
                        break;
                    case Direction.RIGHT:
                        newp = new Point(this.key.realX + 1, this.key.realY)
                        break;
                    case Direction.DOWN:
                        newp = new Point(this.key.realX, this.key.realY + 1)
                        break;
                }

                if(dir !== Direction.DOWN){
                    if(this.can_put(newp, undefined)){
                        this.setPos(newp);
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    if(this.can_put(newp, undefined)){
                        this.setPos(newp);
                        return true;
                    }
                    else if(this.to_be_death(newp)){
                        this.state = Tetromino_states.Dead;
                        return false;
                    }
                }
                // console.log(this.can_put(newp, undefined), this.state)
            }
        }

        rotate(): boolean{
            if(this.state !== Tetromino_states.Dead){
                let newd;
                switch(this.dir){
                    case Direction.UP:
                    newd = Direction.RIGHT;
                    if(this.can_put(undefined, newd)){
                        this.setDir(newd);
                        return true;
                    }
                    return false;
                    break;
                    case Direction.RIGHT:
                    newd = Direction.DOWN;
                    if(this.can_put(undefined, newd)){
                        this.setDir(newd);
                        return true;
                    }
                    return false;
                    break;
                    case Direction.DOWN:
                    newd = Direction.LEFT;
                    if(this.can_put(undefined, newd)){
                        this.setDir(newd);
                        return true;
                    }
                    return false;
                    break;
                    case Direction.LEFT:
                    newd = Direction.UP
                    if(this.can_put(undefined, newd)){
                        this.setDir(newd);
                        return true;
                    }
                    return false;
                    break;
                }
            }
        }

        predict(): Point[]{
            let delta = 0;
            while(this.can_put(new Point(this.key.realX, this.key.realY + delta), undefined)) delta++;
            return this.body(new Point(this.key.realX, this.key.realY + delta - 1));
        }
    }// end of interface Shape

    enum Direction{
        UP,             /// should be default
        RIGHT,
        DOWN,           /// some shapes do not need two below
        LEFT,
    }// end of enum Direction


    //  ---- shape
    class Tetromino_I extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.I;

        constructor(x: number, y: number, map: UMap){
            super(x, y , map);
        }

        body(key = this.key, dir = this.dir){
            switch (dir){
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

        rotate(): boolean{
            let newd;
            switch(this.dir){
                case Direction.UP:
                newd = Direction.RIGHT;
                if(this.can_put(undefined, newd)){
                    this.setDir(newd);
                    return true;
                }
                break;
                case Direction.RIGHT:
                newd = Direction.UP;
                if(this.can_put(undefined, newd)){
                    this.setDir(newd);
                    return true;
                }
                break;
            }
            return false;
        }
    }// end of class Shape_I

    // |___ shape
    class Tetromino_J extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.J;
 
        constructor(x: number, y: number, map: UMap){
            super(x, y, map);
        }

        body(key = this.key, dir = this.dir){
            switch(dir){
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
    class Tetromino_L extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.L;
 
        constructor(x: number, y: number, map: UMap){
            super(x, y, map);
        } 

        body(key = this.key, dir = this.dir){
            switch(dir){
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
    class Tetromino_O extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.O;
 
        constructor(x: number, y: number, map: UMap){
            super(x, y, map);
        } 

        body(key = this.key, dir = this.dir){
            return [
                new Point(key.realX, key.realY),
                new Point(key.realX + 1, key.realY),
                new Point(key.realX, key.realY + 1),
                new Point(key.realX + 1, key.realY + 1),
            ];
        }

        rotate(){ return false; }
    }// end of class Shape_O

    // |_
    //   |  shape
    class Tetromino_S extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.S;
 
        constructor(x: number, y: number, map: UMap){
            super(x, y, map);
        } 

        body(key = this.key, dir = this.dir){
            switch(dir){
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

        rotate(): boolean{
            let newd;
            switch(this.dir){
                case Direction.UP:
                newd = Direction.RIGHT;
                if(this.can_put(undefined, newd)){
                    this.setDir(newd);
                    return true;
                }
                break;
                case Direction.RIGHT:
                newd = Direction.UP;
                if(this.can_put(undefined, newd)){
                    this.setDir(newd);
                    return true;
                }
                break;
            }
            return false;
        }
    }// end of class Shape_S

    // __
    //  /    shape
    // /__
    class Tetromino_Z extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.Z;
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number, map: UMap){
            super(x, y, map);
        } 

        body(key = this.key, dir = this.dir){
            switch(dir){
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

        rotate(): boolean{
            let newd;
            switch(this.dir){
                case Direction.UP:
                newd = Direction.RIGHT;
                if(this.can_put(undefined, newd)){
                    this.setDir(newd);
                    return true;
                }
                break;
                case Direction.RIGHT:
                newd = Direction.UP;
                if(this.can_put(undefined, newd)){
                    this.setDir(newd);
                    return true;
                }
                break;
            }
            return false;
        }
    }// end of class Shape_Z

    //___ 
    // |   shape
    class Tetromino_T extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.T;
 
        constructor(x: number, y: number, map: UMap){
            super(x, y, map);
        } 

        body(key = this.key, dir = this.dir){
            switch(dir){
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

    
    enum Key{
        KeyUp = "ArrowUp",
        KeyRight = "ArrowRight",
        KeyDown = "ArrowDown",
        keyLeft = "ArrowLeft",
        keyEnd = "End",
        KeyHome = "Home"
    }
}

let game: Tetris.Game;

function main(){
    const canvas = window.document.querySelector('canvas');
    game = new Tetris.Game(undefined, undefined, undefined, canvas);
    game.run();
}
main();