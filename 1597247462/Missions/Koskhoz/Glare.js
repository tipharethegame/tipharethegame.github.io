@ = function (w, h, m)
{
	'''Map'''.call(this, w, h, m);
	
	for (let y = 0, i = 0; y < this.H; ++y)
	{
		for (let x = 0; x < this.W; ++x, ++i)
		{
			let ax = 1 / this.W * x - 0.5;
			let ay = 1 / this.H * y - 0.5;
			
			let a = 1 - Math.sqrt(ax * ax + ay * ay) * 2;
			this.RawPixels[i] = a > 1 ? 1 : a < 0 ? 0 : a * a * this.M;
		}
	}
}
