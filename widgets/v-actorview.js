
Vue.component("condition-watcher", {
	template: `<div class="widget condition-watcher" ref="holder">
		<div>
			CW{{watcher.condition}}
			
			<pct-clock :pct="watcher.pct"  v-if="app.showProgressAnimations" />
		</div>
	</div>`,
	props: {
		app: {
			type: Object
		},
		watcher: {
			required: true,
		}
	}
})
Vue.component("cue-watcher", {
	template: `<div class="widget cue-watcher" 
			ref="holder" 
			
		>
			<div class="section conditions">
				CONDITIONS: {{watcher.conditionWatchers.length}}

				<condition-watcher 
					v-for="cw in watcher.conditionWatchers" 
					:watcher="cw" :app="app" :key="cw.toString()" />
			</div>

			<div class="section conditions">ACTIONS</div>
		<div>	
			
				
				
		</div>
	</div>`,
	props: {
		app: {
			type: Object
		},
		watcher: {
			required: true,
		}
	}
})


Vue.component("actor-view", {
	template: `<div class="widget actor-view" ref="holder">
		ACTOR {{actor}}
		<div v-for="role in actor.roles" class="widget">
			<button @click="role.instance.time.togglePause()">PAUSE</button>
			
			<data-table v-if="false" objKey="time" :obj="role.instance" />
			<div>{{role}}:{{role.currentStateID}}</div>
			<event-chip v-for="ev in role.eventsSinceStateChange.slice(-3)" :ev="ev" />
			
			<div>

				<cue-watcher 
					v-for="watcher in role.cueWatchers" 
						:watcher="watcher" 
						:app="app" 
						:key="watcher.toString()"
					/>
				
				
				
			</div>
		</div>

	</div>`,
	props: {
		app: {
			type: Object
		},
		actor: {
			required: true,
		}
	}
})