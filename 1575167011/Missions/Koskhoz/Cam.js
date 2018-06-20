@ = function ()
{
	this.MinExpo = 1;
	this.MaxExpo = 5;
	this.Opti = 0.25;
	this.Expo = this.MaxExpo;
	this.ExpoSpeed = 4;
	this.MaxValue = 0xAA;
	this.Noise = 0.05;
	
	this.Zoom = 0.75;
	this.Zqqm = this.Zoom * this.Zoom;
	this.Pixoom = -(this.Zoom * Screen.W);
	this.Pixqqm = this.Pixoom * this.Pixoom;
	this.NearClip = -0.01;
	
	this.Glare1 = new '''Glare''' (64, 64, 1);
	this.Glare2 = new '''Glare''' (256, 256);
	this.Glare3 = new '''Glare''' (32, 32, 0.1);
	this.Glare4 = new '''Glare''' (64, 64, 0.1);
	
	this.Ambient = 0.01;
	this.Lites = [];
	
	this.L0 = new Array(Screen.H);
	this.L1 = new Array(Screen.H);
	
	for (let y = 0; y < Screen.H; ++y)
	{
		this.L0[y] = {};
		this.L1[y] = {};
	}
	
	this.Plain = [];
	this.YX = [];
	
	for (var i = 0, y = Screen.H - 1; y >= 0; y--)
	{
		var row = this.YX[y] = new Array(Screen.W);
		
		for (var x = 0; x < Screen.W; x++, i++)
		{
			row[x] = this.Plain[i] = {};
		}
	}
	
	this.Clear = function ()
	{
		this.Lites.length = 0;
		
		for (let i = 0; i < this.Plain.length; i++)
		{
			let p = this.Plain[i];
			p.Z = -Infinity;
			p.V = 0;
		}
	}
	
	this.DrawSprite = function (map, x, y)
	{
		for (let my = 0, dy = ~~(y - map.H / 2); my < map.H; ++my, ++dy)
		{
			if (dy < 0 || dy >= Screen.H) continue;
			
			for (let mx = 0, dx = ~~(x - map.W / 2); mx < map.W; ++mx, ++dx)
			{
				if (dx < 0 || dx >= Screen.W) continue;
				
				let mv = map.RawPixels[map.XY(mx, my)];
				let dp = this.YX[dy][dx];
				
				dp.V += mv;
			}
		}
	}
	
	this.PostProc = function ()
	{
		this.Lites.forEach ( function (l) {
			
			if (l.P.Z > this.NearClip) return;
			let w = this.Pixoom / l.P.Z;
			
			let hw = Screen.W / 2;
			let hh = Screen.H / 2;
			
			let x = ~~(l.P.X * w + hw); if (x < 0 || x >= Screen.W) return;
			let y = ~~(l.P.Y * w + hh); if (y < 0 || y >= Screen.H) return;
			
			if (this.YX[y][x].Z > l.P.Z) return;

			this.DrawSprite(this.Glare1, x, y);
			this.DrawSprite(this.Glare2, x, y);
			this.DrawSprite(this.Glare3, hw - (x - hw), hh - (y - hh));
			this.DrawSprite(this.Glare4, hw - (x - hw) / 2, hh - (y - hh) / 2);
			
		}, this );
	}
	
	this.Expose = function ()
	{
		var total = 0;
		
		for (var si = 0, di = 0; si < this.Plain.length; si++, di += 4)
		{
			var s = this.Plain[si];
			var d = Screen.RawPixels[di];
			
			var val = (s.V + Randge(-this.Noise, +this.Noise)) * this.Expo;
			total += val;
			
			val = val < 1 ? ~~(val * this.MaxValue) : this.MaxValue;
			
			Screen.RawPixels[di + 0] = 
			Screen.RawPixels[di + 1] = 
			Screen.RawPixels[di + 2] = val;
			Screen.RawPixels[di + 3] = 255;
		}
		
		let meter = total / this.Plain.length;
		let cs = Clock.Factor * this.ExpoSpeed;
		
		if (meter < this.Opti) this.Expo *= 1 + cs * ((this.Opti - meter) / this.Opti);
		if (meter > this.Opti) this.Expo /= 1 + cs * ((meter - this.Opti) / this.Opti);
		
		if (this.Expo > this.MaxExpo) this.Expo = this.MaxExpo;
	}
	
	this.ProjectVert = function (v, pov, rov)
	{
		v.P = new Project(v, pov, rov);
		v.P.Behind = v.P.Z > this.NearClip;
	}
	
	this.Apexize = function (v, pov, rov)
	{
		v.SW = this.Pixoom / v.P.Z;
		v.SZ = v.P.Z * v.SW;
		
		v.SX = v.P.X * v.SW + ~~(Screen.W / 2);
		v.SY = v.P.Y * v.SW + ~~(Screen.H / 2);
		
		v.SU = v.U * v.SW;
		v.SV = v.V * v.SW;
		v.SL = v.L * v.SW;
	}
	
	this.Clip = function (f, clip, b)
	{
		let zz = (clip - f.P.Z) / (b.P.Z - f.P.Z);
		
		this.P = {
			X: f.P.X + (b.P.X - f.P.X) * zz,
			Y: f.P.Y + (b.P.Y - f.P.Y) * zz,
			Z: clip
		};
		
		this.U = f.U + (b.U - f.U) * zz;
		this.V = f.V + (b.V - f.V) * zz;
		this.L = f.L + (b.L - f.L) * zz;
	}
	
	this.DrawRow = function (v0, v1, y, map)
	{
		if (v0.SX > v1.SX) { let swap = v0; v0 = v1; v1 = swap; }
		
		let x0 = Math.ceil(v0.SX); if (x0 >= Screen.W) return;
		let x1 = Math.ceil(v1.SX); if (x1 <= 0 || x0 == x1) return;
		
		if (x1 > Screen.W) x1 = Screen.W;
		
		let xx = 1 / (v1.SX - v0.SX);
		let xc = x0 - v0.SX;
		
		let zz = (v1.SZ - v0.SZ) * xx;
		let ww = (v1.SW - v0.SW) * xx;
		let uu = (v1.SU - v0.SU) * xx;
		let vv = (v1.SV - v0.SV) * xx;
		let ll = (v1.SL - v0.SL) * xx;
		
		let z = v0.SZ + xc * zz;
		let w = v0.SW + xc * ww;
		let u = v0.SU + xc * uu;
		let v = v0.SV + xc * vv;
		let l = v0.SL + xc * ll;
		
		if (x0 < 0)
		{
			let skip = 0 - x0;
			
			z += zz * skip;
			w += ww * skip;
			u += uu * skip;
			v += vv * skip;
			l += ll * skip;
			
			x0 = 0;
		}
		
		for (let x = ~~x0; x < x1; ++x)
		{
			let ep = this.YX[y][x];
			let iw = 1 / w;
			let zw = z * iw;
			
			if (ep.Z < zw)
			{
				let mv = 1;
				
				if (map)
				{
					let tu = ~~(u * iw * map.W) % map.W;
					let tv = ~~(v * iw * map.H) % map.H;
					
					if (tu < 0) tu = map.W + tu;
					if (tv < 0) tv = map.H + tv;
					
					mv = map.RawPixels[map.XY(tu, tv)];
				}
				
				ep.V = mv * (l * iw);
				ep.Z = zw;
			}
			
			z += zz;
			w += ww;
			u += uu;
			v += vv;
			l += ll;
		}
	}
	
	this.PlotEdge = function (a0, a1, map, tgt)
	{
		let y0 = Math.ceil(a0.SY);
		let y1 = Math.ceil(a1.SY);
		
		if (y1 > Screen.H) y1 = Screen.H;
		
		let yy = 1 / (a1.SY - a0.SY);
		let yc = y0 - a0.SY;
		
		let xx = (a1.SX - a0.SX) * yy;
		let zz = (a1.SZ - a0.SZ) * yy;
		let ww = (a1.SW - a0.SW) * yy;
		let uu = (a1.SU - a0.SU) * yy;
		let vv = (a1.SV - a0.SV) * yy;
		let ll = (a1.SL - a0.SL) * yy;
		
		let x = a0.SX + yc * xx;
		let z = a0.SZ + yc * zz;
		let w = a0.SW + yc * ww;
		let u = a0.SU + yc * uu;
		let v = a0.SV + yc * vv;
		let l = a0.SL + yc * ll;
		
		if (y0 < 0)
		{
			let skip = 0 - y0;
			
			x += xx * skip;
			z += zz * skip;
			w += ww * skip;
			u += uu * skip;
			v += vv * skip;
			l += ll * skip;
			
			y0 = 0;
		}
		
		for (let y = ~~y0; y < y1; ++y)
		{
			let p = tgt[y];
			
			p.SX = x; x += xx;
			p.SZ = z; z += zz;
			p.SW = w; w += ww;
			p.SU = u; u += uu;
			p.SV = v; v += vv;
			p.SL = l; l += ll;
		}
	}
	
	this.DrawTriangle = function (a0, a1, a2, map)
	{
		if (a1.SY > a2.SY) { let swap = a1; a1 = a2; a2 = swap; }
		if (a0.SY > a1.SY) { let swap = a0; a0 = a1; a1 = swap; }
		if (a1.SY > a2.SY) { let swap = a1; a1 = a2; a2 = swap; }
		
		let cy0 = Math.ceil(a0.SY);
		let cy1 = Math.ceil(a1.SY);
		let cy2 = Math.ceil(a2.SY);
		
		if (cy2 > 0 && cy0 < cy2) this.PlotEdge(a0, a2, map, this.L0); else return;
		if (cy1 >= 0 && cy0 < cy1) this.PlotEdge(a0, a1, map, this.L1);
		if (cy1 <= Screen.H && cy1 < cy2) this.PlotEdge(a1, a2, map, this.L1);
		
		let y0 = ~~Math.max(cy0, 0);
		let y2 = ~~Math.min(cy2, Screen.H);
		
		for (let y = y0; y < y2; y++)
		{
			this.DrawRow(this.L0[y], this.L1[y], y, map);
		}
	}
	
	this.ProjectFace = function (v0, v1, v2, pov, rov, map)
	{
		switch (v0.P.Behind + v1.P.Behind + v2.P.Behind)
		{
			case 0: {
				
				this.DrawTriangle(v0, v1, v2, map);
				
			} break;
			
			case 1: {
				
				let f0, f1, bk;
				
				if (v0.P.Behind) { bk = v0; f0 = v1; f1 = v2; }
				else if (v1.P.Behind) { bk = v1; f0 = v0; f1 = v2; }
				else { bk = v2; f0 = v0; f1 = v1; }
				
				let m0 = new this.Clip(f0, this.NearClip, bk);
				let m1 = new this.Clip(f1, this.NearClip, bk);
				
				this.Apexize(m0, pov, rov);
				this.Apexize(m1, pov, rov);
				
				this.DrawTriangle(f0, f1, m0, map);
				this.DrawTriangle(f1, m1, m0, map);
				
			} break;
			
			case 2: {
				
				let fr, b0, b1;
				
				if (v0.P.Behind && v1.P.Behind) { fr = v2; b0 = v0; b1 = v1; }			
				else if (v1.P.Behind && v2.P.Behind) { fr = v0; b0 = v1; b1 = v2; }
				else { fr = v1; b0 = v0; b1 = v2; }
				
				let m0 = new this.Clip(fr, this.NearClip, b0);
				let m1 = new this.Clip(fr, this.NearClip, b1);
				
				this.Apexize(m0);
				this.Apexize(m1);
				
				this.DrawTriangle(fr, m0, m1, map);
				
			} break;
		}
	}
	
	this.Recurse = function (thing, source, pov, rov, fun)
	{
		fun.call(this, thing, pov, rov);
		
		if (thing.Children) for (let ci in thing.Children)
		{
			let child = thing.Children[ci];
			if (child == source) continue;
			
			let cpov = LocP2C(pov, child.Location, child.Rotation);
			let crov = RotP2C(rov, child.Rotation);
			
			this.Recurse(child, thing, cpov, crov, fun);
		}
		
		if (thing.Parent && source != thing.Parent)
		{
			let ppov = LocC2P(pov, thing.Location, thing.Rotation);
			let prov = RotC2P(rov, thing.Rotation);
			
			this.Recurse(thing.Parent, thing, ppov, prov, fun);
		}
	}
	
	this.ProcessThing = function (thing, pov, rov)
	{
		if (thing.Process) thing.Process();
		if (thing.OnProcess) thing.OnProcess(thing, pov, rov);
	}
	
	this.ProjectThing = function (thing, pov, rov)
	{
		if (thing.Verts) thing.Verts.forEach ( function (v) {
			
			this.ProjectVert(v, pov, rov);
			this.Apexize(v, pov, rov);
			
		}, this );
	}
	
	this.RenderThing = function (thing, pov, rov)
	{
		if (thing.Faces) thing.Faces.forEach ( function (f) {
			this.ProjectFace(f[0], f[1], f[2], pov, rov, thing.Map);
		}, this );
	}
	
	this.CollectLites = function (thing, pov, rov)
	{
		if (thing.Lites) thing.Lites.forEach ( function (l) {
			
			l.P = new Project(l, pov, rov);
			this.Lites.push(l);
			
		}, this );
	}
	
	this.ApplyLites = function (thing, pov, rov)
	{
		if (!thing.Verts) return;
		
		thing.Verts.forEach ( function (v) {
			
			if (v.Normal)
			{
				v.L = this.Ambient;
			}
			
		}, this );
		
		this.Lites.forEach ( function (l) {
			
			thing.Verts.forEach ( function (v) {
				
				if (v.Normal)
				{
					let p = l.Power;
					
					if (l.Qutoff)
					{
						let qis = Qis3(v.P, l.P);
						if (qis > l.Qutoff) return;
						
						p *= 1 - qis / l.Qutoff;
					}
					
					let z = Zenith(v.P, Rotate3(v.Normal, FlipQ(rov)), l.P);
					if (z > 0) v.L += z * p; else return;
				}
				
			}, this );
			
		}, this );
	}
	
	this.Render = function (thing, pov, rov)
	{
		this.Recurse(thing, null, pov, rov, this.ProcessThing);
		this.Recurse(thing, null, pov, rov, this.ProjectThing);
		this.Recurse(thing, null, pov, rov, this.CollectLites);
		this.Recurse(thing, null, pov, rov, this.ApplyLites);
		this.Recurse(thing, null, pov, rov, this.RenderThing);
	}
}
