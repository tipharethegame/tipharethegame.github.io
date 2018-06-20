@ = function (zone, x, y)
{
	this.Zone = zone;
	this.Sprite = new Sprite('''Bloop.png''', { N: 5, Loop: false, T: 0.1 });
	Box.FromLTWH.call(this, x, y, this.Sprite.W, this.Sprite.H);
	this.Timer = new Timer(2);
	
	this.Process = function ()
	{
		if (this.Timer.Tick())
		{
			this.Sprite.SetFrame(0);
			
			var nw = new '''Chervie''' (this.Zone, this.X, this.Y);
			nw.Velocity = { X: Randge(-100, +100), Y: -Randge(100, 400) };
			
			this.Zone.Add(nw);
		}
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Sprite, this.X, this.Y);
	}
}
