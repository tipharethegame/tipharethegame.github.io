@ = function (raster)
{
	this.Raster = raster;
	
	this.Pick = function (x, y)
	{
		if (y < 0 || y >= this.Raster.H) return null;
		if (x < 0 || x >= this.Raster.W) return 'SOLID';
		
		var pi = Raster.LocatePixel(this.Raster, ~~x, ~~y);
		
		var a = this.Raster.RawPixels[pi + 3];
		
		if (a != 0xFF) return null;
		
		var r = this.Raster.RawPixels[pi + 0];
		var g = this.Raster.RawPixels[pi + 1];
		var b = this.Raster.RawPixels[pi + 2];
		
		if (r == 0x00 && g == 0xFF && b == 0x00) return 'FLOOR';
		if (r == 0x00 && g == 0xFF && b == 0xFF) return 'SOLID';
	}
	
	this.Seek = function (x, y, xt, yt)
	{
		x = ~~x; xt = ~~xt;
		y = ~~y; yt = ~~yt;
		
		var dx = Math.abs(xt - x), sx = x < xt ? +1 : -1;
		var dy = Math.abs(yt - y), sy = y < yt ? +1 : -1;
		
		var ee, e = ~~((dx > dy ? dx : -dy) / 2);
		
		for (;;)
		{
			var what = this.Pick(x, y);
			if (what) return { X: x, Y: y, What: what };
			
			if (x == xt && y == yt) return;
			
			ee = e;
			
			if (ee > -dx) e -= dy, x += sx;
			if (ee < +dy) e += dx, y += sy;
		}
		
		return null;
	}
}
