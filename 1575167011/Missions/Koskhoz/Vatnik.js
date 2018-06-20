@ = function (zone, x, y)
{
	'''/Common/Lifeform'''.call(this);
	
	this.Speed = 80;
	
	this.Zone = zone;
	this.Heading = { X: -1, Y: 0 };
	this.Velocity = { X: 0, Y: 0 };
	this.Target = zone.Player;
	this.Damage = 1;
	this.Z = 0.01;
	
	this.Modes = {
		
		Walk: {
			L: new Sprite('''Vatnik.png''', { N: 4, T: 0.1 }),
			R: new Sprite('''Vatnik.png''', { N: 4, T: 0.1, FX: -1 }),
		},
		
		Throw: {
			L: new Sprite('''Vatnik.Ziga.png'''),
			R: new Sprite('''Vatnik.Ziga.png''', { FX: -1 }),
		},
		
	};
	
	this.Hit = function (d, vx, vy)
	{
		this.BlowUp();
	}
	
	this.SetDirection = function ()
	{
		this.Heading.X = Math.sign(this.Target.X - this.X);
		this.Velocity.X = this.Speed * this.Heading.X;
	}
	
	this.Process = function (zone)
	{
		if (Rect.Intersect(this, this.Target))
		{
			this.Target.Hit(this.Damage, this.Velocity.X, this.Velocity.Y);
		}
		
		if (this.ThrowPause)
		{
			if (this.ThrowPause.Tick()) this.ThrowPause = null;
			else return;
		}
		
		if (this.Directing.Tick())
		{
			this.SetDirection();
		}
		
		if (
			this.Throwing.Tick() &&
			Rect.Intersect(this, zone.View)
		) {
			this.Mode = this.Modes.Throw;
			this.Zone.Add(new '''Vodka'''(this.Zone, this.X, this.Y));
			this.ThrowPause = new Timer(0.25);
		}
		else
		{
			this.Mode = this.Modes.Walk;
			this.Walk();
		}
	}
	
	this.Draw = function (zone)
	{
		zone.Draw (
			this.Mode[this.Heading.X < 0 ? 'L' : 'R'],
			this.X, this.Y
		);
	}
	
	this.Mode = this.Modes.Walk;
	Box.FromXYWH.call(this, x, y, this.Mode.L.W, this.Mode.L.H);
	Box.PutAtB(this, y);
	
	this.Throwing = new RTimer(1, 3);
	this.Directing = new RTimer(0.25, 2);
	
	this.SetDirection();
}
