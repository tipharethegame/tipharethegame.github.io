@ = function (zone, x, y)
{
	'''/Common/Lifeform'''.call(this);
	
	this.Zone = zone;
	this.Faction = 'Biohazard';
	this.Facing = Math.random() < 0.5 ? -1 : +1;
	this.Damage = 1;
	
	this.X = x;
	this.Y = y;
	
	this.Modes =
	{
		Crawl: {
			L: new Sprite('''Chervie.Crawl.png''', { N: 2, Vertical: true, W: 16, H: 8, X:  0, T: 0.1 }),
			R: new Sprite('''Chervie.Crawl.png''', { N: 2, Vertical: true, W: 16, H: 8, X: 16, T: 0.1 })
		},
		
		Curl: {
			L: new Sprite('''Chervie.Curl.png''', { N: 4, Vertical: true, W: 16, H: 16, X:  0, T: 0.1 }),
			R: new Sprite('''Chervie.Curl.png''', { N: 4, Vertical: true, W: 16, H: 16, X: 16, T: 0.1 }),
		}
	}
	
	this.UpdMode = function ()
	{
		if (this.Grounded) this.Mode = this.Modes.Crawl[this.Velocity.X < 0 ? 'L' : 'R'];
		else this.Mode = this.Modes.Curl[this.Velocity.X < 0 ? 'L' : 'R'];
		Box.FromXYWH.call(this, this.X, this.Y, this.Mode.W, this.Mode.H);
	}
	
	this.Hit = function ()
	{
		this.Zone.Add(new '''/Common/Explosion'''(this));
		this.Gone = true;
	}
	
	this.Process = function ()
	{
		if (Rect.Intersect(this.Zone.Player, this))
		{
			this.Grounded = false;
			this.Zone.Player.Hit(this.Damage, this.Velocity.X, this.Velocity.Y);
			
			Box.PutAtX(this, this.Zone.Player.X + Randge(-10, +10));
			Box.PutAtY(this, this.Zone.Player.Y + Randge(-10, +10));
		}
		else if (this.Grounded) {
			if (Math.random() < 0.025) {
				this.Grounded = false;
				this.Velocity = {
					X: Math.sign(this.Velocity.X) * Randge(10, 100),
					Y: -Randge(100, 400)
				};
			} else {
				this.Velocity.X = Math.sign(this.Velocity.X) * Randge(25, 75);
				this.Walk();
			}
		} else this.Freefall();
		
		this.UpdMode();
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Mode, this.X, this.Y);
	}
	
	this.UpdMode();
}
