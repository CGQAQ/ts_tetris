import * as $ from 'jquery';
import { Tetris } from './main';

import Game = Tetris.Game;
import UMap = Tetris.UMap;
import Tetromino = Tetris.Tetromino;
import Tetromino_I = Tetris.Tetromino_I;
import Tetromino_J = Tetris.Tetromino_J;
import Tetromino_types = Tetris.Tetromino_types;
import Tetromino_L = Tetris.Tetromino_L;
import Tetromino_O = Tetris.Tetromino_O;
import Tetromino_S = Tetris.Tetromino_S;
import Tetromino_T = Tetris.Tetromino_T;
import Tetromino_Z = Tetris.Tetromino_Z;
import Key = Tetris.Key;



let game: Game;
let ctx: CanvasRenderingContext2D;
let map: UMap = null;

const Unit = 50;
const Width = 4 * Unit;
const Height = 4 * Unit;

const rootEle = $('#content');
const side = $('#side-content');
const ncan = $('#next');
const fig = $('.figure');
const next_area = $('#next-area');
const next_description = $('#next-description');
const score = $('#score');

const bg_on = $('#bgm-on');
const bg_off = $('#bgm-off');
const sf_on = $('#sf-on');
const sf_off = $('#sf-off');
const scale_bigger = $('#scale-bigger');
const scale_smaller = $('#scale-smaller');
const ctrl_start = $('#ctrl-start');
const ctrl_stop = $('#ctrl-stop');
const ctrl_rotate = $('#ctrl-rotate');
const ctrl_left = $('#ctrl-left');
const ctrl_down = $('#ctrl-down');
const ctrl_right = $('#ctrl-right');



function onNextChange(old: Tetromino, newr: Tetromino){
    if(ctx != null && newr != null){
        let tetromino: Tetromino;
        switch(newr.type){
            case Tetromino_types.I:
            tetromino = new Tetromino_I(1, 1, Unit, map);
            break;
            case Tetromino_types.J:
            tetromino = new Tetromino_J(2, 1, Unit, map);
            break;
            case Tetromino_types.L:
            tetromino = new Tetromino_L(1, 1, Unit, map);
            break;
            case Tetromino_types.O:
            tetromino = new Tetromino_O(1, 1, Unit, map);
            break;
            case Tetromino_types.Z:
            tetromino = new Tetromino_Z(2, 1, Unit, map);
            break;
            case Tetromino_types.S:
            tetromino = new Tetromino_S(1, 1, Unit, map);
            break;
            case Tetromino_types.T:
            tetromino = new Tetromino_T(1, 1, Unit, map);
            break;
        }// end of switch
        ctx.clearRect(0, 0, Width, Height);
        ctx.fillStyle = Tetris.bg_color;
        ctx.fillRect(0, 0, Width, Height);
        ctx.fillStyle = tetromino.color;
        map.empty();
        tetromino.draw();
        map.foreach((x, y, t) => {
            if(t !== Tetromino_types.Blank){
                console.log(x, y, Unit)
                ctx.fillRect(x * Unit, y * Unit, Unit, Unit);
            }
               
        })
    }// end of if
}// end of function onNextChange

function onScoreChange(old: number, newer: number){
    score.text('分数： ' + newer);
}

function main(){
    const canvas = window.document.querySelector('canvas');
    game = new Tetris.Game(undefined, undefined, undefined, canvas);
    game.run();
    game.setOnNextChangeListener(onNextChange);
    game.setOnScoreChangeLisener(onScoreChange);
    map = new UMap(Width, Height, Unit);


    side.width(Width);
    side.height(game.height);

    fig.width(Width);
    next_area.height(Height);
    

    ncan.prop('width', Width);
    ncan.prop('height', Height);
    

    next_description.height(50);

    ctx = (<HTMLCanvasElement>ncan.get()[0]).getContext('2d');
    if (ctx===null){
        throw Error('side content canvas can\'t get context!');
    }
    else{
        ctx.fillStyle = Tetris.bg_color;
        ctx.fillRect(0, 0, Width, Height);
    }


    // ctrl 
    bg_on.click(()=>{
        if(game.current_bgm.paused)
        game.current_bgm.play();
    });
    bg_off.click(()=>{
        if(game.current_bgm.played){
            game.current_bgm.pause();
            game.current_bgm.currentTime = 0;
        }
    });
    sf_on.click(()=>{
        game.sf = true;
    });
    sf_off.click(()=>{
        game.sf = false;
    });
    scale_bigger.click(()=>{
        game.scale(game.unit + 10);
    });
    scale_smaller.click(()=>{
        game.scale(game.unit - 10);
    });
    ctrl_start.click(()=>{
        rootEle.trigger($.Event('keydown', {keyCode: Key.KeyHome}));
    });
    ctrl_stop.click(()=>{
        rootEle.trigger($.Event('keydown', {keyCode: Key.keyEnd}));
    });
    ctrl_rotate.click(()=>{
        rootEle.trigger($.Event('keydown', {keyCode: Key.KeyUp}));
    });

    let lid = null;
    ctrl_left.mousedown(()=>{
        rootEle.trigger($.Event('keydown', {keyCode: Key.keyLeft}));
        if(lid === null){
            lid = setInterval(()=>{
                rootEle.trigger($.Event('keydown', {keyCode: Key.keyLeft}));
            }, 150);
        }
    });
    ctrl_left.mouseup(()=>{
        if(lid !== null) {
            clearInterval(lid);
            lid = null;
        }
    });
    ctrl_down.mousedown(()=>{
        rootEle.trigger($.Event('keydown', {keyCode: Key.KeyDown}));
    });
    ctrl_down.mouseup(()=>{
        rootEle.trigger($.Event('keyup', {keyCode: Key.KeyDown}));
    });

    let rid = null;
    ctrl_right.mousedown(()=>{
        rootEle.trigger($.Event('keydown', {keyCode: Key.KeyRight}));
        if(rid === null){
            rid = setInterval(() => {
                rootEle.trigger($.Event('keydown', {keyCode: Key.KeyRight}));
            }, 150);
        }
    });
    ctrl_right.mouseup(()=>{
        if(rid !== null) {
            clearInterval(rid);
            rid = null;
        }
    });
}
main();