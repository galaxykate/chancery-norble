

window.onload = function(e) { 

	
	

	new Vue({
		template: `
		<div id="app"> 
			<header></header>
			<div class="columns">
				<div class="column">
					<actor-view v-for="actor in actors" :actor="actor" :key="actor.toString()" />
					<gradient-editor v-if="false" />
				</div>
				<div class="column">

				</div>


			</div>


			<footer></footer>
		</div>`,
		mounted() {
			setInterval(() => {
				this.actors.forEach(actor=> actor.update())
			})
		},
		computed: {
			
		},
		methods: {

		},



		watch: {
			
		},



		// Which element Vue controls
		data() {

			let actors = []
			let script = TEST_SCRIPT_1

			for (var i = 0; i < 4; i++) {
				actors.push(new Actor())
			}
			actors.forEach(a => a.start(script))
			let app = {
				
			}
			return {
				actors,
				script 
			}
			
			
		},


		el: "#app",

		
	})

	
}
