// Do basic parsing

function parseCue(cue) {
	let [cond, action] = cue.split("->")
	
	return {
		conditions:parseExpression(cond),
		actions: parseExpression(action),
	}
}

// Break down a syntax tree
function parseExpression(exp) {
	// An expression is a bunch of operators 
	// 'beat' 'say' 'while' 'until' ',' "*" "+=" 'times'

	exp = exp.trim()
	let sections = exp.split(" ")
	
	sections.forEach(s => {
		console.log(s)
	})

	return sections.map(s => {
		if (s.includes(":")) {
			let [type,val] = s.split(":")
			return {
				type,
				val, 
			}
		} else {
			let sections2 = s.match(/(\w+|\W+)/g);
   			return {
   				type: "op",
   				lhs: sections2[0],
   				op: sections2[1],
   				rhs: sections2[2],
   			}
		}
	})

	return exp
}