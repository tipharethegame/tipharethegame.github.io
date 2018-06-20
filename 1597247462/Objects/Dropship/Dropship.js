@ = function (zone, x, y, ini)
{
	this.Zone = zone;
	this.DirX = Init(ini, 'DirX', -1);
	this.Sprite = new Sprite (this.DirX < 0 ? '''L.png''' : '''R.png''');
	this.ExSprite = new Sprite ('''Exhaust.png''', { N: 3, T: 0.1, PY: 0 });
	this.Evac = Init(ini, 'Evac', null);
	
	this.Exhausts = [
		this.DirX < 0 ? { X: 128, Y: 96 } : { X: 216, Y: 96 },
		this.DirX < 0 ? { X: 312, Y: 56 } : { X: 32, Y: 56 }
	];
	
	Box.FromXYWH.call(this, x, y, this.Sprite.W, this.Sprite.H);
	
	this.Flyaway = 0;
	this.Velocity = Init(ini, 'Velocity', { X: 0, Y: 32 });
	
	if (this.Evac)
	{
		this.Process = function ()
		{
			this.Velocity = {
				X: (this.Evac.X - this.X) * 0.25,
				Y: (this.Evac.Y - this.Y) * 0.25
			};
		
			Box.PutAtX(this, this.X + this.Velocity.X * Clock.Factor);
			Box.PutAtY(this, this.Y + this.Velocity.Y * Clock.Factor);
		}
	}
	else this.Process = function ()
	{
		if (this.B < 0) this.Gone = true;
		
		this.Flyaway += Clock.Factor;
		
		this.Velocity.X -= (this.Flyaway * this.Flyaway);
		this.Velocity.Y -= (this.Flyaway * this.Flyaway);
		
		Box.PutAtX(this, this.X + this.Velocity.X * Clock.Factor);
		Box.PutAtY(this, this.Y + this.Velocity.Y * Clock.Factor);
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Sprite, Math.floor(this.X), Math.floor(this.Y));
		
		for (var ei in this.Exhausts)
		{
			var e = this.Exhausts[ei];
			
			var x = Math.floor(this.L + e.X);
			var y = Math.floor(this.T + e.Y);
			
			this.Zone.Draw(this.ExSprite, x, y);
		}
	}
	
	if (this.Evac) '''Evac.ogg'''.Play();
	else '''Drop.ogg'''.Play();
}
