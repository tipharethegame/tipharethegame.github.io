@ = function (l, t, sheet, ini)
{
	this.Sprite = new Sprite(sheet, ini);	
	Box.FromLTWH.call(this, l, t, this.Sprite.W, this.Sprite.H);
	this.Z = Init(ini, 'Z', -1);
	
	this.Draw = function (zone)
	{
		zone.Draw(this.Sprite, this.X, this.Y);
	}
}
