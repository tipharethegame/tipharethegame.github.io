Raster = function (w, h)
{
	this.W = w;
	this.H = h;
	
	this.RawStride = this.W * 4;
	this.RawPixels = new Uint8ClampedArray(this.RawStride * this.H);
}


Raster.hcanv = document.createElement('canvas');
Raster.hcanv.C2D = Raster.hcanv.getContext('2d');


Raster.FromFile = function (id)
{
	this.ID = id;
	
	var img = new Image();
	var ras = img.Owner = this;
	
	img.onload = function ()
	{
		Raster.hcanv.width = this.Owner.W = this.width;
		Raster.hcanv.height = this.Owner.H = this.height;
		
		this.Owner.RawStride = this.Owner.W * 4;
		
		Raster.hcanv.C2D.drawImage(img, 0, 0, this.Owner.W, this.Owner.H);
		
		this.Owner.RawData = Raster.hcanv.C2D.getImageData(0, 0, this.Owner.W, this.Owner.H);
		this.Owner.RawPixels = this.Owner.RawData.data;
		
		SetLoaded(this.Owner.ID, this.Owner);
	}
	
	img.onerror = function ()
	{
		throw this.Owner.ID;
	}
	
	this.Realize = function ()
	{
		SetReady(this.ID, this);
	}
	
	this.Dispose = function ()
	{
		img.onload = null;
		img.onerror = null;
	}
	
	img.src = IdToSrc(id);
}


Raster.LocatePixel = function ($, x, y)
{
	return (y * $.W + x) * 4;
}

Raster.SetXYRGBA = function ($, x, y, r, g, b, a)
{
	var i = Raster.LocatePixel($, x, y);
	
	$.RawPixels[i + 0] = r;
	$.RawPixels[i + 1] = g;
	$.RawPixels[i + 2] = b;
	$.RawPixels[i + 3] = a;
}


Raster.DirectShr = function (src, srci, dst, dsti, arg)
{
	if (src.RawPixels[srci + 3])
	{
		dst.RawPixels[dsti + 0] = src.RawPixels[srci + 0];
		dst.RawPixels[dsti + 1] = src.RawPixels[srci + 1];
		dst.RawPixels[dsti + 2] = src.RawPixels[srci + 2];
	}
}

Raster.InverseShr = function (src, srci, dst, dsti, arg)
{
	if (src.RawPixels[srci + 3])
	{
		dst.RawPixels[dsti + 0] = 0xFF - src.RawPixels[srci + 0];
		dst.RawPixels[dsti + 1] = 0xFF - src.RawPixels[srci + 1];
		dst.RawPixels[dsti + 2] = 0xFF - src.RawPixels[srci + 2];
	}
}

Raster.ColorizeShr = function (src, srci, dst, dsti, color)
{
	if (src.RawPixels[srci + 3])
	{
		dst.RawPixels[dsti + 0] = color.R;
		dst.RawPixels[dsti + 1] = color.G;
		dst.RawPixels[dsti + 2] = color.B;
	}
}

Raster.MultiplyShr = function (src, srci, dst, dsti, color)
{
	if (src.RawPixels[srci + 3])
	{
		dst.RawPixels[dsti + 0] = src.RawPixels[srci + 0] * color.R / 0xFF;
		dst.RawPixels[dsti + 1] = src.RawPixels[srci + 1] * color.G / 0xFF;
		dst.RawPixels[dsti + 2] = src.RawPixels[srci + 2] * color.B / 0xFF;
	}
}

Raster.RepShr = function (i, rgba)
{
	this.RawPixels[i + 0] = rgba.R;
	this.RawPixels[i + 1] = rgba.G;
	this.RawPixels[i + 2] = rgba.B;
	this.RawPixels[i + 3] = rgba.A;
}


Raster.BlitSLTWHLTD = function (src, sl, st, w, h, dl, dt, dst, shr, arg)
{
	if (dl >= dst.W) return;
	if (dt >= dst.H) return;
	
	var ww = Math.abs(w);
	var hh = Math.abs(h);
	
	var dr = dl + ww; if (dr <= 0) return;
	var db = dt + hh; if (db <= 0) return;
	
	var sigx = Math.sign(w);
	var sigy = Math.sign(h);
	
	if (!shr) shr = Raster.DirectShr;
	
	if (dr > dst.W) dr = dst.W;
	if (db > dst.H) db = dst.H;
	
	var osl = sl; if (dl < 0) sl -= dl, ww += dl, dl = 0;
	var ost = st; if (dt < 0) st -= dt, hh += dt, dt = 0;
	
	var x0 = sigx > 0 ? sl : osl + ww - 1;
	var y0 = sigy > 0 ? st : ost + hh - 1;
	
	var sstride = src.W * 4;
	var dstride = dst.W * 4;
	
	var syi = sstride * y0 + x0 * 4;
	var dyi = dstride * dt + dl * 4;
	
	var sy = y0;
	var dy = dt;
	
	while (dy < db)
	{
		var sxi = syi;
		var dxi = dyi;
		
		var sx = x0;
		var dx = dl;
		
		while (dx < dr)
		{
			shr(src, sxi, dst, dxi, arg);
			
			sx += sigx;
			dx++;
			
			sxi += 4 * sigx;
			dxi += 4;
		}
		
		sy += sigy;
		dy++;
		
		syi += sstride;
		dyi += dstride;
	}
}


Raster.BresenLine = function ($, v0, v1, shader, data)
{
	var x = ~~v0.X, x1 = ~~v1.X;
	var y = ~~v0.Y, y1 = ~~v1.Y;
	
	var dx = Math.abs(x1 - x), sx = x < x1 ? +1 : -1;
	var dy = Math.abs(y1 - y), sy = y < y1 ? +1 : -1;
	
	var ee;
	var e = ~~((dx > dy ? dx : -dy) / 2);
	
	for (;;)
	{
		if (
			x >= 0 && x < $.W &&
			y >= 0 && y < $.H
		) {
			var pi = Raster.LocatePixel($, x, y);
			shader.call($, pi, data);
		}
		
		if (x == x1 && y == y1) return;
		
		ee = e;
		
		if (ee > -dx) e -= dy, x += sx;
		if (ee < +dy) e += dx, y += sy;
	}
}
