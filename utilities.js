
// Useful fxns
function remap(v, v0, v1, nv0, nv1) {
    let pct = (v - v0)/(v1 - v0)
    return pct*(nv1 - nv0) + nv0
}

let noise = (() => {
    let noiseFxn = new SimplexNoise(0)
    return function noiseAny() {
        if ( arguments.length == 1)
            return noiseFxn.noise2D(arguments[0],0)
        if ( arguments.length == 2)
            return noiseFxn.noise2D(arguments[0],arguments[1])
        if ( arguments.length == 3)
            return noiseFxn.noise3D(arguments[0],arguments[1],arguments[2])
        if ( arguments.length == 4)
            return noiseFxn.noise4D(arguments[0],arguments[1],arguments[2], arguments[3])
        return 0
    }
})()

function lerp(c0, c1, pct) {
    return c0 + pct*(c1 - c0)
}
function constrain(x, min, max) {
    return Math.min(max, Math.max(x, min))
}

function lerpColors(c0, c1, pct) {
    if (!c0)
        console.warn("Not a color", c0)
    if (!c1)
        console.warn("Not a color", c1)
    return [lerp(c0[0], c1[0], pct),
        lerp(c0[1], c1[1], pct),
        lerp(c0[2], c1[2], pct)]
}

class DraggableP5Mouse extends Vector2D {
    constructor(p, {
        getObjects, 
        onMove, onPress, onRelease, onDrag, onDblclick, onClick,getDistanceTo, getClosest,setToPosition
    }) {
        super(0,0)
        this.p = p

        this.lastPos = new Vector2D(0,0)
        this.pressedPos = new Vector2D(0,0)
        this.pressedTime = 0
        this.releasedPos = new Vector2D(0,0)
        this.releasedTime = 0

        this.heldObjects = []
        this.selectedObjects = []
        this.overObjects = []

        this.d = 0
        this.draggedDistance = 0
        this.movedDistance = 0
        this.speed = 0
        this.lastUpdate = Date.now()

        this.getClosestCustom = getClosest
        this.getDistanceToCustom = getDistanceTo
        this.setToPositionCustom = setToPosition


        p.mouseMoved = () => {
            this.updatePos()
            if (this.inCanvas) {

                
            // console.log("moved", this.toFixed(2), this.d)
                this.movedDistance += this.d

                if (getObjects) {
                    let objs = getObjects()
                    if (objs) {
                        let obj = this.getClosest(objs)
                        this.overObjects = [obj]

                    }       
                }
                onMove?.(this)
            }
        }

        p.mouseDragged = () => {
            this.updatePos()
            this.draggedDistance += this.d
            this.heldObjects.forEach(obj => {
                if (this.setToPositionCustom) {
                    this.setToPositionCustom(obj, this)
                    
                }
                else
                {
                    obj.setTo(this)
                }

            })
            onDrag?.(this)
        }

        p.mousePressed = () => {

            if (this.inCanvas) {
                console.log('Press')
                this.draggedDistance = 0

                this.pressedPos.setTo(this)
                this.pressedTime = Date.now()

                // Find the closest object
                if (getObjects) {
                    let objs = getObjects()           
                    if (!Array.isArray(objs))
                        throw("'getObjects' must return an array!")
                    let obj = this.getClosest(objs)
                    this.heldObjects = [obj]
                }

                onPress?.(this)
            } else {
                console.log("not in canvas")
            }
        }

        p.mouseReleased = () => {
            if (this.inCanvas) {
                console.log("Released in canvas")
                // Was this a click or a drag?
                if (this.movedDistance < 10) {
                    console.log("click")
                }
                this.heldObjects = []
                this.movedDistance = 0
                this.releasedPos.setTo(this)
                this.releasedTime = Date.now()
                console.log("released", this.pressedPos.toFixed(2))

                onRelease?.(this)
                p.doubleClicked = onDblclick
            }
        }
    }

    updatePos() {
        let t = Date.now()
        let dt = t - this.lastUpdate
        this.setTo(this.p.mouseX, this.p.mouseY)
        this.d = this.getDistanceTo(this.lastPos)
        this.lastPos.setTo(this)
        this.lastUpdate = t
        this.speed = this.d/dt
    }

    get inCanvas() {
        return this.x >= 0 && this.y >= 0
        && this.x <= this.p.width && this.y <= this.p.height
    }

    getClosest(objs, range = 100) {
        if (!Array.isArray(objs))
            throw("Not an array")

        if (this.getClosestCustom)
            return this.getClosestCustom(objs)
        let minD = range
        let current = undefined
        for (var i = 0;i < objs.length; i++) {
            let obj = objs[i]
            let d = 0
            if (this.getDistanceToCustom)
                d = this.getDistanceToCustom(this, obj)
            else
                d = obj.getDistanceTo(this)  

            if (obj.radius)
                d -= obj.radius

            if (d < minD) {
                minD = d
                current = obj
            }
        }
        return current
    }

    isSelected(obj) {
        return this.selectedObjects.includes(obj)
    }

    isHolding(obj) {
        return this.heldObjects.includes(obj)
    }

    isOver(obj) {
        return this.overObjects.includes(obj)
    }


}


function objToInlineStyle(styleObj) {
	// FROM GPT
    // Define a mapping of style properties that should use HSL notation
    const hslProperties = ['background-color', 'color', 'border-color'];

    // Initialize the inline style string
    let inlineStyle = '';

    // Loop through the properties in the style object
    for (const property in styleObj) {
        if (styleObj.hasOwnProperty(property)) {
            const value = styleObj[property];

            // Check if the property should use HSL notation
            if (hslProperties.includes(property)) {
                if (Array.isArray(value) && value.length === 3) {
                    // Convert the array to an HSL color string
                    const hslColor = `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`;
                    inlineStyle += `${property}: ${hslColor}; `;
                }
            } else {
                // Use pixel units for other properties
                inlineStyle += `${property}: ${value}px; `;
            }
        }
    }

    return inlineStyle;
}


function map(x, y0, y1, z0, z1) {
    let pct = (x - y0)/(y1 - y0) 
    return pct*(z1-z0) + z0
}
