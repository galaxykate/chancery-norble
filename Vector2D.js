
class Vector2D {
	static polar(r, theta) {
		return new Vector2D(r*Math.cos(theta), r*Math.sin(theta))
	}

	static sub(pt0, pt1) {
		return new Vector2D(pt0.x - pt1.x, pt0.y - pt1.y)
	}

	static edgePoint(...args) {
		return new Vector2D().setToEdgePoint(...args)
	}

	static cubicBezier(x0, y0, x1, y1, x2, y2, x3, y3, t) {
		let x = Math.pow(1 - t, 3) * x0 +
            3 * Math.pow(1 - t, 2) * t * x1 +
            3 * (1 - t) * Math.pow(t, 2) * x2 +
            Math.pow(t, 3) * x3;
    let y = Math.pow(1 - t, 3) * y0 +
            3 * Math.pow(1 - t, 2) * t * y1 +
            3 * (1 - t) * Math.pow(t, 2) * y2 +
            Math.pow(t, 3) * y3;

    return { x, y };
	}

	static distance(v1, v2) {
    if (!(v1 instanceof Vector2D) || !(v2 instanceof Vector2D)) {
      throw new Error('Both parameters should be instances of Vector2D');
    }
    return Math.sqrt((v1.x - v2.x)**2 + (v1.y - v2.y)**2);
  }
  
  static addMultiple(...args) {
		return new Vector2D().addMultiple(...args)
	}
  
   
  static lerpVertex({p, v0, v1, pct=.5, n=0}) {
    if (Array.isArray(v0))
      v0 = {x:v0[0],y:v0[1]}
     if (Array.isArray(v1))
      v1 = {x:v1[0],y:v1[1]}
		let dx = v1.x - v0.x
		let dy = v1.y - v0.y
		let m = Math.sqrt(dx*dx + dy*dy)
		let x = v0.x + pct*dx + dy*n/m
		let y = v0.y + pct*dy + -dx*n/m

		p.vertex(x, y)
  }
 
 
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;

		if (x.x !== undefined) {
			// Ok, its a vector
			this.x = x.x
			this.y = x.y
		}

