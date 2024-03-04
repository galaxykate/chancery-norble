

window.onload = function(e) { 

	
	

	new Vue({
		template: `
		<div id="app"> 
			<header></header>
			<div class="columns">
				<div class="column">
					<chancery-sim-view />
					<gradient-editor v-if="false" />
				</div>
				<div class="column">
				</div>
			</div>

			<footer></footer>
		</div>`,
		mounted() {
			
		},
		el: "#app",

		
	})

	
}
