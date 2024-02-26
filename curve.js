class CurveControlPoint extends Vector2D {
	constructor(pt, side, mate) {

		super(0,0)
		console.log("New control pt", pt)
		this.pt = pt
		this.side = side
		this.r = 20
		this.theta = Math.random()*100

		// Use this if we need to calculate from the mate
		this.mate = mate

		this.isActive = true

	}

	get x() {
		let theta = this.theta
		let r = this.r
		return this.pt.x + r*Math.cos(theta)
	}

	get y() {
		let theta = this.theta
		let r = this.r
		return this.pt.y + r*Math.sin(theta)
	}

	setTo(...args) {
		console.log("ARGS", args)
		let x = args[0]
		let y = args[1]

		console.log(typeof args[0])
   		if (typeof args[0] == "object" && !isNaN(args[0].x) && !isNaN(args[0].y)) {
   			console.log("OBJ")
				x = args[0].x
				y = args[0].y
		} 
    
    	if (Array.isArray(args[0])&& !isNaN(args[0][0]) && !isNaN(args[0][1])) {
				x = args[0][0]
				y = args[0][1]
		} 
    
    	console.log(x, y)

		console.log("Set control point")
		// If I move this x here, what is my new r and theta
		let dx = x - this.pt.x
		let dy = y - this.pt.y
		this.theta = Math.atan2(dy, dx)
		this.r = Math.sqrt(dx*dx + dy*dy)

		this.pt.onMoveCP(this)
	}

	// Can't set x y directly
	set x(x) {}
	set y(y) {}

	toString() {
		return this.pt.idNumber + "_CP" + this.side
	}

}

let pointCount = 0

class CurvePoint extends Vector2D {
	constructor(curve, x, y) {
		super(x, y)
		this.curve = curve
		this.cp0 = new CurveControlPoint(this)
		this.cp1 = new CurveControlPoint(this, this.cp0)

		this.smooth = true
		this.idNumber = pointCount++
		
	}

	// Update the other if its smooth
	onMoveCP(cp) {
		if (this.smooth) {
			let cpX = cp==this.cp1?this.cp0:this.cp1
			console.log(cp, cpX)
			cpX.theta = cp.theta + Math.PI
		}
		
	}

	drawControlPoints(p) {
		p.fill(190, 100, 50)
		p.line(...this, ...this.cp0)
		p.circle(...this.cp0, 5)

		p.line(...this, ...this.cp1)
		p.circle(...this.cp1, 5)
	}

	toString() {
		return "PT" + this.pt.idNumber
	}
}

class Curve {
	
	constructor() {
		this.points = []
	}

	addPoint(x, y) {
		let pt = new CurvePoint(this, x, y)
		pt.index = this.points.length
		this.points.push(pt)
	}

	getClosest(x,y, range=100) {
		let closest = undefined
		let closestDist = range
		this.points.forEach(pt => {
			let d = pt.getDistanceTo([x,y])
			if (d < closestDist) {
				closestDist = d
				closest = pt
			} 
		})
		return closest
	}

	get allPoints() {
		let pts = this.points.slice()
		this.points.forEach(pt => {
			if (pt.cp0.isActive) 
				pts.push(pt.cp0)
			if (pt.cp1.isActive) 
				pts.push(pt.cp1)
		})
		return pts
	}

	sortHorizontally() {
		this.points.sort((a, b) =>  a.x - b.x)
	}


	constrainAll(x0, y0,x1,  y1) {
		this.allPoints.forEach(pt => pt.constrain(x0, y0,x1,  y1))
	}

	constrainPoints(x0, y0,x1,  y1) {
		this.points.forEach(pt => pt.constrain(x0, y0,x1,  y1))
	}

	
	
	drawControlPointEdges({p, setStyle}) {
		// Draw control points's edges
		for (var i = 0; i< this.points.length; i++) {
			let pt = this.points[i]
			if (pt.cp0.isActive) {
				setStyle?.({p, pt:pt.cp0, index:i})
				p.line(...pt.cp0,  ...pt)
			}
			if (pt.cp1.isActive) {
				setStyle?.({p, pt:pt.cp1, index:i})
				p.line(...pt.cp1, ...pt)
			}
		}
	}

	drawControlPoints({p, setStyle, controlPointRadius=5}) {
		// Draw control points
		for (var i = 0; i< this.points.length; i++) {
			let pt = this.points[i]
			if (pt.cp0.isActive) {
				setStyle?.({p, pt:pt.cp0, index:i})
				p.circle(...pt.cp0, controlPointRadius)
			}
			if (pt.cp1.isActive) {
				setStyle?.({p, pt:pt.cp1, index:i})
				p.circle(...pt.cp1, controlPointRadius)
			}
		}
	}

	drawPoints({p, setStyle, pointRadius=5}) {
		// Draw control points
		for (var i = 0; i< this.points.length; i++) {
			let pt = this.points[i]
			setStyle?.({p, pt, index:i})
			p.circle(...pt, pointRadius)
		}
	}


	drawVertices({p}) {
		p.vertex(...this.points[0])
		for (var i = 1; i< this.points.length; i++) {
			let p0 = this.points[i-1]
			let p1 = this.points[i]

			p.bezierVertex(...p0.cp1, ...p1.cp0, ...p1)
		
		}
	}

	
}