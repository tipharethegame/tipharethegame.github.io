@ = function (zone, x, y)
{
	'''/Common/Lifeform'''.call(this);
	
	
	this.Zone = zone;
	this.Activated = false;
	this.Velocity = { X: 0, Y: 0 };
	this.Target = zone.Player;
	this.Z = 0.1;
	
	
	this.Health = 10;
	this.Speed = 200;
	
	
	this.Modes = {
		
		Idle: new Sprite('''Swine.Idle.png''', { OPY: -4 }),
		
		Run: {
			L: new Sprite('''Swine.png''', { N: 2, T: 0.1, V: true }),
			R: new Sprite('''Swine.png''', { N: 2, T: 0.1, V: true, FX: -1 }),
		}
	};
	
	
	this.UpdMode = function ()
	{
		if (this.Activated) {
			this.Sprite = this.Modes.Run[this.Velocity.X < 0 ? 'L' : 'R'];
		} else {
			this.Sprite = this.Modes.Idle;
		}
	}
	
	this.Direct = function ()
	{
		this.Velocity.X = this.Speed * Math.sign(this.Target.X - this.X);
	}
	
	
	this.Hit = function (d, vx, vy)
	{
		this.Health -= d;
	
		if (this.Health <= 0) this.BlowUp(5);
		else {
			'''Oink.ogg'''.Play();
			this.JustHit = true;
		}
		
		if (!this.Activated) this.Activate();
	}
	
	
	this.Activate = function ()
	{
		'''Oink.ogg'''.Play();
		this.Activated = true;
		this.Directing = new RTimer(0.5, 1);
		this.Direct();
	}
	
	
	this.Process = function (zone)
	{
		this.UpdMode();
		
		if (this.Activated) {
			
			if (
				this.Target.L < this.R &&
				this.Target.R > this.L
			) {
				this.Directing.Elapsed = 0;
			}
			
			if (this.Directing.Tick()) this.Direct();
			this.Walk();
			
		} else if (this.Target.X > this.X) this.Activate();
		
		if (Rect.Intersect(this.Target, this))
		{
			if (!this.Activated) this.Activate();
			this.Target.Hit(1, this.Velocity.X, this.Velocity.Y);
		}
	}
	
	this.Draw = function (zone)
	{
		zone.Draw (
			this.Sprite, this.X, this.Y,
			this.JustHit ? Raster.InverseShr : null
		);
		
		this.JustHit = false;
	}
	
	
	this.UpdMode();
	
	
	Box.FromXYWH.call(this, x, y, this.Sprite.W, this.Sprite.H);
	Box.PutAtB(this, y);
}
