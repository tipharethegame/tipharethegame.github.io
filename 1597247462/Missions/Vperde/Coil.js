@ = function (poezd, rx, ry, sheet)
{
	this.Poezd = poezd;
	this.Zone = this.Poezd.Zone;
	this.Relative = { X: rx, Y: ry };
	this.Sprite = new Sprite(sheet);
	this.Z = this.Z = -4;
	this.Faction = 'Them';
	this.Health = 24;
	
	this.SparkColor = { R: 0x00, G: 0xFF, B: 0xFF, A: 0xFF };
	
	this.Hit = function (dmg, x, y)
	{
		if ((this.Health -= dmg) <= 0)
		{
			this.Poezd.Damage(1);
			this.Zone.Add( new '''/Common/Explosion''' (this, 4) );
			this.Gone = true;
		}
		else
		{
			'''/Common/Ricochet.ogg'''.Play();
			this.JustHit = true;
		}
	}
	
	this.Attack = function ()
	{
		this.Poezd.Target.Hit(0.5 * Clock.Factor, 0, 0);
	}
	
	this.Process = function (zone)
	{
		Box.FromXYWH.call ( this,
			this.Poezd.X + this.Relative.X,
			this.Poezd.Y + this.Relative.Y,
			this.Sprite.W, this.Sprite.H
		);
		
		this.HVZone = new Box.FromLTRB(this.L, this.B - 8*3, this.R, this.B);
	}
	
	this.Draw = function (zone)
	{
		zone.Draw(this.Sprite, this.X, this.Y, this.JustHit ? Raster.InverseShr : null);
		this.JustHit = false;
		
		var src = zone.LocalizeBox(this.HVZone);
		
		if (this.Poezd.Agitation > 0)
		{
			var sprkc = Math.round(this.Poezd.Agitation * 64);
			var sprkl = this.Poezd.Agitation * 8;
			
			for (var i = 0; i < sprkc; i++)
			{
				var v0 = { X: Randge(src.L, src.R), Y: Randge(src.T, src.B) };
				var v1 = { X: v0.X + Randge(-sprkl, +sprkl), Y: v0.Y + Randge(-sprkl, +sprkl) };
				
				Raster.BresenLine ( Screen, v0, v1,
					Raster.RepShr, this.SparkColor
				);
			}
		}
		
		if (this.Poezd.Agitation >= 1)
		{
			var tgt = zone.LocalizeBox(this.Poezd.Target);
			
			var ray = new Sub(tgt, src);
			var rle = Len(ray);
			
			var line = { X: src.X, Y: src.Y };
			var segs = new Array(10);
			var sinc = new Renorm(ray, rle, rle / segs.length);
			
			for (var i = 0; i < segs.length; i++)
			{
				segs[i] = line;
				line = new Add(line, sinc);
			}
			
			for (var i = 1; i < segs.length - 1; i++)
			{
				segs[i].X += Randge(-16, +16);
				segs[i].Y += Randge(-16, +16);
			}
			
			for (var i = 0; i < segs.length - 1; i++)
			{
				Raster.BresenLine ( Screen,
					segs[i], segs[i + 1],
					Raster.RepShr, this.SparkColor
				);
			}
		}
	}
}
