@ = function (zone, e0, e1)
{
	this.Zone = zone;
	
	this.E0 = e0;
	this.E1 = e1;
	
	if (this.E0.Z == this.E1.Z) this.Z = 0;
	else this.Z = (this.E0.Z + this.E1.Z) / 2;
	
	this.Color = { R: 0xFF, G: 0, B: 0, A: 0xFF };
	this.Blink = true;
	
	this.Draw = function (zone)
	{
		if (this.Blink =! this.Blink) return;
		
		var e0 = zone.LocalizePoint(this.E0);
		var e1 = zone.LocalizePoint(this.E1);
		
		Raster.BresenLine(Screen, e0, e1, Raster.RepShr, this.Color);
		
		for (let ti in zone.Things)
		{
			let t = zone.Things[ti];
			
			if (
				!t.Cage && (t.Faction == 'LJR') &&
				Rect.LineIntersect(this.E0, t, this.E1)
			) {
				this.E0.Alert = true;
				this.E1.Alert = true;
				
				this.ShutDown();
				zone.Trip();
			}
		}
	}
	
	this.ShutDown = function ()
	{
		this.Draw = null;
	}
	
	this.OnAdd = function ()
	{
		this.Zone.Add(this.E0);
		this.Zone.Add(this.E1);
	}
	
	this.OnGone = function ()
	{
		this.Zone.Remove(this.E0);
		this.Zone.Remove(this.E1);
	}
}
