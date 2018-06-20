@ = function ()
{
	'''Obj3ct'''.call(this);
	
	this.SpentFuel = 0;
	this.LinearThrust = 0.02;
	this.AngularThrust = 0.01;
	
	this.HitBox = {
		L: -1, R: +1,
		B: -1, T: -1,
		F: -3, A: +3
	};
	
	this.Lites = [{
		X: 0, Y: 0, Z: 0,
		Power: 0.1, Qutoff: 20 * 20
	}];
	
	this.GoPYR = function (p, y, r)
	{
		let t = Clock.Factor * this.AngularThrust;
		let tp = p * t, ty = y * t, tr = r * t;
		this.SpentFuel += Math.abs(tp) + Math.abs(ty) + Math.abs(tr);
		
		this.Angular = Turn ( this.Angular,
			RotFromPYR(tp, ty, tr)
		);
	}
	
	this.GoXYZ = function (x, y, z)
	{
		let t = Clock.Factor * this.LinearThrust;
		let tx = x * t, ty = y * t, tz = z * t;
		this.SpentFuel += Math.abs(tx) + Math.abs(ty) + Math.abs(tz);
		
		this.Velocity = Add3 ( this.Velocity,
			Rotate3 (
				{ X: tx, Y: ty, Z: tz },
				this.Rotation
			)
		);
	}
	
	this.Thrusters = {
		AP: new @.Thruster(), AY: new @.Thruster(), AR: new @.Thruster(),
		LX: new @.Thruster(), LY: new @.Thruster(), LZ: new @.Thruster(),
	};
	
	this.Process = function ()
	{
		let ap = this.Thrusters.AP.Thrust;
		let ay = this.Thrusters.AY.Thrust;
		let ar = this.Thrusters.AR.Thrust;
		let lx = this.Thrusters.LX.Thrust;
		let ly = this.Thrusters.LY.Thrust;
		let lz = this.Thrusters.LZ.Thrust;
		
		if (ap || ay || ar || lx || ly || lz)
		{
			this.GoPYR(ap, ay, ar);
			this.GoXYZ(lx, ly, lz);
		}
		
		this.ApplyPhysics();
	}
	
	if (Config.Get('FREE'))
	{
		let fRotSp = 0.25;
		let fMovSp = 10;
		
		this.GoPYR = function (p, y, r)
		{
			let ct = Clock.Factor * fRotSp;
			
			this.Rotation = Turn ( this.Rotation,
				RotFromPYR(p * ct, y * ct, r * ct)
			);
		}
		
		this.GoXYZ = function (x, y, z)
		{
			let ct = Clock.Factor * fMovSp;
			
			this.Location = Add3 ( this.Location,
				Rotate3({ X: x * ct, Y: y * ct, Z: z * ct }, this.Rotation)
			);
		}
	}
	
	this.Controls = {
		[Kbd.Up]: { T: 'AP', V: +1 }, [Kbd.Down]: { T: 'AP', V: -1 },
		[Kbd.Left]: { T: 'AY', V: +1 }, [Kbd.Right]: { T: 'AY', V: -1 },
		[Kbd.Z]: { T: 'AR', V: +1 }, [Kbd.C]: { T: 'AR', V: -1 },
		[Kbd.W]: { T: 'LZ', V: -1 }, [Kbd.S]: { T: 'LZ', V: +1 },
		[Kbd.A]: { T: 'LX', V: -1 }, [Kbd.D]: { T: 'LX', V: +1 },
		[Kbd.Q]: { T: 'LY', V: -1 }, [Kbd.E]: { T: 'LY', V: +1 },
	};
	
	Input.OnKeyDown = function (k) {
		if (!(k in this.Controls)) return;
		let c = this.Controls[k];
		this.Thrusters[c.T].Start(c.V);
	}
	
	Input.OnKeyUp = function (k) {
		if (!(k in this.Controls)) return;
		this.Thrusters[this.Controls[k].T].Stop();
	}
	
	Input.CbTgt = this;
}


@.Farts = 0;
@.Thruster = function ()
{
	this.Thrust = 0;
	
	this.Start = function (t)
	{
		if (this.Thrust) return;
		
		this.Thrust = t;
		
		'''Fart.ogg'''.Loop(0.1, 0.9);
		@.Farts++;
	}
	
	this.Stop = function ()
	{
		if (!this.Thrust) return;
		this.Thrust = 0;
		if (--@.Farts == 0) '''Fart.ogg'''.Stop();
	}
}