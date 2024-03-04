

Vue.component("data-table", {
	template: `

	<div v-if="Array.isArray(val)" :class="classes" >
		ARRAY
	</div>
	
	<div v-else-if="typeof val === 'object'" :class="classes" >
		<table>
			<tr v-for="(propVal, propKey) in val">
				<td>{{propKey}}</td>
				<td><data-table :objKey="propKey" :obj="val" /></td>
			</tr>
		</table>
	</div>

	<span v-else >{{val}}</span>`,
	computed: {
		val() {
			return this.obj[this.objKey]
		},
		classes() {
			let classes = {
				
			}
			
			return classes
		}
	},
	props: ["objKey", "obj"]
})


Vue.component("event-chip", {
	template: `<div  :class="classes">
		<span v-if="ev.text">{{ev.text}}</span>
	</div>`,
	computed: {
		classes() {
			let classes = {
				chip:"true",
				"event-chip":"true",
			}
			classes["event-chip-" + this.ev.type] = true 
			return classes
		}
	},
	props: ["ev"]
})

Vue.component("toggle-button", {
	template: `<button class="toggle-button" @click="toggle" :class="{'active':active}">
	{{label}}
	</button>`,

	methods: {
		toggle() {
			this.active = !this.active
			this.$emit('input', this.active)
		}
	},
	data() {
		return {
			active: this.value
		}
	},

	props: ["value","label"],


})


Vue.component("pct-clock", {
	template: `<div class="clock" :style="style">
	</div>`,
	computed: {
		style() {
			if (this.mode === "clock") {


				let angle = this.pct*360

				return {
					width: this.size + "px",
					height: this.size + "px",
					"border-radius": "50%",
					"background-image": `conic-gradient(from 0deg at 50% 50%, 
						${this.bgColor} 0deg, 
						${this.bgColor} ${angle}deg, 
						${this.fillColor} ${angle}deg, 
						${this.fillColor})`
				}
			} else {
				let pctVal = (this.pct*100).toFixed(1) + "%"
				return {
					width: this.width + "px",
					height: this.size + "px",
					"border-radius": "5px",
					"background-image": `linear-gradient(to right, 
						${this.bgColor} ${pctVal}, 
						${this.fillColor} ${pctVal})`
				}
			}
		}
	},
	props: {
		width: {
			default: 120,
		},
		size: {
			default: 20,
		},
		mode: {
			default: "bar",
		},
		pct: {
			required:true,

		},
		bgColor: {
			default: "lightblue",
		},
		fillColor: {
			default: "black",
		}
	}
})
