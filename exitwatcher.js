

let ewCount = 0


class ExitWatcher {
	constructor(role, exit, context) {
		// Watch this exit, from the perspective of this actor
		// "is it open *for me*?"
		this.role = role
		this.exit = exit
		this.context = context
		this.idNumber = ewCount++

		// Watch all the conditions
		console.log(this.exit)
		this.conditionWatchers = this.exit.conditions.map(cond => new ConditionWatcher(role, cond))
		
	}

	get isOpen() {
		return this.conditionWatchers.every(cw => cw.pct >= 1)
	}

	update() {

	}

	toString() {
		return `EW(${this.role})_${this.context.state}${this.context.index}` 
	}

}



let conditionCount = 0


class ConditionWatcher {
	constructor(role, condition) {
		// Watch this exit, from the perspective of this actor
		// Is it fulfilled yet?
		this.role = role
		this.condition = condition
		this.idNumber = conditionCount++
		console.log(this.condition)
	}

	get pct() {
		return constrain(.5 + .9*noise(this.role.time.t*.0001, this.idNumber), 0, 1)
	}

	get isFulfilled() {
		return this.pct >= 1
	}

	update() {
		console.log("Update condition watcher")
	}

	toString() {
		return `CW(${this.role})_${this.idNumber}` 
	}

}