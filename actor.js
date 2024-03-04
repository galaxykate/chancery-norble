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


let scriptCount = 0

class ScriptInstance {
	constructor(script, system) {
		// A system is any custom behavior
		// How do we subscribe to system events so that the script instance can receive them?
		this.idNumber = scriptCount++
		this.system = system
		this.data = {
	
		}

		this.roles = []
		this.script = script



		this.time = new HeartBeatTime({
			beatEvery: 100
		})


		// this.time.onHeartbeat(({beat, measure}) => {
		// 	if (beat % 6 == 0)
		// 		console.log("😁")
		// 	if (beat % 6 == 4)
		// 		console.log("🕳️")
		// 	if (beat % 6 == 1)
		// 		console.log("❤️")
		// })

		setInterval(() => {
			this.time.update()
		})
	}


	
	update() {
		let t = Date.now()*.001 - this.time.start
		this.time.dt = t - this.time.t
		this.time.t = t

		this.beat += 1

		let ts = this.script.timeSignature || 24
		if (this.beat >= ts) {
			this.beat %= ts
			this.measure
		}s


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
	/**
	 * The primary job of the ActorRole is to ask 
	 * "what should I do now"?
	 * 
	 * ...when there is new input
	 * ...should we move to a new state?
	 * ...should we update some values?
	 */ 

	constructor(actor, instance) {
		this.actor = actor
		this.instance = instance

		this.cueWatchers = []

		this.currentStateID = undefined

		this.stateHistory = []

		// Leading this instance?
		this.isLead = true

		this.data = {
			events: []
		}
		
		this.enterState("origin")
	}

	get eventsSinceStateChange() {
		let index = this.data.events.findLastIndex((ev) => ev.type == "stateChange")
		if (index <0)
			index = 0
		return this.data.events.slice(index)
	}

	get timeInState() {
		let tEntered = this.stateHistory[this.stateHistory.length - 1].timeEntered
		let t = this.instance.time.t
		return t - tEntered
	}
	get time() {
		return this.instance.time
	}

	get state() {
		return this.instance.script.states[this.currentStateID]
	}

	get activeWatchers() {
		let watchers = this.cueWatchers.filter(cue => cue.isActive)
		// Sort the active watchers so we take the highest priority
		watchers.sort((a, b) => a.priority - b.priority)
		return watchers
	}

	enterState(id) {
		this.currentStateID = id

		this.stateHistory.push({
			state: id,
			timeEntered: this.instance.time.t
		})

		console.log(`➡ ${this} enters ${id}`)

		// Set our exitWatchers
		// TODO, eventually remove dead ones and replace
		// For now, just make from scratch each time

		// Our available actions are these
		// TODO, CSS-style match lots of state classes, too
		// ie, #breakfast .meal
		this.availableCues = this.state.cues 

		// Watch all the cues
		this.cueWatchers = this.availableCues.map((cue,index) => {
			return new CueWatcher(this, cue)
		})

		console.log(this.cueWatchers )


	}

	input(ev) {	
		// What happens on input?
		this.data.events.push(ev)
	}


	update() {
		// What should we do?  
		// Options:
		// Start an action (something that will take some time to do)
		// Update some continuous values
		// Calculate a value on a gradient/envelope
		// We might have many of these? 
		// - beep, flash and increase jolliness by 5
		// - start or update recording audio
		// - "update jinglebells sound playback" 
		// - "update crackling fire animation" 
		// - "initialize saying 'merry christmas'" 
		//   - request GPT, then create voice and mouth animation
		// - exit to next scene



		// Update all our subprocesses
		// We have some built-in ones, like envelopes
		// this.subprocesses.update()

		// For exits, is it better to consider them a special type of action?
		// Like, have lots of actions in the state?
		// @click -> x += 1
		// @interval:5 -> y += 1
		// @heartbeat:5,10,15 -> z += 1
		// @input "hi" -> play beep and blink red then goto X


		if (this.activeExit) {
			// Continue taking this exit
			// Assume for right now that if we have an active exit, 
			// we can't take other actions (except for updating subprocesses)
			
		} else {

			// We aren't actively in an exit,  
			//  so do both normal state stuff, 
			//  and keep checking exits
			
			this.watchers.forEach(w => w.update())

		}
	
	

	}

	toString() {
		return this.actor + "_" + this.instance
	}

	doExpression(exp) {
		console.log("Do an expression", exp)
	}
}
