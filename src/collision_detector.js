export default class CollisionDetector {
    constructor(){
        this.layers = {
            map: [],
            background: [],
            world: [],
            forest: [],
            pickups: [],
            player: [],
            item: []
        };
    }

    drawAllTiles(ctx){
        Object.entries(this.layers).forEach(([_, layer]) => {
            layer.forEach((tile) => {
                tile.draw(ctx)
            })
        })
    }

    checkCollision(layer){
        if (layer === "all") {
            Object.entries(this.layers).forEach(([_, currentLayer]) => {
                this.detectCollisionsInLayer(currentLayer)
            })
        } else {
            this.detectCollisionsInLayer(this.layers[layer])
        }
    }

    detectCollisionsInLayer(currentLayer){
        currentLayer.forEach(tile => {
            const h1 = new Hitbox(tile);
            currentLayer.forEach(other => {
                if (tile === other) {
                    return false
                } else {
                    const h2 = new Hitbox(other);
                    const collision = this.hitboxOverlapping(h1, h2);
                    if (collision) {
                        tile.dispatchEvent(new CustomEvent('collision', {detail: other}));
                    }
                }
            })
        })
    }

    hitboxOverlapping(h1, h2) {
        if ( h1.getRight() > h2.getLeft() && h1.getLeft() < h2.getRight()) {
            if ( h1.getBottom() > h2.getTop() && h1.getTop() < h2.getBottom() ) {
                return true
            }
        }
        return false
    }
    
}

export function calculatePenetration(tile, other) {
    const h1 = new Hitbox(tile);
    const h2 = new Hitbox(other);
    // only on the x-Axis
    let c1 = h1.getCenter()
    let c2 = h2.getCenter()

    let x = h1.getRight() - h2.getLeft()
    if (c1.x > c2.x) {
        x = h1.getLeft() - h2.getRight()
    }

    let y = h1.getBottom() - h2.getTop()
    if (c1.y > c2.y) {
        y = h1.getTop() - h2.getBottom()
    }

    return {x: x / h1.tileSize, y: y / h1.tileSize}

}


class Hitbox {
    constructor(tile) {
        this.x = tile.x * tile.tileSize
        this.y = tile.y * tile.tileSize
        this.tileSize = tile.tileSize
    }

    getLeft() {
        return this.x
    }
    getTop() {
        return this.y
    }
    getRight() {
        return this.x + this.tileSize
    }
    getBottom() {
        return this.y + this.tileSize
    }
    getCenter() {
        return {
            x: this.x + this.tileSize / 2,
            y: this.y + this.tileSize / 2,
        }
    }
}
