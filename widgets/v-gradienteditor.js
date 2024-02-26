/** 
 * Gradient editor
 * A nice Vue/p5 interface for editing gradients
 */ 

Vue.component("gradient-editor", {
	template: `<div class="widget gradient-editor" ref="holder">
		<div>
			
		</div>
		<div class="p5holder" ref="p5holder">
			<!-- where the gradient is drawn -->
		</div>
		<div v-if="draggableMouse">
		
		<color-picker 
			:style="pickerStyle(step)"
			v-for="step in gradient.steps"
			:value="step.value" 
			@change="val => changeColor(step,val)"
			 />
		</div>

		<div>


	</div>`,

	methods: {
		pickerStyle(step) {
			return {
				position: "absolute",
				left: step.pct*100 + "%"
			}
		} ,
		changeColor(step, val) {
			console.log("changeColor", step, val)
			Vue.set(step.value, 0, val[0])
			Vue.set(step.value, 1, val[1])
			Vue.set(step.value, 2, val[2])
		}	
	},
	mounted() {
		new p5((p) => {
			console.log("p5")
			p.setup = () => {
				let w = this.$refs.holder.offsetWidth
				p.createCanvas(w, 200)

				p.colorMode(p.HSL)
				p.background(190, 100, 50)
			}
			p.draw = () => {
				let count = 100
				let dw = p.width/count
				for (var i = 0; i < count; i ++) {
					let pct = i/count
					let color = this.gradient.getAtPct(pct, lerpColors)
					p.fill(...color)
					p.noStroke()
					p.rect(i*dw, 0, dw, p.height)


				}

				this.gradient.steps.forEach((step,index) => {
					let x = step.pct*p.width
					p.stroke(0)
					p.fill(...step.value)
					p.rect(x-2, 0, 4, p.height)
					p.fill(0)
					p.text(index, x + 5, 10)
				})

				let t = p.millis()*.001
				let animPct = t%1
				console.log("\n")

				let c = this.gradient.getAtPct(animPct, lerpColors)
				
				p.fill(...c)

				p.rect(0, 0, 40, 40)

			}

			this.draggableMouse = new DraggableP5Mouse(p, {
				onDrag: () =>  {

				},
				getObjects: () => {
					return this.gradient.steps
				},
				getDistanceTo(mouse, obj) {
					// console.log(mouse, obj)
					let dx = mouse.x - obj.pct*p.width
					return Math.abs(dx)
				},
				onRelease: () =>  {

				},
				onPress: () =>  {
					this.selectedStep = this.draggableMouse.overObjects[0]
				},
				onMove: () =>  {
					// console.log(draggableMouse.overObjects)
					// if (this.draggableMouse.overObjects)
						
				},
				setToPosition: (obj, mouse) => {
					obj.pct = mouse.x/p.width
					this.gradient.update()
					
				}
			})


		}, this.$refs.p5holder)
	},

	data() {
		return {
			draggableMouse: undefined,
			selectedStep: undefined
		}
	},

	props: {
		gradient: {
			type: Object, 
			default: function() {
				return new Gradient()
			}
		}
	}
})