		// if (isNaN(this.x) || isNaN(this.y))  {
		// 	console.warn("NaN Vector contructed", this)
		// }
	}
	clone() {
		return new Vector2D(this.x, this.y);
	}


  // =========
	// Getters

	get angle() {
		return Math.atan2(this.y, this.x)
	}

	get magnitude() {
		return Math.sqrt(this.x ** 2 + this.y**2)
	}

	getDistanceTo(v) {
		let x = v.x
		let y = v.y
		if (Array.isArray(v)) {
			x = v[0]
			y = v[1]
		}
		return Math.sqrt((this.x-x)**2 + (this.y-y)**2)
	}

	getAngleTo(v) {
			let x = v.x
		let y = v.y
		if (Array.isArray(v)) {
			x = v[0]
			y = v[1]
		}
		return atan2(y- this.y, x - this.x)
	}

	getNormal() {
		let m = this.magnitude() || 1
		return new Vector2D(this.y/m, -this.x/m)
	}

	getClosest(pts, {getPosition, getRadius, range=20}={}) {
		let closest = undefined;
		let closestDistance = range;
		pts.forEach(pt => {
				let pos = getPosition?getPosition(pt):pt
				const radius = getRadius?getRadius(pt) :pt.radius || 0; // Default radius to 0 if not provided

				// Calculate the distance between the point and the particle
				const distance = Math.sqrt((this.x - pos.x) ** 2 + (this.y - pos.y) ** 2) - radius;

				// Update the closest particle if this particle is closer
				if (distance < closestDistance) {
					closestDistance = distance;
					closest = pt;
				}
			

		})
	
		return closest;
	}
	
	isWithin(x0, y0, x1, y1) {
		return this.x >= x0 && this.x <= x1 && this.y >= y0 && this.y <= y1
	}
	
	// =========
	// Setters


	setTo(...args) {
		if (!isNaN(args[0]) && !isNaN(args[1])) {
					this.x = args[0]
					this.y = args[1]
					return this
		}
    
   	if (typeof args[0] == "object" && !isNaN(args[0].x) && !isNaN(args[0].y)) {
				this.x = args[0].x
					this.y = args[0].y
			return this
		} 
    
    	
    	if (Array.isArray(args[0])&& !isNaN(args[0][0]) && !isNaN(args[0][1])) {
				this.x = args[0][0]
					this.y = args[0][1]
			return this
		} 
    
    
		console.warn("Incorrect args for 'setTo'", args)
		return this
	}

  
  
	setToAverage(pts) {
    if (pts.length > 0) {
      this.mult(0)
      pts.forEach(pt => this.add(pt))
      this.mult(1/pts.length)
    }
		return this
	}

  
	setToEdgePoint({pt0, pt1, v, pct=0, edgeOffset=0, normalOffset=0}) {
		// Set to a point on the edge, somewhere (pct) between pt0, and pt1, 
		// Or from pt0 along a vector v
		// it may be offset some distance with the normal (n) 
		// it may be offset some distance along the direction of the edge (m) 
		// console.log(this.magnitude)
		
		// No vector, just use the two endpoints
		if (!v)
			v = new Vector2D( pt1.x - pt0.x, pt1.y - pt0.y)

		let mag = v.magnitude || 1
		

		let ex = v.x/mag
		let ey = v.y/mag

		let nx = ey
		let ny = -ex

		this.x = pt0.x + v.x*pct + nx*normalOffset + ex*edgeOffset
		this.y = pt0.y + v.y*pct + ny*normalOffset + ey*edgeOffset
		return this
	}

	setToPolar(r, theta) {
		if (isNaN(r))
			console.warn(`Non-numerical r: ${r}`)
		if (isNaN(theta))
			console.warn(`Non-numerical theta: ${theta}`)
		this.x = r*Math.cos(theta)
		this.y = r*Math.sin(theta)
		return this
	}

	setToPolarOffset(v, r, theta) {
		if (isNaN(r))
			console.warn(`Non-numerical r: ${r}`)
		if (isNaN(theta))
			console.warn(`Non-numerical theta: ${theta}`)
		
		this.x = v.x + r*Math.cos(theta)
		this.y = v.y + r*Math.sin(theta)
		return this
	}

	setToLerp(v0, v1, pct) {

		this.x = v0.x*(1-pct) + v1.x*pct
		this.y = v0.y*(1-pct) + v1.y*pct

		return this
	}


	setToAddMultiple(...args) {
		this.mult(0)
		this.addMultiple(...args)
		return this
	}

	setToMultiple(m, v) {
		this.x = m*v.x
		this.y = m*v.y
		return this
	}

	setToAdd(...args) {
		this.mult(0)
		this.add(...args)

		return this
	}

	setToOffset(pt0, pt1) {
		this.x = pt1.x - pt0.x
		this.y = pt1.y - pt0.y
		return this
	}

	setToCubicBezier(x0, y0, x1, y1, x2, y2, x3, y3, t) {
		this.x = Math.pow(1 - t, 3) * x0 +
            3 * Math.pow(1 - t, 2) * t * x1 +
            3 * (1 - t) * Math.pow(t, 2) * x2 +
            Math.pow(t, 3) * x3;
    this.y = Math.pow(1 - t, 3) * y0 +
            3 * Math.pow(1 - t, 2) * t * y1 +
            3 * (1 - t) * Math.pow(t, 2) * y2 +
            Math.pow(t, 3) * y3;

    return this
	}

	remap(x0, x1, nx0, nx1, y0, y1, ny0, ny1) {
		
		let x = remap(this.x, x0, x1, nx0, nx1)
		let y = remap(this.y, y0, y1, ny0, ny1)
		return [x,y]
	}

	setToRemap(x0, x1, nx0, nx1, y0, y1, ny0, ny1) {
		return this.setTo(this.remap(x0, x1, nx0, nx1, y0, y1, ny0, ny1))
	}


	// =========
	// Adders/Multipliers

	constrainMagnitude(min, max) {
		let m = this.magnitude
		let m2 = Math.min(max, Math.max(min, m))

		// skip if mag 0
		if (m)
			this.mult(m2/m)
		return this
	}

	constrain(x0, y0, x1, y1) {
		this.x = Math.min(x1, Math.max(x0, this.x))
		this.y = Math.min(y1, Math.max(y0, this.y))
	}

	wrap(x0, y0, x1, y1) {
		// Off right
		if (this.x > x1)
			this.x = x0

		// Off left
		if (this.x < x0)
			this.x = x1

		// Off the bottom
		if (this.y > x1)
			this.y = y0

		// Off the top
		if (this.y < y0)
			this.y = y1
		return this
	}


