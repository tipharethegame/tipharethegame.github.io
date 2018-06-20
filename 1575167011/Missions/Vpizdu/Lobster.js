@ = function (zone, x, y)
{
	this.Zone = zone;
	this.Faction = 'Petrosyan';
	this.Damage = 1;
	
	this.Speed = 100;
	this.Velocity = x > zone.View.X ? -this.Speed : +this.Speed;
	
	var sheet = '''Lobster.png''';
	
	this.Hit = function ()
	{
		this.Zone.Add(new '''/Common/Explosion'''(this));
		this.Gone = true;
	}
	
	this.Modes =
	{
		L: new Sprite(sheet, { N: 2, Vertical: true, W: 40, H: 24, X:  0, T: 0.1 }),
		R: new Sprite(sheet, { N: 2, Vertical: true, W: 40, H: 24, X: 40, T: 0.1 })
	}
	
	this.Process = function ()
	{
		if (
			(this.Velocity > 0 && this.L >= this.Zone.View.R) ||
			(this.Velocity < 0 && this.R <= this.Zone.View.L)
		) {
			this.Gone = true;
			return;
		}
		
		if (Rect.Intersect(this.Zone.Player, this))
		{
			this.Zone.Player.Hit(this.Damage, 0, 0);
		}
		
		Box.PutAtX(this, this.X + this.Velocity * Clock.Factor);
		this.UpdMode();
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Mode, this.X, this.Y);
	}
	
	this.UpdMode = function ()
	{
		this.Mode = this.Velocity < 0 ? this.Modes.L : this.Modes.R;
	}
	
	this.UpdMode();
	
	Box.FromXYWH.call(this, x, y, this.Mode.W, this.Mode.H);
	Box.PutAtB(this, y);
}

@.ApproxBox = new Box.FromXYWH(0, 0, 40, 24);
