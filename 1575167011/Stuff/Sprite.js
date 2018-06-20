Sprite = function (sheet, ini)
{
	this.Sheet = sheet;
	
	this.Periods = (ini && (ini.Periods || ini.TT)) || null;
	this.Period = this.Periods ? this.Periods[0] : (ini && (ini.Period || ini.T)) || 1;
	this.Frames = (ini && (ini.Frames || ini.N)) || (this.Periods ? this.Periods.length : 1);
	this.Loop = (ini && 'Loop' in ini) ? ini.Loop : true;
	this.LoopStart = (ini && 'LoopStart' in ini) ? ini.LoopStart : 0;
	this.Vertical = (ini && (ini.Vertical || ini.V)) ? true : false;
	
	this.X = (ini && ini.X) || 0;
	this.Y = (ini && ini.Y) || 0;
	
	this.W = (ini && (ini.W || ini.W)) || (this.Vertical ? this.Sheet.W : this.Sheet.W / this.Frames);
	this.H = (ini && (ini.H || ini.H)) || (this.Vertical ? this.Sheet.H / this.Frames : this.Sheet.H);
	
	this.PivotX = (ini && 'PX' in ini) ? ini.PX : ~~(this.W / 2);
	this.PivotY = (ini && 'PY' in ini) ? ini.PY : ~~(this.H / 2);
	
	this.SignX = Init(ini, 'FX', 1);
	this.SignY = Init(ini, 'FY', 1);
	
	if (ini && 'OPX' in ini) this.PivotX += ini.OPX;
	if (ini && 'OPY' in ini) this.PivotY += ini.OPY;
	
	this.Elapsed = 0;
	this.Frame = 0;
	this.Repeat = 0;
	
	this.SetFrame = function (n)
	{
		this.Period = this.Periods ? this.Periods[n] : this.Period;
		this.Frame = n;
		this.Elapsed = 0;
		this.Repeat = 0;
	}
	
	this.Draw = function (x, y, shade, sharg)
	{
		var fx = this.X;
		var fy = this.Y;
		
		if (this.Vertical) fy += this.Frame * this.H;
		else fx += this.Frame * this.W;
		
		Raster.BlitSLTWHLTD (
			this.Sheet, ~~fx, ~~fy,
			this.W * this.SignX, this.H * this.SignY,
			~~(x - this.PivotX), ~~(y - this.PivotY),
			Screen, shade, sharg
		);
		
		if ((this.Elapsed += Clock.Factor) >= this.Period)
		{
			if (this.Loop) {
				if (++this.Frame >= this.Frames) {
					this.Frame = this.LoopStart;
					this.Repeat++;
				}
			} else {
				if (!this.Repeat && ++this.Frame >= this.Frames) {
					this.Frame = this.Frames - 1;
					this.Repeat++;
				}
			}
			
			if (this.Periods) this.Period = this.Periods[this.Frame];
			this.Elapsed = 0;
		}
	}
}
