/** 
 * Curve editor
 * A nice Vue/p5 interface for dragable curve editing
 * 
 */ 

Vue.component("curve-editor", {
	template: `<div>
	<div ref="p5" />

		{{bezierNumbers.map(v =>v.toFixed(2))}}

		<div class="track" :style="trackStyle">
			<div :style="testStyle"></div>
		</div>
	</div>`,
	mounted() {



			// Create the P5 element
		new p5(p => {

			function inP5() {
				return p.mouseX >= 0 && p.mouseY >=0 && p.mouseX <= p.width && p.mouseY <= p.height
			}
				// We have a new "p" object representing the sketch

				// Save p to the Vue element, so we have access in other methods
			p.setup = () => {
					// Initialize time
				p.createCanvas(...this.dim)
				p.colorMode(p.HSL)
				p.ellipseMode(p.RADIUS)	

				this.x0 = this.border
				this.x1 = p.width-this.border
				this.y1 = this.border
				this.y0 = p.height-this.border

				this.curve.addPoint(this.x0, this.y0)
				this.curve.addPoint(this.x1, this.y1)
				// this.curve.addPoint(p.width*Math.random(), p.height*Math.random())
				// this.curve.addPoint(p.width*Math.random(), p.height*Math.random())
				// this.curve.addPoint(p.width*Math.random(), p.height*Math.random())
				// this.updateCurve()

				// Deactivate first and last
				this.first.cp0.isActive = false
				this.last.cp1.isActive = false
				
			}

			
			this.mouse = new DraggableP5Mouse(p, {
				getObjects: () => {
					return this.curve.allPoints
				},

				onDrag: (mouse) => {
					console.log("Dragged")

					this.first.x = this.x0
					this.last.x = this.x1
					// this.updateCurve()
				}
			})

			p.draw = () => {
				p.background(180, 100, 50)


				p.push()

				this.t = (p.millis()*.001)%1
				let pt0 = this.curve.points[0]
				let pt1 = this.curve.points[1]
				this.follower.setToCubicBezier(...pt0, ...pt0.cp1, ...pt1.cp0, ...pt1, this.t)
					
				// Draw the line
				p.noFill()
				p.beginShape()
				this.curve.drawVertices({p})
				p.endShape()


				let setStyle = ({p, pt}) => {
					let v = pt.remap(this.x0, this.x1, 0,1, this.y0, this.y1, 0, 1)

					p.fill(300, 0, 0)
					p.noStroke()
					
					p.text(v.map(v=>v.toFixed(2)), pt.x + 10, pt.y - 10)

					if (this.mouse.isHolding(pt)) {

						p.fill(300, 100, 90)
						p.circle(...pt, 20)

					}
					if (this.mouse.isOver(pt))
						p.fill(300, 100, 50)


				}

				this.curve.drawPoints({
					p,
					setStyle
				})

				this.curve.drawControlPoints({
					p,
					controlPointRadius: 3,
					setStyle
				})

				p.noFill()
				p.stroke(0)
				this.curve.drawControlPointEdges({
					p,
				})

				p.circle(...this.follower, 20)


				p.pop()
			}


		}, this.$refs.p5)
	},

	computed: {
		first() {
			return this.curve.points[0]
		},
		last() {
			return this.curve.points[this.curve.points.length - 1]
		},

		bezierNumbers() {
			if (this.first) {
				return [...this.first.cp1.remap(this.x0, this.x1, 0,1, this.y0, this.y1, 0, 1),
				...this.last.cp0.remap(this.x0, this.x1, 0,1, this.y0, this.y1, 0, 1)]
			}
			return []
			
		},

		testStyle() {
			let nums = this.bezierNumbers.map(v =>v.toFixed(2)).join(" ")

			let anim =  `slideRight 1s cubic-bezier(0.42, 0, 0.58, 1) infinite`
			console.log("Nums", nums, anim)
			return {
				position: "absolute",
				animation:anim,
				width: "30px",
				height: "30px",
				background: "purple"
			}
		},
		trackStyle() {
			return {
				position: "relative",
				
				width: "98%",
				height: "30px",
				border: "2px solid purple",
			}
		}
	},
	methods: {
		updateCurve() {
			this.curve.constrainPoints(this.x0, this.y0, this.x1, this.y1)
			// this.curve.constrainControlPoints()
			this.curve.sortHorizontally()
		},


	},

	data() {
		let border = 40
		return {
			t: 0,
			follower: new Vector2D(),
			border,

			x0: 0,
			x1: 0,
			y0: 0,
			y1: 0,
			mouse: undefined,
			held: undefined,
			selected: undefined,
			
			dim: [300,200],
			curve: new Curve()
		}
	}

})

Vue.component("envelope-editor", {
	template: `<div>
	ENVELOPE
	<curve-editor />

	</div>`,

	props: []
})