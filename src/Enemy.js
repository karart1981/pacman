import MovDirect from "./MovDirect.js";

export class Enemy {
    constructor(x, y, size, velocity, Map) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocity = velocity;
        this.Map = Map;

        this.loadImages();

        this.movDirect = Math.floor(
            Math.random() * Object.keys(MovDirect).length
        );

        this.directTimerDef = this.random(10, 25);
        this.directionTimer = this.directTimerDef;

        this.expireTimerDef = 10;
        this.expireTimer = this.expireTimerDef;
    }

    draw(ctx, pause, pacman) {
        if (!pause) {
            this.move();
            this.changeDirect();
        }
        this.setImage(ctx, pacman);
    }

    collideWith(pacman) {
        const size = this.size / 2;
        if (this.x < pacman.x + size && this.x + size > pacman.x
            && this.y < pacman.y + size &&
            this.y + size > pacman.y) {
            return true;
        } else {
            return false;
        }
    }

    setImage(ctx, pacman) {
        if (pacman.powerDotActive) {
            this.powerDotIsActive(pacman);
        } else {
            this.image = this.normalGhost;
        }
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }

    powerDotIsActive(pacman) {
        if (pacman.powerDotAboutToExpire) {
            this.expireTimer--;
            if (this.expireTimer === 0) {
                this.expireTimer = this.expireTimerDef;
                if (this.image === this.scaredGhost) {
                    this.image = this.scaredGhost2;
                } else {
                    this.image = this.scaredGhost;
                }
            }
        } else {
            this.image = this.scaredGhost;
        }
    }

    changeDirect() {
        this.directionTimer--;
        let newMoveDirect = null;
        if (this.directionTimer == 0) {
            this.directionTimer = this.directTimerDef;
            newMoveDirect = Math.floor(
                Math.random() * Object.keys(MovDirect).length
            );
        }

        if (newMoveDirect != null && this.movDirect != newMoveDirect) {
            if (Number.isInteger(this.x / this.size) && Number.isInteger(this.y / this.size)) {
                if (!this.Map.didCollideWithEnvironment(this.x, this.y, newMoveDirect)) {
                    this.movDirect = newMoveDirect;
                }
            }
        }
    }

    move() {
        if (!this.Map.didCollideWithEnvironment(this.x, this.y, this.movDirect)) {
            switch (this.movDirect) {
                case MovDirect.up:
                    this.y -= this.velocity;
                    break;
                case MovDirect.down:
                    this.y += this.velocity;
                    break;
                case MovDirect.left:
                    this.x -= this.velocity;
                    break;
                case MovDirect.right:
                    this.x += this.velocity;
                    break;
            }
        }
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    loadImages() {
        this.normalGhost = new Image();
        this.normalGhost.src = "./images/ghost.png";

        this.scaredGhost = new Image();
        this.scaredGhost.src = "./images/scaredGhost.png";

        this.scaredGhost2 = new Image();
        this.scaredGhost2.src = "./images/scaredGhost2.png";

        this.image = this.normalGhost;
    }
}