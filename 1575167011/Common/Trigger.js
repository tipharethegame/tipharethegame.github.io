@ = function (zone, left, top, right, bottom, fun, sprite, z)
{
	this.Zone = zone;
	
	Box.FromLTRB.call(this, left, top, right, bottom);
	
	this.Process = function ()
	{
		if (
			!this.Zone.Player.Dead &&
			Rect.HasPoint(this, this.Zone.Player)
		) {
			fun.call(this.Zone);
			this.Gone = true;
		}
	}
	
	if (this.Sprite = sprite)
	{
		this.Z = z || -1;
		
		this.Draw = function (zone)
		{
			zone.Draw(this.Sprite, this.X, this.Y);
		}
	}
}
