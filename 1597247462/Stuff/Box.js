Box = function ()
{
	Rect.call(this);
	
	this.PX = 0;
	this.PY = 0;
	
	this.X = 0;
	this.Y = 0;
}

Box.FromXYWH = function (x, y, w, h)
{
	this.PX = w / 2;
	this.PY = h / 2;
	
	Rect.FromLTWH.call(this, x - this.PX, y - this.PY, w, h);
	
	this.X = x;
	this.Y = y;
}

Box.FromLTWH = function (l, t, w, h)
{
	Rect.FromLTWH.call(this, l, t, w, h);
	
	this.PX = this.W / 2;
	this.PY = this.H / 2;
	
	this.X = l + this.PX;
	this.Y = t + this.PY;
}

Box.FromLTRB = function (l, t, r, b)
{
	Rect.FromLTRB.call(this, l, t, r, b);
	
	this.PX = this.W / 2;
	this.PY = this.H / 2;
	
	this.X = l + this.PX;
	this.Y = t + this.PY;
}


Box.FromXYS = function (x, y, s) { Box.FromXYWH.call(this, x, y, s.W, s.H); }
Box.FromLTS = function (l, t, s) { Box.FromLTWH.call(this, l, t, s.W, s.H); }


Box.PutAtX = function ($, x) { $.X = x; Rect.PutAtL($, x - $.PX); }
Box.PutAtY = function ($, y) { $.Y = y; Rect.PutAtT($, y - $.PY); }

Box.PutAtL = function ($, l) { Rect.PutAtL($, l); $.X = $.L + $.PX; }
Box.PutAtT = function ($, t) { Rect.PutAtT($, t); $.Y = $.T + $.PY; }
Box.PutAtR = function ($, r) { Rect.PutAtR($, r); $.X = $.L + $.PX; }
Box.PutAtB = function ($, b) { Rect.PutAtB($, b); $.Y = $.T + $.PY; }

Box.MoveT = function ($, t) { $.T += t; $.H -= t; $.PY -= t; }
Box.MoveR = function ($, r) { $.R += r; $.W -= r; $.PX -= r; }

Box.SetWFromX = function ($, w) { $.W = w; $.L = $.X - ($.PX = $.W / 2); $.R = $.L + $.W; }
Box.SetHFromY = function ($, h) { $.H = h; $.T = $.Y - ($.PY = $.H / 2); $.B = $.T + $.H; }

Box.SetWFromL = function ($, w) { Rect.SetWFromL($, w); $.X = $.L + ($.PX = $.W / 2); }
Box.SetWFromR = function ($, w) { Rect.SetWFromR($, w); $.X = $.L + ($.PX = $.W / 2); }
Box.SetHFromT = function ($, h) { Rect.SetHFromT($, h); $.Y = $.T + ($.PY = $.H / 2); }
Box.SetHFromB = function ($, h) { Rect.SetHFromB($, h); $.Y = $.T + ($.PY = $.H / 2); }

Box.SetHPFromB = function ($, h, p) { Rect.SetHFromB($, h); $.Y = $.T + ($.PX = p); }

Box.ConstrainLTRB = function ($, l, t, r, b)
{
	if ($.L < l) Box.PutAtL($, l); else if ($.R > r) Box.PutAtR($, r);
	if ($.T < t) Box.PutAtT($, t); else if ($.B > b) Box.PutAtB($, b);
}

Box.Constrain = function ($, r)
{
	Box.ConstrainLTRB($, r.L, r.T, r.R, r.B);
}
