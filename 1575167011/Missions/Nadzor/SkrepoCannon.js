@ = function (zone, x, y)
{
	this.Zone = zone;
	this.Sprite = new Sprite ('''SkrepoCannon.png''', { N: 4, T: 0.1 });
	Box.FromXYWH.call(this, x, y, this.Sprite.W, this.Sprite.H);
	this.Faction = "Them";
	this.Z = -1;
	
	this.Process = function ()
	{
		@.ShootTimer += Clock.Factor;
		
		if (@.ShootTimer > @.MaxInterval)
		{
			this.Zone.Add(new '''Skrepa''' (this, this.X, this.Y)).HomeAt(this.Zone.Player);
			@.ShootTimer = @.MaxInterval * Math.random() - @.MinInterval;
		}
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Sprite, this.X, this.Y);
	}
	
	this.BlowUp = function ()
	{
		this.Zone.Add(new '''/Common/Explosion''' (this, 1));
		this.Gone = true;
	}
}

@.MinInterval = 5;
@.MaxInterval = 10;
@.ShootTimer = 0;
