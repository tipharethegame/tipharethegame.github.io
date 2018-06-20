@ = function (zone, sheet, cuts, speed, zindex, top, bottom)
{
	this.Zone = zone;
	this.Z = zindex;
	
	this.Sheet = sheet;
	this.Speed = speed;
	
	this.T = top || 0;
	this.B = bottom || this.Sheet.H;
	this.H = this.B - this.T;
	
	this.Spans = [ { CutL: 0, W: cuts[0], L: 0 } ];
	
	for (var il = 0, ir = 1; ir < cuts.length; il++, ir++)
	{
		this.Spans[ir] = {
			CutL: cuts[il], W: cuts[ir] - cuts[il],
			L: this.Spans[il].L + this.Spans[il].W
		};
	}
	
	this.Process = function ()
	{
		for (var si = 0; si < this.Spans.length; si++)
		{
			this.Spans[si].L += this.Speed * Clock.Factor;
		}
		
		for (;;)
		{
			var last = this.Spans[this.Spans.length - 1];
			if (last.L + last.W >= Screen.W) break;
			
			var rnds = 0;
			while (this.Spans[rnds].L + this.Spans[rnds].W <= 0) rnds++;
			var rnd = this.Spans.splice(~~(Math.random() * rnds), 1)[0];
			rnd.L = last.L + last.W;
			this.Spans.push(rnd);
		}
	}
	
	this.Draw = function ()
	{
		for (var si in this.Spans)
		{
			var span = this.Spans[si];
			
			Raster.BlitSLTWHLTD ( this.Sheet,
				span.CutL, this.T, span.W, this.H,
				Math.round(span.L), this.T, Screen
			);
		}
	}
}
