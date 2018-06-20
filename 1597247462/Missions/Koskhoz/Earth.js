@ = function ()
{
	'''Obj3ct'''.call(this);
	
	this.Radius = 6371000;
	this.KatIntoSrGov = { U: 0, V: 0.01 };
	
	this.Map = new '''Map'''.FromRaster('''Sranaya.png''');
	this.Faces = [];
	
	let segs = 32;
	
	this.Peak = { X: 0, Y: 0, Z: +1, L: 0.5 };
	this.Horizon = [];
	
	for (let a = 0, vi = 0; vi < segs; a += TAU / segs, ++vi)
	{
		let v = LocFromSphere(1, a, 0.75); v.L = 0.5;
		this.Horizon.push(v);
	}
	
	for (let i0 = 0, i1 = 1; i1 <= segs; ++i0, ++i1)
	{
		this.Faces.push ( [
			this.Peak, this.Horizon[i0],
			this.Horizon[i1 < segs ? i1 : 0]
		] );
	}
	
	this.Limb = new '''Obj3ct''';
	this.Children = [ this.Limb ];
	this.Limb.Parent = this;
	this.Limb.Map = new '''Map'''.FromRaster('''Limb.png''');
	
	this.LimbB = [];
	this.LimbT = [];
	
	for (
		let a = 0, l = 0, vi = 0; vi < segs;
		a += TAU / segs, l += 1 / segs, ++vi
	) {
		let vb = LocFromSphere(1.0 * this.Radius, a, 0.75 * this.Radius);
		let vt = LocFromSphere(1.05 * this.Radius, a, 0.75 * this.Radius);
		
		vb.U = l, vb.V = 0, vb.L = 0.125;
		vt.U = l, vt.V = 1, vt.L = 0.125;
		
		this.LimbB.push(vb);
		this.LimbT.push(vt);
	}
	
	this.Limb.Verts = JArs([ this.LimbB, this.LimbT ]);
	this.Limb.Faces = [];
	
	for (let i0 = 0, i1 = 1; i1 <= segs; ++i0, ++i1)
	{
		let b0 = this.LimbB[i0], b1 = this.LimbB[i1 < segs ? i1 : 0];
		let t0 = this.LimbT[i0], t1 = this.LimbT[i1 < segs ? i1 : 0];
		
		this.Limb.Faces.push([ b0, t0, t1 ]);
		this.Limb.Faces.push([ b0, t1, b1 ]);
	}
	
	this.Surface = JArs([ [this.Peak], this.Horizon ]);
	this.Verts = JArs([ this.Surface ]);
	
	this.Surface.forEach ( function (v) {
		
		v.U = v.X * 8 + 0.5;
		v.V = v.Y * 8 + 0.5;
	
		v.X *= this.Radius;
		v.Y *= this.Radius;
		v.Z *= this.Radius;
		
	}, this );
	
	this.Process = function ()
	{
		this.Surface.forEach ( function (v) {
			v.U += this.KatIntoSrGov.U * Clock.Factor;
			v.V += this.KatIntoSrGov.V * Clock.Factor;
		}, this );
	}
}
