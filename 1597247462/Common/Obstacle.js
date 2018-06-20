@ = function (zone, x, y, sprite, health)
{
	this.Zone = zone;
	this.Sprite = sprite;
	this.Faction = 'Them';
	this.Condition = health || 10;
	this.Z = -1;
	
	Box.FromLTWH.call(this, x, y, sprite.W, sprite.H);
	
	this.Type = 'SOLID';
	
	this.Hit = function (damage, x, y)
	{
		if (this.Condition == Infinity) return;
		if ((this.Condition -= damage) <= 0)
		{
			if (this.OnDestruction) this.OnDestruction();
			this.Zone.Add( new '''/Common/Explosion''' (this, health) );
			this.Zone.Remove(this);
		}
		else
		{
			'''/Common/Ricochet.ogg'''.Play();
			
			this.HitDisplacement = {
				X: x > 0 ? +1 : x < 0 ? -1 : 0,
				Y: y > 0 ? +1 : y < 0 ? -1 : 0
			};
		}
	}
	
	this.Draw = function ()
	{
		var x = this.X;
		var y = this.Y;
		
		if (this.HitDisplacement)
		{
			x += this.HitDisplacement.X;
			y += this.HitDisplacement.Y;
			
			this.HitDisplacement = null;
		}
		
		this.Zone.Draw(this.Sprite, x, y);
	}
}
