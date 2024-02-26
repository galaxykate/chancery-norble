const TEST_SCRIPT_1 ={
				data: {
					year: 0,
					grass: 0,
					snow: 0,
				},
				states: {
					origin: {
						onEnterSay: "Hello",
						onExitSay: "Leaving",
						
						exits: [{
							conditions: [{
								type: "wait",
								value: 2
							}],
							goto:"summer",
							actions: {
								anim: "fire",
								length: 1
							}
						}]
					},
					summer: {
						onEnterSay: "🌷",
						onEnter: "grass=0",
						whileHere: ["grass+=1", "say(grass*'🌱')"],
						exits: [{
							conditions: [{
								type: "wait",
								value: 4
							}],
							goto:"winter",
							actions: {
								anim: "snow",
								length: 1
							}
						}]
					},
					winter: {
						onEnterSay: "☃️",
						whileHere: ["snow+=1", "say(snow*'❄')"],
						exits: [{
							conditions: {
								type: "wait",
								value: 4
							},
							goto:"summer",
							actions: ["year += 1", "snow = 0",{
								anim: "grass",
								length: 1
							}],
						}]
					},
				}
			}