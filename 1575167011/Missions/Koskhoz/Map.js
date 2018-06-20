@ = function (w, h, mul)
{
	this.W = w;
	this.H = h;
	this.D = 1;
	
	this.M = mul || 1;
	
	this.RawPixels = new Float32Array(this.W * this.H * this.D);
	this.XY = function (x, y) { return (y * this.W + x) * this.D; }
}

@.FromRaster = function (src, mul)
{
	@.call(this, src.W, src.H, mul);
	
	for (let sy = src.H - 1, dy = 0; sy >= 0; --sy, ++dy)
	{
		for (let sx = 0, dx = 0; sx < src.W; ++sx, ++dx)
		{
			let spi = Raster.LocatePixel(src, sx, sy);
			let dpi = this.XY(dx, dy);
			
			this.RawPixels[dpi] = src.RawPixels[spi] * this.M / 0xFF;
		}
	}
}
