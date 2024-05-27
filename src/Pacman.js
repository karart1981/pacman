import MovingDirection from "./MovDirect.js";

export class Pacman {
    constructor(x, y, size, velocity, Map) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocity = velocity;
        this.Map = Map;

        this.currentMovDirect = null;
        this.requestedMovingDirection = null;

        this.pacmanAnimationTimerDefault = 10;
        this.pacmanAnimTimer = null;

        this.pacmanRotation = this.Rotation.right;
        this.wakaSound = new Audio("sounds/waka.wav");

        this.powerDotSound = new Audio("sounds/power_dot.wav");
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
        this.timers = [];

        this.eatGhostSound = new Audio("sounds/eat_ghost.wav");

        this.madeFirstMove = false;

        document.addEventListener("keydown", this.keydown);

        this.loadPacmanImages();
    }

    Rotation = {
        right: 0,
        down: 1,
        left: 2,
        up: 3,
    };

    draw(ctx, pause, enemies) {
        if (!pause) {
            this.move();
            this.animate();
        }
        this.eatDot();
        this.eatPowerDot();
        this.eatGhost(enemies);

        const size = this.size / 2;

        ctx.save();
        ctx.translate(this.x + size, this.y + size);
        ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
        ctx.drawImage(
            this.pacmanImages[this.pacmanImageIndex],
            -size,
            -size,
            this.size,
            this.size
        );
        ctx.restore();
    }

    loadPacmanImages() {
        const pacmanImage1 = new Image();
        pacmanImage1.src = "images/pac0.png";

        const pacmanImage2 = new Image();
        pacmanImage2.src = "images/pac1.png";

        const pacmanImage3 = new Image();
        pacmanImage3.src = "images/pac2.png";

        const pacmanImage4 = new Image();
        pacmanImage4.src = "images/pac1.png";

        this.pacmanImages = [
            pacmanImage1,
            pacmanImage2,
            pacmanImage3,
            pacmanImage4,
        ];

        this.pacmanImageIndex = 0;
    }

    keydown = (event) => {
        if (event.keyCode == 38) {
            if (this.currentMovDirect == MovingDirection.down)
                this.currentMovDirect = MovingDirection.up;
            this.requestedMovingDirection = MovingDirection.up;
            this.madeFirstMove = true;
        }
        if (event.keyCode == 40) {
            if (this.currentMovDirect == MovingDirection.up)
                this.currentMovDirect = MovingDirection.down;
            this.requestedMovingDirection = MovingDirection.down;
            this.madeFirstMove = true;
        }
        if (event.keyCode == 37) {
            if (this.currentMovDirect == MovingDirection.right)
                this.currentMovDirect = MovingDirection.left;
            this.requestedMovingDirection = MovingDirection.left;
            this.madeFirstMove = true;
        }
        if (event.keyCode == 39) {
            if (this.currentMovDirect == MovingDirection.left)
                this.currentMovDirect = MovingDirection.right;
            this.requestedMovingDirection = MovingDirection.right;
            this.madeFirstMove = true;
        }
    };

    move() {
        if (this.currentMovDirect !== this.requestedMovingDirection) {
            if (Number.isInteger(this.x / this.size) &&
                Number.isInteger(this.y / this.size)) {
                if (!this.Map.didCollideWithEnvironment(
                    this.x, this.y, this.requestedMovingDirection)) {
                    this.currentMovDirect = this.requestedMovingDirection;
                }
            }
        }

        if (this.Map.didCollideWithEnvironment(
            this.x, this.y, this.currentMovDirect)) {
            this.pacmanAnimTimer = null;
            this.pacmanImageIndex = 1;
            return;
        } else if (this.currentMovDirect != null &&
            this.pacmanAnimTimer == null) {
            this.pacmanAnimTimer = this.pacmanAnimationTimerDefault;
        }

        switch (this.currentMovDirect) {
            case MovingDirection.up:
                this.y -= this.velocity;
                this.pacmanRotation = this.Rotation.up;
                break;
            case MovingDirection.down:
                this.y += this.velocity;
                this.pacmanRotation = this.Rotation.down;
                break;
            case MovingDirection.left:
                this.x -= this.velocity;
                this.pacmanRotation = this.Rotation.left;
                break;
            case MovingDirection.right:
                this.x += this.velocity;
                this.pacmanRotation = this.Rotation.right;
                break;
        }
    }

    animate() {
        if (this.pacmanAnimTimer == null) {
            return;
        }
        this.pacmanAnimTimer--;
        if (this.pacmanAnimTimer == 0) {
            this.pacmanAnimTimer = this.pacmanAnimationTimerDefault;
            this.pacmanImageIndex++;
            if (this.pacmanImageIndex == this.pacmanImages.length)
                this.pacmanImageIndex = 0;
        }
    }

    eatDot() {
        if (this.Map.eatDot(this.x, this.y) && this.madeFirstMove) {
            this.wakaSound.play();
        }
    }

    eatPowerDot() {
        if (this.Map.eatPowerDot(this.x, this.y)) {
            this.powerDotSound.play();
            this.powerDotActive = true;
            this.powerDotAboutToExpire = false;
            this.timers.forEach((timer) => clearTimeout(timer));
            this.timers = [];

            let powerDotTimer = setTimeout(() => {
                this.powerDotActive = false;
                this.powerDotAboutToExpire = false;
            }, 1000 * 6);

            this.timers.push(powerDotTimer);

            let powerDotAboutToExpireTimer = setTimeout(() => {
                this.powerDotAboutToExpire = true;
            }, 1000 * 3);

            this.timers.push(powerDotAboutToExpireTimer);
        }
    }

    eatGhost(enemies) {
        if (this.powerDotActive) {
            const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
            collideEnemies.forEach((enemy) => {
                enemies.splice(enemies.indexOf(enemy), 1);
                this.eatGhostSound.play();
            });
        }
    }
}