

// JSON state machine that is watched by some pointers
// Pointers will move from state to state, with good and effortless timing

class Pointer {
	constructor({id, map, startStateID="origin"}) {
		this.id = id || Math.floor(Math.random()*10000)
		this.map = map
		this.stateID = startStateID

		// All current available exits
		this.exits = []

		// All actions (stuff that takes time) happening to this pointer
		// ...Maybe this is a mixin? Lots of things may have actions
		//  (eg, animation or sound system)
		// We need to know about them because sometimes 
		// we only want to do X after Y action is finished
		// e.g, 'play sound and move to next state immediately'
		//   vs 'play sound and move to next state when sound has finished'
		this.actions = []

		// Personal data object for this pointer
		this.data = {}


	}

	start() {
		console.log(`Start ${this}`)
		this.enterState(this.stateID)
	}

	get state() {
		return this.map.states[this.stateID]
	}
}

class ExitWatcher {
	constructor({pointer, exit}) {
		// Watch this exit for the current pointer (or for everyone?)
	}
}


