Wazomaker

fast direct interaction
respond to continuous with curves



Action match:
How do I watch for different kinds of actions?
How do I know that right-ear-click is different than left-ear-click, but still a click?

Each system has its own set of actions
Some have names, types, indexes, 
Wazo: leftear rightear, press, release, click
Midi slider: key0, key1, ...

event: {
	device: panasonicmidi112,
	instance: myMidi2,
	action: change,
	type: slider,
	index: 1,
	value: 10,
	speed: 10
}

so "event:slider ->x" "event(myMidi2, slider, change, value>10) then event(slider, value<8) ->x"