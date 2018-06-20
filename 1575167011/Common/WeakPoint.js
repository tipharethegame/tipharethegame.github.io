@ = function (zone, x, y, ini)
{
	this.Zone = zone;
	this.Owner = ini.Owner;
	this.Faction = ini.Faction || "Them";
	this.Sprite = ini.Sprite;
	this.OnDeath = ini.OnDeath;
	this.Health = ini.Health || 2;
	this.Exps = ini.Exps || 2;
	this.ExpDelay = ini.ExpDelay || 0.1;
	
	this.RX = ini.RX;
	this.RY = ini.RY;
	this.Z = ini.Z || -1;
	
	Box.FromXYWH.call(this, x, y, this.Sprite.W, this.Sprite.H * 0.75); // TODO: 0.75?
	
	this.Explode = function ()
	{
		this.Gone = true;
		this.Zone.Add(new '''/Common/Explosion''' (this, this.Exps, this.ExpDelay));
		if (this.OnDeath) this.OnDeath();
	}
	
	this.Hit = function (damage)
	{
		this.JustHit = true;
		
		this.Health -= damage;
		
		if (this.Health <= 0) this.Explode();
		else '''/Common/Ricochet.ogg'''.Play();
	}
	
	this.Draw = function ()
	{
		var shr = this.JustHit ? Raster.InverseShr : null;
		this.Zone.Draw(this.Sprite, this.X, this.Y, shr);
		this.JustHit = false;
	}
}
