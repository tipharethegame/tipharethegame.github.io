Add = function (a, b)
{
	this.X = a.X + b.X;
	this.Y = a.Y + b.Y;
}

Sub = function (a, b)
{
	this.X = a.X - b.X;
	this.Y = a.Y - b.Y;
}


Qen = function (v) { return v.X * v.X + v.Y * v.Y; }
Len = function (v) { return Math.sqrt(Qen(v)); }
Qis = function (v0, v1) { let x = v0.X-v1.X, y = v0.Y-v1.Y; return x*x + y*y; }
Dis = function (v0, v1) { return Math.sqrt(Qis(v0, v1)); }


Renorm = function (v, from, to)
{
	to /= from;
	
	this.X = v.X * to;
	this.Y = v.Y * to;
}

Norm = function (v, to)
{
	Renorm.call(this, v, Len(v), to);
}


SegIntSeg = function (
	a0x, a0y, a1x, a1y, 
    b0x, b0y, b1x, b1y
) {
	var asx = a1x - a0x, asy = a1y - a0y;
	var bsx = b1x - b0x, bsy = b1y - b0y;
	
	var v = -bsx * asy + asx * bsy; if (v == 0) return null;
	var d = 1 / v;
	
	var s = (-asy * (a0x - b0x) + asx * (a0y - b0y)) * d;
	var t = (+bsx * (a0y - b0y) - bsy * (a0x - b0x)) * d;
	
	if (s < 0 || s > 1 || t < 0 || t > 1) return null;
	return { X: a0x + (t * asx), Y: a0y + (t * asy) };
}


DirToEightDir = function (dir)
{
	var angle = Math.floor (
		(Math.PI + Math.atan2(dir.X, -dir.Y)) / Math.PI / 2 * 16
	);
	
	switch (angle)
	{
		case  0: case 15: return 'CD';
		case  1: case  2: return 'LD';
		case  3: case  4: return 'LC';
		case  5: case  6: return 'LU';
		case  7: case  8: return 'CU';
		case  9: case 10: return 'RU';
		case 11: case 12: return 'RC';
		case 13: case 14: return 'RD';
	}
}
