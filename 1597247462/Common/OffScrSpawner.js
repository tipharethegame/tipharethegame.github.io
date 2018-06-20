@ = function (zone, o, ini)
{
	this.Zone = zone;
	this.Timer = new Timer(ini.T);
	
	var obox = o.ApproxBox || new Box.FromXYWH(0, 0, zone.View.W / 4, zone.View.H / 4);
	
	var oxl = obox.PX;
	var oxr = obox.R - obox.PX;
	
	this.Process = function ()
	{
		if (!this.Timer.Tick()) return;
		
		var x, y;
		
		switch (ini.Edge)
		{
			case 'L': y = ~~Randge(ini.Min, ini.Max + 1); x = zone.View.L - obox.W; break;
			case 'R': y = ~~Randge(ini.Min, ini.Max + 1); x = zone.View.R + obox.W; break;
		}
		
		this.Zone.Add( new o (this.Zone, x, y) );
	}
}
