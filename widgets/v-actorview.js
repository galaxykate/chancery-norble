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

Vue.component("condition-watcher", {
	template: `<div class="widget condition-watcher" ref="holder" :class="{fulfilled:cw.isFulfilled}">
		<div>
			{{cw}}	
			<div>{{cw.fulfilled}}</div>
			<div>{{cw.pct}}</div>

			<pct-clock :pct="cw.pct" />
		</div>
	</div>`,
	props: {
		cw: {
			required: true,
		}
	}
})
Vue.component("exit-watcher", {
	template: `<div class="widget exit-watcher" ref="holder">

		<div>
			<condition-watcher v-for="cw in ew.conditionWatchers" :cw="cw" :key="cw.toString()"/>
				
				
		</div>
	</div>`,
	props: {
		ew: {
			required: true,
		}
	}
})

Vue.component("actor-view", {
	template: `<div class="widget actor-view" ref="holder">
		ACTOR {{actor}}
		<div v-for="role in actor.roles" class="widget">
			<div>{{role}}:{{role.currentStateID}}</div>

			<div>
				<exit-watcher v-for="ew in role.exitWatchers" :ew="ew" :key="ew.toString()"/>
				
				
			</div>
		</div>

	</div>`,
	props: {
		actor: {
			required: true,
		}
	}
})