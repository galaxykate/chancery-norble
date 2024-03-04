
class TestSystem {
	constructor() {
		
	}

	makeRandomActors(count=1) {
		let actors = []
		for (var i = 0; i < count; i++) {
			actors.push(new TestSystemActor(this))
		}
		return actors
	}


}




let actorCount = 0

/**
 * "anything can be an actor!"" (rataouille voice)
 * You just have to implement:
 * - getData(path)
 * - evaluateCondition(cond) => Promise
 * - performAction(cont) => Promise
 * - pass any relevant events to the role with input
 **/


class TestSystemActor {
	constructor(system) {
		this.idNumber = actorCount++
		this.data = {

		}

		this.roles = []
	}

	update() {
		// Check all our scripts and see what we need to do!
		this.roles.forEach(role => role.update())
	}

	startScript(script) {
		let instance = new ScriptInstance(script)
		let role = instance.join(this)
		this.roles.push(role)
	}

	
	toString() {
		return "A" + this.idNumber
	}

	generateRandomInput() {
		if (Math.random() < .01) {
			this.input({
				type: "rightclick",
			})
		}
		if (Math.random() < .01) {
			this.input({
				type: "leftclick",
			})
		}

		if (Math.random() < .01) {
			this.input({
				type: "input",
				text: "test"
			})
		}
	}

	input(ev) {
		this.roles.forEach(role => role.input(ev))
	}

	// required actor methods
	getData(path) {
		// TODO For now, single key path
		let t = Math.floor(Math.random()**2*1000)
		return Promise((resolve, reject) => {
			console.log(`o ${condition.uid} (${t}ms)`)
			setTimeout(() => {
				let val = Math.random()>.5?false:true
				console.log(`⍟ ${condition.uid}:${val}`)
				resolve(val)
			}, t)
			
		})
	}


	evaluateCondition(condition) {
		let t = Math.floor(Math.random()**2*1000)
		return Promise((resolve, reject) => {
			console.log(`? ${condition.uid} (${t}ms)`)
			setTimeout(() => {
				let val = Math.random()>.5?false:true
				console.log(`⍰ ${condition.uid}:${val}`)
				resolve(val)
			}, t)
			
		})
	}

	performAction(action) {
		let t = Math.floor(Math.random()**2*5000)
		return Promise((resolve, reject) => {
			console.log(`▷ ${condition.uid} (${t}ms)`)
			setTimeout(() => {
				let val = Math.random()>.5?false:true
				console.log(`▶ ${condition.uid}:${val}`)
				resolve(val)
			}, t)
			
		})
	}
}
