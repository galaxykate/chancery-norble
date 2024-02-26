/** 
 * An Actor is a semi-independent agent, making their own choices
 * They have their own data, access to other actors
 * and many scripts that they may be holding
 * 
 * An actor can be running quite a few scripts simultaneously!
 * 
 * Each of their scripts has its own instance, 
 * ...but if you put many actors in the same script 
 *    instance they can share data
 * 
 * How does the actor know when to do stuff or move between script steps?
 * Is it directed by a heartbeat of the script?
 **/

let actorCount = 0

class Actor {
	constructor() {
		this.idNumber = actorCount++
		this.data = {}

		this.roles = []
	}

	update() {
		// Check all our scripts and see what we need to do!
		this.roles.forEach(role => role.update())
	}

	start(script) {
		let instance = new ScriptInstance(script)
		let role = instance.join(this)
		this.roles.push(role)
	}

	toString() {
		return "A" + this.idNumber
	}
}

let scriptCount = 0

class ScriptInstance {
	constructor(script) {
		this.idNumber = scriptCount++
		this.data = {}

		this.roles = []
		this.script = script

		this.time = {
			t: 0,
			start: Date.now(),
			dt: 0,
		}
	}

	update() {
		let t = Date.now() - this.time.start
		this.time.dt = t - this.time.t
		this.time.t = t
	}

	join(actor) {
		// Get a role in this production
		let role = new ActorRole(actor, this)	
		this.roles.push(role)
		return role
	}

	toString() {
		return "SI" + this.idNumber
	}


}


class ActorRole {
	constructor(actor, instance) {
		this.actor = actor
		this.instance = instance

		this.exitWatchers = []
		this.currentStateID = undefined
		this.enterState("origin")


		this.isLead = true
	}

	get time() {
		return this.instance.time
	}

	get state() {
		return this.instance.script.states[this.currentStateID]
	}

	enterState(id) {
		this.currentStateID = id
		console.log(`${this} enters ${id}`)

		// Set our exitWatchers
		// TODO, eventually remove dead ones and replace
		// For now, just make from scratch each time
		this.exitWatchers = this.state.exits.map((exit,index) => {
			return new ExitWatcher(this, exit, {state:id, index})
		})

	}

	update() {
		if (this.isLead)
			this.instance.update()
		
		// // Check exits
		// this.exitWatchers.forEach(ew => ew.update())

		// // Do any continuous stuff in this state

		// this.activeExpressions.forEach(exp => {
		// 	this.doExpression()
		// })


	}

	toString() {
		return this.actor + "_" + this.instance
	}

	doExpression(exp) {
		console.log("Do an expression", exp)
	}
}
