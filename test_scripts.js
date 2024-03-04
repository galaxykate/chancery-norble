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
						
						cues: [
							"wait:5 -> goto garden",
							"beat:4,16 -> x+=1",
							"beat:8,20 -> y+=1",
							"y>4 play:none -> y=0 play:sleep",
							"say:'hi' wait:1 -> say:'hi' play:dance play:none"
						]
					},
					
				}
			}