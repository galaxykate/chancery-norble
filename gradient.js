/**
 * Represent anything, colors, eg, as a gradient that we can sample
 **/

class Gradient {
	constructor() {
		this.steps = []

		for (var i = 0; i < 5; i++) {
			
			let pct = Math.random()
			let c = [Math.random()*360, 100, Math.random()*100]
			this.addStep(pct, c)
		}
	}

	addStep(pct,value) {
		this.steps.push({
			pct,
			value
		})
		this.update()
	}

	update() {
		this.steps.sort((a,b) => a.pct - b.pct)

	}

	getLowIndex(pct) {
		// console.log("Get low index", pct)
		for (var i = 0; i < this.steps.length; i++) {
			if (pct < this.steps[i].pct) {
				// console.log("Found under", pct, this.steps[i].pct, i - 1)

				return i - 1
			}
		}
		return this.steps.length - 1
	}

	getAtPct(pct, lerpFxn) {
		let i = this.getLowIndex(pct)
		if (i < 0) {
			// console.log("first", this.steps[0].value)
			return this.steps[0].value
		}
		if (i >= this.steps.length - 1) {
			// console.log("last", this.steps[this.steps.length - 1].value)
			return this.steps[this.steps.length - 1].value
		}

		// console.log(pct, i)
		let s0 = this.steps[i]
		let s1 = this.steps[i + 1]
		let range = s1.pct - s0.pct
		let stepPct = (pct - s0.pct)/range
		// console.log(pct, i, i+1, s0.pct, s1.pct, range, stepPct)
		// console.log(s0)
		// Otherwise lerp
		if (lerpFxn) {
			// console.log("custom fxn", s0.value, s1.value, stepPct)
			let val = lerpFxn(s0.value, s1.value, stepPct)
			// console.log(val)
			return val
		}

		if (isNaN(s0.value) || isNaN(s1.value))
			throw('Non-numeric steps on the gradient, you must provide a custom lerpFxn')

		// If numbers, lerp the numbers
		return s0.value + stepPct*range
	}	


}
