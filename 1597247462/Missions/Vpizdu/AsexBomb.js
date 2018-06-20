@ = function (zone, x, y)
{
	'''/Common/WeakPoint'''.call(this, zone, x, y, {
		Faction: "ISF", Health: 2, Z: +5,
		Sprite: new Sprite('''AsexBomb.png''', { N: 2, T: 0.01 })
	});
	
	this.BaseX = x;
	this.BaseY = y;
	
	this.WTime = 0;
	this.WvAmp = 32;
	this.WvLen = 2;
	
	this.Speed = 50 * Clock.Factor;
	this.Accel = 0.5 * Clock.Factor;
	
	this.FuckAbout = function ()
	{
		Box.PutAtY(this, this.BaseY + this.WvAmp * Math.sin(this.WvLen * this.WTime));
		
		this.WTime += Clock.Factor;
		
		if (this.Zone.Player.X >= this.L)
		{
			this.Homing = true;
		}
	}
	
	this.HomeIn = function ()
	{
		var npo = new Add ( this,
			new Norm (
				new Sub(this.Zone.Player, this),
				this.Speed += this.Accel
			)
		);
		
		Box.PutAtX(this, npo.X);
		Box.PutAtY(this, npo.Y);
	}
	
	this.Process = function ()
	{
		if (Rect.Intersect(this, this.Zone.Player))
		{
			this.Explode();
			this.Zone.Player.Hit(9000, 0, 0);
			return;
		}
		
		if (this.Homing) this.HomeIn();
		else this.FuckAbout();
	}
}
