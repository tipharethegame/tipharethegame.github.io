@ = function (zone, l, t)
{
	'''/Common/Obstacle'''.call( this, zone, l, t,
		new Sprite('''Cage.Bars.png'''), 1
	);
	
	this.Faction = "Kuklachort";
	this.Inner = new Box.FromLTRB(this.L + 5, this.T + 5, this.R - 5, this.B - 5);
	this.OnDestruction = function () { this.Cat.Cage = null; }
	this.Type = null;
	this.Z = -1;
	this.Cat = new '''Katze''' (zone, this.X, this.Y, this);
	this.OnAdd = function (zone) { zone.Add(this.Cat); }
	this.OnGone = function (zone) { if (this.Cat.Cage) zone.Remove(this.Cat); }
}
