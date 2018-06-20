PIE = 3.141592653589793238462643
TAU = 6.283185307179586476925287

function Qen3 (v) { return v.X*v.X + v.Y*v.Y + v.Z*v.Z; }
function Qis3 (v1, v2) { var x=v1.X-v2.X, y=v1.Y-v2.Y, z=v1.Z-v2.Z; return x*x+y*y+z*z; }
function Len3 (v) { return Math.sqrt(Qen3(v)); }
function Dis3 (v1, v2) { return Math.sqrt(Qis3(v1, v2)); }

function Add3 (v0, v1) { return { X: v0.X+v1.X, Y: v0.Y+v1.Y, Z: v0.Z+v1.Z } }
function Sub3 (v0, v1) { return { X: v0.X-v1.X, Y: v0.Y-v1.Y, Z: v0.Z-v1.Z } }
function Mul3 (v, s) { return { X: v.X * s, Y: v.Y * s, Z: v.Z * s } }

function Dot3 (v0, v1) { return v0.X * v1.X + v0.Y * v1.Y + v0.Z * v1.Z; }
function Crx3 (v0, v1) { return { X: v0.Y*v1.Z-v0.Z*v1.Y, Y: v0.Z*v1.X-v0.X*v1.Z, Z: v0.X*v1.Y-v0.Y*v1.X } }

function RotDot (r0, r1) { return r0.X * r1.X + r0.Y * r1.Y + r0.Z * r1.Z + r0.W * r1.W; }


function Renorm3 (v, from, to) { to /= from; v.X *= to; v.Y *= to; v.Z *= to; }
function Norm3 (v, to) { Renorm3(v, Len3(v), to); }

function Flip3 (v) { return { X: -v.X, Y: -v.Y, Z: -v.Z } }
function FlipQ (q) { return { X: -q.X, Y: -q.Y, Z: -q.Z, W: q.W } }


function NizeQuat (q)
{
	var lr = 1 / Math.sqrt(q.X*q.X + q.Y*q.Y + q.Z*q.Z + q.W*q.W);
	q.X *= lr; q.Y *= lr; q.Z *= lr; q.W *= lr;
}


function Rotate3 (v, by)
{
	var x = v.X * by.W + v.Y * -by.Z - v.Z * -by.Y;
	var y = v.Y * by.W + v.Z * -by.X - v.X * -by.Z;
	var z = v.Z * by.W + v.X * -by.Y - v.Y * -by.X;
	var w = v.X * by.X - v.Y * -by.Y - v.Z * -by.Z;
	
	return {
		X: by.W * x + by.X * w + by.Y * z - by.Z * y,
		Y: by.W * y + by.Y * w + by.Z * x - by.X * z,
		Z: by.W * z + by.Z * w + by.X * y - by.Y * x
	}
}

function Turn (o, by)
{
	return {
		X: o.W * by.X + o.X * by.W + o.Y * by.Z - o.Z * by.Y,
		Y: o.W * by.Y + o.Y * by.W + o.Z * by.X - o.X * by.Z,
		Z: o.W * by.Z + o.Z * by.W + o.X * by.Y - o.Y * by.X,
		W: o.W * by.W - o.X * by.X - o.Y * by.Y - o.Z * by.Z
	}
}

function RotFromPYR (p, y, r)
{
	let cy = Math.cos(y), sy = Math.sin(y);
	let cp = Math.cos(p), sp = Math.sin(p);
	let cr = Math.cos(r), sr = Math.sin(r);
	
	return {
		X: cr * cy * sp - sr * sy * cr,
		Y: sr * cy * sp + cr * sy * cr,
		Z: sr * cy * cp - cr * sy * sr,
		W: cr * cy * cp + sr * sy * sr,
	};
}

function LocFromSphere (radius, phi, z)
{
	let th = Math.asin(z / radius)
	let cth = Math.cos(th);
	
	return {
		X: cth * Math.cos(phi) * radius,
		Y: cth * Math.sin(phi) * radius,
		Z: z
	};
}


RotP2C = function (rot, cr) { return Turn(FlipQ(cr), rot); }
LocP2C = function (loc, cl, cr) { return Rotate3(Sub3(loc, cl), FlipQ(cr)); }
RotC2P = function (rot, cr) { return Turn(cr, rot); }
LocC2P = function (loc, cl, cr) { return Add3(Rotate3(loc, cr), cl); }


Project = function (v, pov, rov)
{
	this.X = v.X - pov.X;
	this.Y = v.Y - pov.Y;
	this.Z = v.Z - pov.Z;
	
	let x = this.X * +rov.W + this.Y * rov.Z - this.Z * rov.Y;
	let y = this.Y * +rov.W + this.Z * rov.X - this.X * rov.Z;
	let z = this.Z * +rov.W + this.X * rov.Y - this.Y * rov.X;
	let w = this.X * -rov.X - this.Y * rov.Y - this.Z * rov.Z;
	
	this.X = rov.W * x - rov.X * w - rov.Y * z + rov.Z * y;
	this.Y = rov.W * y - rov.Y * w - rov.Z * x + rov.X * z;
	this.Z = rov.W * z - rov.Z * w - rov.X * y + rov.Y * x;
}

Zenith = function (vp, vn, lp)
{
	let dir = Sub3(lp, vp);
	Norm3(dir, 1);
	return Dot3(dir, vn);
}


Box3Has = function ($, v)
{
	return (
		v.X > $.L && v.X < $.R &&
		v.Y > $.B && v.Y < $.T &&
		v.Z > $.F && v.Z < $.A
	);
}
