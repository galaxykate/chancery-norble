/** 
 * Chart a value over time
 */ 

Vue.component("value-graph", {
		template: `<div>
		VALUE
		<div ref="graph">

		</div>

		</div>`,
		mounted() {

			let myp5 = new p5((p) => {
				let x = 100;
				let y = 100;

				p.setup = () => {
					p.createCanvas(300, 300);
					p.colorMode(p.HSL)
				};

				p.draw = () => {
					p.background(0);

					p.fill(100)
					this.keys.forEach((key,index) => {
						p.text(key, index*10, index*30 + 30)
					})
					
				};	
			}, this.$refs.graph)
		},
		props: ["obj", "keys"],
		
	})