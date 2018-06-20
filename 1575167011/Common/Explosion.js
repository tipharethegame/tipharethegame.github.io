@ = function (tgt, n, delay)
{
	if (!n) n = 1;
	this.Z = tgt.Z;
	
	this.Boom = function (x, y)
	{
		this.Sprite = new Sprite ('''Boom.png''', { N: 4, T: 0.1 });
		
		this.X = x;
		this.Y = y;
	}
	
	this.Booms = [ new this.Boom(tgt.X, tgt.Y) ];
	
	for (var i = 1, d = delay; i < n; i++, d += delay)
	{
		Delay(this, d, function () {
			this.Booms.push( new this.Boom (
				tgt.L + Math.random() * tgt.W,
				tgt.T + Math.random() * tgt.H
			) );
			'''/Common/Kaboom.ogg'''.Play();
		});
	}
	
	this.Process = function ()
	{
		if (this.Booms[this.Booms.length - 1].Sprite.Repeat)
		{
			this.Gone = true;
		}
	}
	
	this.Draw = function ()
	{
		for (var i = 0; i < this.Booms.length; i++)
		{
			var b = this.Booms[i];
			
			if (b.Sprite.Repeat) continue;
			tgt.Zone.Draw(b.Sprite, b.X, b.Y);
		}
	}
	
	'''Boom.ogg'''.Play();
}
