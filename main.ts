export namespace Tetris{
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

    export const bg_color = 'rgb(222,222,222)';

    console.log("Design & Written By CG, forward code & republish Please write clearly original author!");
    console.log("Press Home button to start & pause the game, End button to stop the game.");

    enum Game_state{
        Started,
        Stopped,
        Paused,
    }
    type OnNextChangeListenerCallback = (old: Tetromino, newer: Tetromino) => void;
    type OnScoreChangeListenerCallback = (old: number, newer: number) => void;

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
        speed: number;
        process_id: number;
        width: number;
        height: number;
        unit: number;

        current_bgm: HTMLAudioElement;

        state: Game_state;
        sf: boolean = true;

        // next with observe
        private _next: Tetromino;
        set next(next: Tetromino){
            this.onNextChangeLiseners.forEach((c) => {
                c(this._next, next);
            });
            this._next = next;
        }
        get next(): Tetromino{
            return this._next;
        }
        private onNextChangeLiseners: OnNextChangeListenerCallback[] = [];
        setOnNextChangeListener(callback: OnNextChangeListenerCallback){
            this.onNextChangeLiseners.push(callback);
        }

        // score with observe
        private _score: number;
        set score(next: number){
            this.onScoreChangeLiseners.forEach((c) => {
                c(this._score, next);
            });
            this._score = next;
        }
        get score(): number{
            return this._score;
        }
        private onScoreChangeLiseners: OnScoreChangeListenerCallback[] = [];
        setOnScoreChangeLisener(callback: OnScoreChangeListenerCallback){
            this.onScoreChangeLiseners.push(callback);
        }

        private init(){
            this.score = 0;
            this.map.empty();
            this.tetromino = null;
            this.next = null;
            this.speed = DefaultSpeed;

            const t = Math.floor(Math.random() * 10000 % 3);
            this.current_bgm = this.sounds.bgm[t];
            this.current_bgm.play();
            this.state = Game_state.Stopped;
        }

        // 
        scale(unit: number){
            this.width = this.width / this.unit * unit;
            this.height = this.height / this.unit * unit
            this.unit = unit;
            this.canvas.setAttribute('width', this.width+'');
            this.canvas.setAttribute('height', this.height+'');
        }

        resize(width: number, height: number){
            this.width = width * this.unit;
            this.height = height * this.unit;
            this.canvas.setAttribute('width', this.width+'');
            this.canvas.setAttribute('height', this.height+'');
        }

        constructor(width: number = Width, height: number = Height, unit: number = Unit, canvas: HTMLCanvasElement){
            this.width = width * unit;
            this.height = height * unit;
            this.unit = unit;
            this.map = new UMap(this.width, this.height, unit);
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
                const tetromino: Tetromino = this.tetromino.predict();
                tetromino.body().forEach((p) => {
                    ctx.strokeStyle = tetromino.color;
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
                switch(ev.keyCode){
                    case Key.KeyHome:
                    if(self.state !== Game_state.Started){
                        self.state = Game_state.Started;
                    }
                    else{
                        self.state = Game_state.Paused;
                    }
                    break;
                    case Key.keyEnd:
                    self.sounds.bgm.forEach((bgm) => {
                        bgm.pause()
                        bgm.currentTime = 0;
                    })
                    self.init();
                    break;
                    case Key.KeyUp:
                    if(self.state === Game_state.Started && self.tetromino.rotate()){
                        if(self.sf)self.sounds.rotate.play();
                    }
                    break;
                    case Key.KeyDown:
                    if(self.state === Game_state.Started && self.speed !== Fast_Move_Speed){
                        self.speed = Fast_Move_Speed;
                        clearTimeout(self.process_id);
                        self.process_id = setTimeout(self.process.bind(self), self.speed);
                    }
                    break;
                    case Key.keyLeft:
                    if(self.state === Game_state.Started && self.tetromino.move(Direction.LEFT)){
                        if(self.sf)self.sounds.move.play();
                    }
                    break;
                    case Key.KeyRight:
                    if(self.state === Game_state.Started && self.tetromino.move(Direction.RIGHT)){
                        if(self.sf)self.sounds.move.play();
                    }
                    break;
                }
            }
    
            document.onkeyup = function(ev){
                switch(ev.keyCode){
                    case Key.KeyDown:
                    self.speed = DefaultSpeed;
                    clearTimeout(self.process_id);
                    self.process_id = setTimeout(self.process.bind(self), self.speed);
                    break;
                }
            }

            self.process_id = setTimeout(this.process.bind(this), self.speed);

            // init canvas size
            self.canvas.width = self.width;
            self.canvas.height = self.height;

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
                return new Tetromino_I(4, Init_Y, self.unit, self.map);
                break;
                case 1:
                return new Tetromino_J(4, Init_Y, this.unit, self.map);
                break;
                case 2:
                return new Tetromino_L(4, Init_Y, this.unit, self.map);
                break;
                case 3:
                return new Tetromino_O(4, Init_Y, this.unit, self.map);
                break;
                case 4:
                return new Tetromino_Z(4, Init_Y, this.unit, self.map);
                break;
                case 5:
                return new Tetromino_S(4, Init_Y, this.unit, self.map);
                break;
                case 6:
                return new Tetromino_T(4, Init_Y, this.unit, self.map);
                break;
            }// end of switch
        }

        process(){
            const self = this;
            // console.log(self.tetromino)
            // if(self.tetromino !== null) console.log(self.tetromino.state === Tetromino_states.Alive ? "Alive": "dead")  //test pass!
            
            if(self.state === Game_state.Started){
                if(self.tetromino === null || self.tetromino.state === Tetromino_states.Dead){
                    if(self.tetromino !== null && self.tetromino.key.realY === Init_Y){
                        // console.log(self.tetromino.key.realY)
                        this.sounds.bgm.forEach((bgm) => {
                            bgm.pause()
                            bgm.currentTime = 0;
                        });
                        alert("游戏结束！分数： " + self.score + "点击确定重新开始");
                        self.init();
                        self.state = Game_state.Started;
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
                        if(this.sf)
                        self.sounds.line_cleared.play();
                        console.log('Score： ' + self.score);
                    }
                }
            } //end of if(self.state === Game_state.Started){
            self.process_id = setTimeout(this.process.bind(this), self.speed);
            // console.count("process!");
        }
    }

    export class Point{
        private _x;
        private _y;
        readonly unit;

        constructor(x: number, y:number, unit: number){
            this.x = x;
            this.y = y;
            this.unit = unit;
        }
        
        public get x() : number {
            return this._x * this.unit;
        }

        public get realX() : number {
            return this._x;
        }
        
        public set x(x : number) {
            this._x = x;
        }
        
        public get y() : number {
            return this._y * this.unit;
        }
        
        public get realY() : number {
            return this._y;
        }

        public set y(y : number) {
            this._y = y;
        }
    }// end class Point


    export enum Tetromino_types{
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

    export class UMap{
        private data: Tetromino_types[][];
        width: number;
        length: number;

        constructor(width: number, height: number, unit: number){
            this.data = [];
            this.width = width / unit;
            this.length = height / unit;
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
    
    export abstract class Tetromino{
        readonly type: Tetromino_types;
        readonly color: string;

        unit: number;
        map: UMap;
        key: Point;
        dir: Direction = Direction.UP;
        state: Tetromino_states = Tetromino_states.Alive;
        abstract body(key?: Point, dir?: Direction): Point[];

        constructor(x: number, y: number, unit: number, map: UMap){
            this.unit = unit;
            this.key = new Point(x, y, unit);
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

        draw(){
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
                        newp = new Point(this.key.realX - 1, this.key.realY, this.unit)
                        break;
                    case Direction.RIGHT:
                        newp = new Point(this.key.realX + 1, this.key.realY, this.unit)
                        break;
                    case Direction.DOWN:
                        newp = new Point(this.key.realX, this.key.realY + 1, this.unit)
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

        predict(): Tetromino{
            let delta = 0;
            let t;
            while(this.can_put(new Point(this.key.realX, this.key.realY + delta, this.unit), undefined)) delta++;
            switch(this.type){
                case Tetromino_types.I:
                t = new Tetromino_I(this.key.realX, this.key.realY + delta - 1, this.unit, this.map);
                break;
                case Tetromino_types.J:
                t =  new Tetromino_J(this.key.realX, this.key.realY + delta - 1, this.unit, this.map);
                break;
                case Tetromino_types.L:
                t =  new Tetromino_L(this.key.realX, this.key.realY + delta - 1, this.unit, this.map);
                break;
                case Tetromino_types.O:
                t =  new Tetromino_O(this.key.realX, this.key.realY + delta - 1, this.unit, this.map);
                break;
                case Tetromino_types.S:
                t =  new Tetromino_S(this.key.realX, this.key.realY + delta - 1, this.unit, this.map);
                break;
                case Tetromino_types.Z:
                t =  new Tetromino_Z(this.key.realX, this.key.realY + delta - 1, this.unit, this.map);
                break;
                case Tetromino_types.T:
                t =  new Tetromino_T(this.key.realX, this.key.realY + delta - 1, this.unit, this.map);
                break;
            }
            t.dir = this.dir;
            return t;
        }// end of predict
    }// end of interface Shape

    enum Direction{
        UP,             /// should be default
        RIGHT,
        DOWN,           /// some shapes do not need two below
        LEFT,
    }// end of enum Direction


    //  ---- shape
    export class Tetromino_I extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.I;
        readonly color: string = I_color;

        constructor(x: number, y: number, unit: number, map: UMap){
            super(x, y, unit, map);
        } 

        body(key = this.key, dir = this.dir){
            switch (dir){
                case Direction.UP: 
                    return [
                        new Point(key.realX, key.realY - 1, this.unit),
                        new Point(key.realX, key.realY, this.unit),
                        new Point(key.realX, key.realY + 1, this.unit),
                        new Point(key.realX, key.realY + 2, this.unit),
                    ]
                    break;
                case Direction.RIGHT:
                    return [
                        new Point(key.realX - 1, key.realY, this.unit),
                        new Point(key.realX, key.realY, this.unit),
                        new Point(key.realX + 1, key.realY, this.unit),
                        new Point(key.realX + 2, key.realY, this.unit),
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
    export class Tetromino_J extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.J;
        readonly color: string = J_color;
 
        constructor(x: number, y: number, unit: number, map: UMap){
            super(x, y, unit, map);
        }

        body(key = this.key, dir = this.dir){
            switch(dir){
                case Direction.UP:
                // J
                return [
                    new Point(key.realX, key.realY - 1, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX, key.realY + 1, this.unit),
                    new Point(key.realX - 1, key.realY + 1, this.unit),
                ]
                break;
                case Direction.RIGHT:
                // |___
                return [
                    new Point(key.realX + 1, key.realY, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX - 1, key.realY, this.unit),
                    new Point(key.realX - 1, key.realY - 1, this.unit),
                ]
                break;
                case Direction.DOWN:
                // ┌
                return [
                    new Point(key.realX, key.realY + 1, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX, key.realY - 1, this.unit),
                    new Point(key.realX + 1, key.realY - 1, this.unit),
                ]
                break;
                case Direction.LEFT:
                // --┐
                return [
                    new Point(key.realX - 1, key.realY, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX + 1, key.realY, this.unit),
                    new Point(key.realX + 1, key.realY + 1, this.unit),
                ]
                break;
            }// end of switch
        }// end of get body()
    }// end of class Shape_J

    // ___| shape
    export class Tetromino_L extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.L;
        readonly color: string = L_color;
 
        constructor(x: number, y: number, unit: number, map: UMap){
            super(x, y, unit, map);
        } 

        body(key = this.key, dir = this.dir){
            switch(dir){
                case Direction.UP:
                // L
                return [
                    new Point(key.realX, key.realY - 1, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX, key.realY + 1, this.unit),
                    new Point(key.realX + 1, key.realY + 1, this.unit),
                ]
                break;
                case Direction.RIGHT:
                // ┌--
                return [
                    new Point(key.realX + 1, key.realY, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX - 1, key.realY, this.unit),
                    new Point(key.realX - 1, key.realY + 1, this.unit),
                ]
                break;
                case Direction.DOWN:
                // ┐
                return [
                    new Point(key.realX, key.realY + 1, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX, key.realY - 1, this.unit),
                    new Point(key.realX - 1, key.realY - 1, this.unit),
                ]
                break;
                case Direction.LEFT:
                // --┘
                return [
                    new Point(key.realX - 1, key.realY, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX + 1, key.realY, this.unit),
                    new Point(key.realX + 1, key.realY - 1, this.unit),
                ]
                break;
            }// end of switch
        }
    }// end of class Shape_L

    // # shape 
    export class Tetromino_O extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.O;
        readonly color: string = O_color;
 
        constructor(x: number, y: number, unit: number, map: UMap){
            super(x, y, unit, map);
        } 

        body(key = this.key, dir = this.dir){
            return [
                new Point(key.realX, key.realY, this.unit),
                new Point(key.realX + 1, key.realY, this.unit),
                new Point(key.realX, key.realY + 1, this.unit),
                new Point(key.realX + 1, key.realY + 1, this.unit),
            ];
        }

        rotate(){ return false; }
    }// end of class Shape_O

    // |_
    //   |  shape
    export class Tetromino_S extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.S;
        readonly color: string = S_color;
 
        constructor(x: number, y: number, unit: number, map: UMap){
            super(x, y, unit, map);
        } 

        body(key = this.key, dir = this.dir){
            switch(dir){
                case Direction.UP:
                return [
                    new Point(key.realX, key.realY - 1, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX + 1, key.realY, this.unit),
                    new Point(key.realX + 1, key.realY + 1, this.unit),
                ]
                break;
                case Direction.RIGHT:
                return [
                    new Point(key.realX + 1, key.realY, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX, key.realY + 1, this.unit),
                    new Point(key.realX - 1, key.realY + 1, this.unit),
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
    export class Tetromino_Z extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.Z;
        readonly color: string = Z_color;
        
        key: Point;        
        dir: Direction = Direction.UP;
 
        constructor(x: number, y: number, unit: number, map: UMap){
            super(x, y, unit, map);
        } 

        body(key = this.key, dir = this.dir){
            switch(dir){
                case Direction.UP:
                return [
                    new Point(key.realX, key.realY - 1, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX - 1, key.realY, this.unit),
                    new Point(key.realX - 1, key.realY + 1, this.unit),
                ]
                break;
                case Direction.RIGHT:
                return [
                    new Point(key.realX + 1, key.realY, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX, key.realY - 1, this.unit),
                    new Point(key.realX - 1, key.realY - 1, this.unit),
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
    export class Tetromino_T extends Tetromino{
        readonly type: Tetromino_types = Tetromino_types.T;
        readonly color: string = T_color;
 
        constructor(x: number, y: number, unit: number, map: UMap){
            super(x, y, unit, map);
        } 

        body(key = this.key, dir = this.dir){
            switch(dir){
                case Direction.UP:
                return [
                    new Point(key.realX - 1, key.realY, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX + 1, key.realY, this.unit),
                    new Point(key.realX, key.realY + 1, this.unit),
                ]
                break;
                case Direction.RIGHT:
                return [
                    new Point(key.realX, key.realY - 1, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX, key.realY + 1, this.unit),
                    new Point(key.realX - 1, key.realY, this.unit),
                ]
                break;
                case Direction.DOWN:
                return [
                    new Point(key.realX - 1, key.realY, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX + 1, key.realY, this.unit),
                    new Point(key.realX, key.realY - 1, this.unit),
                ]
                break;
                case Direction.LEFT:
                return [
                    new Point(key.realX, key.realY - 1, this.unit),
                    new Point(key.realX, key.realY, this.unit),
                    new Point(key.realX, key.realY + 1, this.unit),
                    new Point(key.realX + 1, key.realY, this.unit),
                ]
                break;
            }
        }
    }

    
    export enum Key{
        KeyUp = 38,
        KeyRight = 39,
        KeyDown = 40,
        keyLeft = 37,
        keyEnd = 35,
        KeyHome = 36,
    }
}