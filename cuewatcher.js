

let cueCount = 0


class CueWatcher {
	// An cue has conditions that it happens under, 
	// and probably a big set of subactions to do

	constructor(role, cue) {

		// Try parsing the action
		cue = parseCue(cue)


		// Watch this exit, from the perspective of this actor
		// "is it open *for me*?"
		this.role = role
		this.cue = cue
		this.idNumber = cueCount++


		console.log("cue", cue)
		this.conditionWatchers = this.cue.conditions.map(condition => new ConditionWatcher(this.role, condition))

	}

	get isOpen() {
		return false
	}

	update() {

	}

	activate() {
		console.log("Thats my cue!", this.cue)
	}

	isFinished() {
		return true
	}

	toString() {
		return `CW(${this.role}${this.idNumber})` 
	}

}




class ConditionWatcher {

	/**
	 * Built in conditions:
	 * Wait, 
	 * Expression,
	 * Inputs/properties (possibly these are expressions - "leftbutton and shift")
	 **/

	constructor(role, condition) {
		// Watch this exit, from the perspective of this actor
		// Is it fulfilled yet?
		this.role = role
		this.condition = condition
		this.idNumber = cueCount++
	}

	get system() {
		return this.role.system
	}

	get pct() {
		// This is the hard one: how fulfilled is this condition?
		// Needs to handle all kinds of things 
		// (variable buckets getting filled, timers, custom stuff)
		// or even chains "click then wait:5"
		switch (this.condition.type) {
		case "wait": 
			// console.log(this.role.timeInState, this.condition.value)
			return constrain(this.role.timeInState/this.condition.value, 0, 1)

		case "event":
			let events = this.role.eventsSinceStateChange
			let index = events.findIndex((ev) => {
				// What index do we match?
				if (this.system && this.system.isEventMatch) {
					return this.system.isEventMatch(this.condition, ev)
				}
				else {
					// TODO - more sensitive event matching
					return true
				}
			})
			if (index >=0)
				return 1
			return 0
	
		case "expression": 
			return .2
	
		}


		return constrain(.5 + .9*noise(this.role.time.t*.0001, this.idNumber), 0, 1)
	}

	get isFulfilled() {
		// How can we tell if custom conditions are fulfilled?
		// Where does the custom behavior live?
		return this.pct >= 1
	}

	update() {
		console.log("Update condition watcher")
	}

	toString() {
		return `CW(${this.role})_${this.idNumber}` 
	}

}