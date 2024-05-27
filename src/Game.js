import { Map } from "./Map.js";

export class Game {
    constructor(canvasId, size, velocity) {
        this.size = size;
        this.velocity = velocity;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.Map = new Map(size);
        this.pacman = this.Map.getPacman(velocity);
        this.enemies = this.Map.getEnemies(velocity);
        this.gameOver = false;
        this.gameWin = false;
        this.gameOverSound = new Audio("sounds/gameOver.wav");
        this.gameWinSound = new Audio("sounds/gameWin.wav");
        this.Map.setCanvasSize(this.canvas);
        this.startGameLoop();
        
    }

    startGameLoop() {
        setInterval(() => this.gameLoop(), 1000 / 75);
    }

    gameLoop() {
        this.Map.draw(this.ctx);
        this.drawGameEnd();
        this.pacman.draw(this.ctx, this.isPaused(), this.enemies);
        this.enemies.forEach((enemy) => enemy.draw(this.ctx, this.isPaused(), this.pacman));
        this.checkGameOver();
        this.checkGameWin();
    }

    checkGameWin() {
        if (!this.gameWin) {
            this.gameWin = this.Map.didWin();
            if (this.gameWin) {
                this.gameWinSound.play();
            }
        }
    }

    checkGameOver() {
        if (!this.gameOver) {
            this.gameOver = this.isGameOver();
            if (this.gameOver) {
                this.gameOverSound.play();
            }
        }
    }

    isGameOver() {
        return this.enemies.some(
            (enemy) => !this.pacman.powerDotActive && enemy.collideWith(this.pacman)
        );
    }

    isPaused() {
        return !this.pacman.madeFirstMove || this.gameOver || this.gameWin;
    }

    drawGameEnd() {
        if (this.gameOver || this.gameWin) {
            let text = " You Win!";
            if (this.gameOver) {
                text = "Game Over";
            }

            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, this.canvas.height / 3.2, this.canvas.width, 80);

            this.ctx.font = "75px Fantacy";

            this.ctx.fillStyle = "#100E5E";
            this.ctx.fillText(text, 150, this.canvas.height / 2);
        }
    }
}