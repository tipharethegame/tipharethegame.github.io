Rect = function ()
{
	this.L = this.W = this.R = 0;
	this.T = this.H = this.B = 0;
}

Rect.FromWH = function (w, h)
{
	this.L = 0, this.W = this.R = w;
	this.T = 0, this.H = this.B = h;
}

Rect.FromLTWH = function (l, t, w, h)
{
	this.L = l, this.W = w, this.R = l + w;
	this.T = t, this.H = h, this.B = t + h;
}

Rect.FromLTRB = function (l, t, r, b)
{
	this.L = l, this.R = r, this.W = r - l;
	this.T = t, this.B = b, this.H = b - t;
}


Rect.PutAtL = function ($, l) { $.L = l; $.R = $.L + $.W; }
Rect.PutAtR = function ($, r) { $.R = r; $.L = $.R - $.W; }
Rect.PutAtT = function ($, t) { $.T = t; $.B = $.T + $.H; }
Rect.PutAtB = function ($, b) { $.B = b; $.T = $.B - $.H; }

Rect.SetWFromL = function ($, w) { $.W = w, $.R = $.L + w; }
Rect.SetWFromR = function ($, w) { $.W = w, $.L = $.R - w; }
Rect.SetHFromT = function ($, h) { $.H = h, $.B = $.T + h; }
Rect.SetHFromB = function ($, h) { $.H = h, $.T = $.B - h; }


Rect.Intersect = function (a, b)
{
	return (
		a.L <= b.R && b.L <= a.R &&
		a.T <= b.B && b.T <= a.B
	);
}

Rect.HasRect = function ($, r)
{
	return (
		$.L <= r.L && $.R >= r.R &&
		$.T <= r.T && $.B >= r.B
	);
}

Rect.HasXY = function (rect, x, y)
{
	return (
		x < rect.R && x >= rect.L &&
		y < rect.B && y >= rect.T
	);
}

Rect.HasPoint = function (rect, point)
{
	return Rect.HasXY(rect, point.X, point.Y);
}


CollideHorizontal = function (y, ox, oy, tx, ty) { return { X: ox, Y: y } } // TODO: WTF?
CollideVertical = function (x, ox, oy, tx, ty) { return { X: x, Y: oy } } // TODO: WTF?
CollideDiagonal = function (x, y, ox, oy, tx, ty) { return { X: x, Y: y } } // TODO: WTF?

Rect.Collide = function (ox, oy, $, tx, ty) // TODO: WTF?
{
	var oxl = ox < $.L;
	var oxr = ox > $.R;
	var oyt = oy < $.T;
	var oyb = oy > $.B;
	
	if (oxl && tx < $.L) return null;
	if (oxr && tx > $.R) return null;
	if (oyt && ty < $.T) return null;
	if (oyb && ty > $.B) return null;
	
	if (oxl && oyt) return CollideDiagonal($.L, $.T, ox, oy, tx, ty);
	if (oxr && oyt) return CollideDiagonal($.R, $.T, ox, oy, tx, ty);
	if (oxl && oyb) return CollideDiagonal($.L, $.B, ox, oy, tx, ty);
	if (oxr && oyb) return CollideDiagonal($.R, $.B, ox, oy, tx, ty);
	
	if (oxl && !oyt && !oyb) return CollideVertical($.L, ox, oy, tx, ty);
	if (oxr && !oyt && !oyb) return CollideVertical($.R, ox, oy, tx, ty);
	if (oyt && !oxl && !oxr) return CollideHorizontal($.T, ox, oy, tx, ty);
	if (oyb && !oxl && !oxr) return CollideHorizontal($.B, ox, oy, tx, ty);
	
	return { X: ox, Y: oy };
}


Rect.LineIntersect = function (v0, $, v1)
{
	if (
		Math.max(v0.X, v1.X) < $.L || Math.min(v0.X, v1.X) > $.R ||
		Math.max(v0.Y, v1.Y) < $.T || Math.min(v0.Y, v1.Y) > $.b
	) return null;
	
	var int = null;
	
	if (int = SegIntSeg(v0.X, v0.Y, v1.X, v1.Y, $.L, $.T, $.R, $.T)) return int;
	if (int = SegIntSeg(v0.X, v0.Y, v1.X, v1.Y, $.R, $.T, $.R, $.B)) return int;
	if (int = SegIntSeg(v0.X, v0.Y, v1.X, v1.Y, $.R, $.B, $.L, $.B)) return int;
	if (int = SegIntSeg(v0.X, v0.Y, v1.X, v1.Y, $.L, $.B, $.L, $.T)) return int;
	
	return null;
}
