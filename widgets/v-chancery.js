/**
 * watch many actors at the same time
 **/
Vue.component("chancery-sim-view", {
	template: `<div>
		<div class="controls">
			<button class="emoji-button" @click="app.paused=!app.paused">{{app.paused?"▶️":"⏸️"}}</button>
			<toggle-button :obj="app" objKey="showProgressAnimations" label="showProgressAnimations"/>
		</div>

		<div class="actors">
			<actor-view 
				v-for="actor in actors" 
				:actor="actor" 
				:key="actor.toString()" 
				:app="app" 
				/>
		</div>
	</div>`,
	mounted() {

		
		// Give everyone some scripts and let'em go
		let script = TEST_SCRIPT_1
		this.actors.forEach(a => {
			a.startScript(script)
			setInterval(() => {
				if (!this.app.paused) {
					// Actor gets some random input
					a.generateRandomInput()
					a.update()
				}
			})
		})
			

	
	},

	data() {
		let app = {
			selected: undefined,

			showProgressAnimations: false,
			paused: true
			,
		}
		return {
			
			app,
			
		}
	},
	props: {


		actors: {
			// required: true,
			type: Array,
			default() {
				// Create some actors 
				let system = new TestSystem()
				return system.makeRandomActors()
			},
		}
	}
	
})
