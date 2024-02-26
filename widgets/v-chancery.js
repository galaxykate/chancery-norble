
	Vue.component("pointer-view", {
		template: `<div>
			POINTER

			State:{{pointer.stateID}}
			<div>
			DATA
			</div>
			<div>
			EXITS
			</div>

			<div>
			ACTIONS
			</div>
		</div>`,
		mounted() {

		},
		props: ["pointer"],
		
	})

		Vue.component("exitwatcher-view", {
		template: `<div>
			EXIT
		</div>`,
		mounted() {

		},
		props: ["pointer"],
		
	})