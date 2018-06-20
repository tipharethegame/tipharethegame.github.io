@ = function (zone, x, y)
{
	this.Zone = zone;
	this.Faction = "Kuklachort";
	this.Z = -.5;
	
	this.Sprite = new Sprite('''Seeker.png''', { N: 2, T: 0.1 });
	this.Color = { R: 0x00, G: 0xFF, B: 0xFF, A: 0xFF };
	
	Box.FromXYWH.call(this, x, y, this.Sprite.W, this.Sprite.H);
	this.Damage = 1;
	
	this.Process = function (zone)
	{
		for (let i = 0; i < zone.Things.length; i++) { let t = zone.Things[i];
			
			if (
				t.Hit && !t.Dead && t.Faction != this.Faction &&
				!t.Cage && Rect.Intersect(this, t)
			) {
				t.Hit(this.Damage, 0, 0);
				return;
			}
		};
	}
	
	this.Draw = function (zone)
	{
		var loc = zone.LocalizeBox(this);
		var v0 = { X: loc.X, Y: loc.Y };
		
		for (var i = 0; i < 10; i++)
		{
			var v1 = { X: Randge(loc.L, loc.R), Y: Randge(loc.T, loc.B) };
			Raster.BresenLine(Screen, v0, v0 = v1, Raster.RepShr, this.Color);
		}
		
		zone.Draw(this.Sprite, this.X, this.Y);
	}
}