lerpTo(pt, pct) {
		this.x = (1 - pct)*this.x + pct*pt.x
		this.y = (1 - pct)*this.y + pct*pt.y
		return this
	}

	normalize() {
		let m = this.magnitude || 1
		this.div(m)
		return this
	}

	div(m) {
		this.x /= m
		this.y /= m
		return this
	}


	mult(m) {
		this.x *= m
		this.y *= m
		return this
	}


	addPolar(r, theta) {
		this.x += r*Math.cos(theta)
		this.y += r*Math.sin(theta)
		return this
	}

	addNormal(v0, v1, n) {
		let m = Vector2D.distance(v0, v1)

		let dx = v1.x - v0.x
		let dy = v1.y - v0.y
		this.x += -n*dy / m
		this.y += n*dx / m

			
		return this
	}

	getRibbonAngle(prev, next) {
		// Get the smooth-ish angle between this and two points on either side
	
	
		
		let v = {x:0,y:0}
		if (prev) {
				let dx0 = this.x - prev.x
		let dy0 = this.y - prev.y
			let m0 = Math.sqrt(dx0**2 + dy0**2)
		v.x += dx0/m0
			v.y += dy0/m0
		}
		if (next) {
				let dx1 = next.x - this.x
		let dy1 = next.y - this.y
		let m1 = Math.sqrt(dx1**2 + dy1**2)
	v.x += dx1/m1
			v.y += dy1/m1
		}

		return Math.atan2(v.y, v.x)

	}


	addMultiple(...args) {

		// Takes alternating params of Vector2D (or anything with x,y) and scalars

		// Ensure we have an even number of arguments
		if (args.length % 2 !== 0) {
			throw new Error("Expecting an even number of arguments. Pairs of Vector2D (or similar) and scalars are required.");
		}
		
		for (let i = 0; i < args.length/2; i++) {
			// Expecting a Point instance at even indices
			let v = args[i*2]
			let m = args[i*2 + 1]

			 // Check if the vector has x and y properties
			if (typeof v.x !== 'number' || typeof v.y !== 'number') {
				console.warn(v)
				throw new Error(`Expecting an object with x and y properties at index ${i * 2}.`);
			}

			// Check if the scalar is a number
			if (typeof m !== 'number') {

				throw new Error(`Expecting a number at index ${i * 2 + 1}. Got ${typeof m}`);
			}


			this.x += m*v.x;
			this.y += m*v.y;
		} 
		return this
	}


	addOffsetByMagnitude(v0, v1, fxn) {
		let x = v1.x - v0.x
		let y = v1.y - v0.y
		let m = Math.sqrt(x*x + y*y)

		let m2 = fxn(m, x, y)
		this.x += x*m2
    this.y += y*m2
    return this
	}
  

	offset(x, y) {
		this.x += x
    this.y += y
    return this
	}
  
	add(...points) {
		// Takes parameters of Vector2D (or anything with x,y)
		for (const point of points) {
			this.x  += point.x;
			this.y  += point.y;
		}

	
		return this
	}

	sub(...points) {
		// Takes parameters of Vector2D (or anything with x,y)
		for (const point of points) {
			this.x -= point.x;
			this.y -= point.y;
		}

	
		return this
	}

	// =========
	// Draw

	draw(p, radius=10) {
		p.circle(...this, radius)
	}

	drawArrow(p, {v, multiplyLength=1, normalOffset=0,  startOffset=0, endOffset=0, color}) {
		
		// Make points
		let start = Vector2D.edgePoint({pt0:this, v, pct: 0, normalOffset, edgeOffset: startOffset})
		let end = Vector2D.edgePoint({pt0:this, v, pct: multiplyLength, normalOffset, edgeOffset: endOffset})
		
		// Draw the line
		if (color)
			p.stroke(...color)

		p.line(...start, ...end)

		p.noStroke()
		if (color) 
			p.fill(...color)

		// Draw the arrowhead
		p.push()
		p.translate(...end)
		p.rotate(v.angle)
		let d = 10
		let w = 4
		p.quad(0,0, 
			-d, w, 
			-d*.6, 0, 
			-d, -w)
		
		// p.translate(v)
		p.pop()

	}

	// Vertices 
	vertex(p) {
		p.vertex(...this)
	}

	polarOffsetVertex(p, r, theta) {
		p.vertex(this.x + r*Math.cos(theta), this.y+ r*Math.sin(theta))
	}
		polarOffsetCurveVertex(p, r, theta) {
		p.curveVertex(this.x + r*Math.cos(theta), this.y+ r*Math.sin(theta))
	}


		polarOffsetCircle(p, r, theta, radius) {
		p.circle(this.x + r*Math.cos(theta), this.y+ r*Math.sin(theta), radius)
	}

	//============
	//Output

	toArray() {
		return [this.x, this.y]
	}

	toFixed(n=3) {
		return `[${this.x.toFixed(n)}, ${this.y.toFixed(n)}]`
	}
 

	// From chatGPT: make it iterable/spreadable
	[Symbol.iterator]() {
		let index = 0;
		const properties = [this.x, this.y];

		return {
			next: () => {
				if (index < properties.length) {
					return { value: properties[index++], done: false };
				} else {
					return { done: true };
				}
			}
		};
	}
}
