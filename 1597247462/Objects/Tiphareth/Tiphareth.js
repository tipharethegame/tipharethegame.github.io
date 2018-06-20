@ = function (zone, x, y)
{
	'''/Common/Lifeform'''.call(this);
	
	this.Modes =
	{
		Stand: {
			Left: {
				Straight: {
					Sprite: new Sprite ('''Straight.png''', { FX: -1 }),
					Barrel: { X: -24, Y: -5 }
				}, Up: {
					Sprite: new Sprite ('''Up.png''', { FX: -1 }),
					Barrel: { X: +5, Y: -40 }, H: 40
				}
			}, Right: {
				Straight: {
					Sprite: new Sprite ('''Straight.png'''),
					Barrel: { X: +24, Y: -5 }
				}, Up: {
					Sprite: new Sprite ('''Up.png'''),
					Barrel: { X: -5, Y: -40 }, H: 40
				}
			}
		}, Jump: {
			Left: {
				Sprite: new Sprite ('''Jump.png''', { N: 4, T: 0.05, FX: -1 }),
			}, Right: {
				Sprite: new Sprite ('''Jump.png''', { N: 4, T: 0.05 }),
			}
		}, Run: {
			Left: {
				Up: {
					Sprite: new Sprite ('''Run.U.png''', { N: 6, T: 0.1, FX: -1 }),
					Barrel: { X: -22, Y: -26 }, H: 40
				}, Straight: {
					Sprite: new Sprite ('''Run.C.png''', { N: 6, T: 0.1, FX: -1 }),
					Barrel: { X: -30, Y: -5 }, H: 40
				}, Down: {
					Sprite: new Sprite ('''Run.D.png''', { N: 6, T: 0.1, FX: -1 }),
					Barrel: { X: -24, Y: +16 }, H: 40
				}
			}, Right: {
				Up: {
					Sprite: new Sprite ('''Run.U.png''', { N: 6, T: 0.1 }),
					Barrel: { X: +22, Y: -26 }, H: 40
				}, Straight: {
					Sprite: new Sprite ('''Run.C.png''', { N: 6, T: 0.1 }),
					Barrel: { X: +30, Y: -5 }, H: 40
				}, Down: {
					Sprite: new Sprite ('''Run.D.png''', { N: 6, T: 0.1 }),
					Barrel: { X: +24, Y: +16 }, H: 40
				}
			}
		}, Duck: {
			Left: {
				Sprite: new Sprite ('''Duck.png''', { FX: -1 }),
				Barrel: { X: -30, Y: +4 }, FFB: -20
			}, Right: {
				Sprite: new Sprite ('''Duck.png'''),
				Barrel: { X: +30, Y: +4 }, FFB: -20
			}
		}, Death: {
			Left: {
				Sprite: new Sprite ('''Death.png''', { FX: -1 }), FFB: -20
			}, Right: {
				Sprite: new Sprite ('''Death.png'''), FFB: -20
			}
		}
	}
	
	this.Zone = zone;
	this.Faction = 'LJR';
	
	this.WalkingSpeed = 80;
	this.Velocity = { X: 0, Y: 0 };
	this.Facing = { X: +1, Y: 0 };
	this.Aiming = { X: +1, Y: 0 };
	this.Grounded = false;
	this.Dead = false;
	this.JumpStrength = 296;
	this.Mode = null;
	this.Health = 1;
	this.DamageSpeed = 1000;
	
	Box.FromXYWH.call(this, ~~x, ~~y, 48, 48);
	Box.PutAtB(this, ~~y);
	this.Focus = { X: this.X, Y: this.Y };
	
	this.ShotSprite = new Sprite ('''Pew.png''');
	
	this.Jump = function (x, y)
	{
		this.Grounded = false;
		
		this.Velocity.X += x * this.JumpStrength;
		this.Velocity.Y += y * this.JumpStrength;
	}
	
	this.Shoot = function ()
	{
		'''Pew.ogg'''.Play();
		
		this.Shot = { X: this.X, Y: this.Y };
		
		if (this.Mode.Barrel)
		{
			this.Shot.X += this.Mode.Barrel.X;
			this.Shot.Y += this.Mode.Barrel.Y;
		}
		
		this.Zone.Add (
			new '''/Common/Bullet''' ( this, this.X, this.Y, {
				Sprite: this.ShotSprite, Damage: Config.Get('DAMAGE', 1)
			} )
		).FireThrough (
			this.Shot.X, this.Shot.Y,
			this.Aiming.X, this.Aiming.Y,
			400, this.RVel
		);
	}
	
	this.OnFall = function (vx, vy)
	{
		if (vy >= this.DamageSpeed)
		{
			this.Hit(1, 0, 0);
		}
	}
	
	this.Hit = function (damage, dx, dy)
	{
		if (this.Dead) return;
		
		this.Health -= damage;
		if (this.Health > 0) return;
		
		if (Config.Get("GODMODE", false))
		{
			document.title = this.Health;
			return;
		}
		
		this.Dead = true;
		this.Zone.GameOver();
		
		this.Velocity.X += dx;
		
		if (this.Grounded) this.Velocity.Y = -100;
		else this.Velocity.Y += dy;
		
		if (this.Velocity.X) this.Facing.X = this.Velocity.X;
		
		this.Grounded = false;
		
		if (this.OnDeath) this.OnDeath();
	}
	
	this.Fall = function ()
	{
		this.Hit(Infinity, 0, 0);
	}
	
	this.Process = function ()
	{
		if (this.Dead)
		{
			this.Mode = this.Modes.Death[this.Facing.X < 0 ? 'Left' : 'Right'];
			
			Box.SetHFromB(this, this.Mode.H || this.Mode.Sprite.H);
			Box.SetWFromX(this, this.Mode.W || this.Mode.Sprite.W);
			
			this.Focus.X = this.Mode.FFX ? this.X + this.Mode.FFX : this.X;
			this.Focus.Y = this.Mode.FFB ? this.B + this.Mode.FFB : this.Y;
			
			if (this.Grounded) this.Stay();
			else this.Freefall();
			
			return;
		}
		
		if (this.Grounded)
		{
			if (this.Duck = Pad.Down.Down && !Pad.Left.Down && !Pad.Right.Down)
			{
				this.Walk();
				
				this.Mode = this.Modes.Duck[this.Facing.X < 0 ? 'Left' : 'Right'];
				
				Box.SetHFromB(this, this.Mode.H || this.Mode.Sprite.H);
				Box.SetWFromX(this, this.Mode.W || this.Mode.Sprite.W);
				
				this.Focus.X = this.Mode.FFX ? this.X + this.Mode.FFX : this.X;
				this.Focus.Y = this.Mode.FFB ? this.B + this.Mode.FFB : this.Y;
				
				this.Aiming.X = this.Facing.X;
				this.Aiming.Y = 0;
				this.Velocity.X = 0;
				
				if (
					Pad.A.Pressed &&
					this.Zone.ProcessCollisions(this, this.FALL, this.X, this.B, this.X, this.B + 1)
				) {
					Box.PutAtY(this, this.Y + 1); // TODO
					this.Grounded = false;
				}
			}
			else
			{
				this.Walk();
				
				if (Pad.Up.Down) this.Aiming.Y = -1;
				else if (Pad.Down.Down) this.Aiming.Y = + 1;
				else this.Aiming.Y = 0;
				
				if (Pad.Left.Down) this.Facing.X = this.Aiming.X = -1;
				else if (Pad.Right.Down) this.Facing.X = this.Aiming.X = +1;
				else if (this.Aiming.Y) this.Aiming.X = 0;
				else this.Aiming.X = this.Facing.X;
				
				if (Pad.Left.Down || Pad.Right.Down) this.Velocity.X = this.Facing.X * this.WalkingSpeed;
				else this.Velocity.X = 0;
				
				var face = this.Facing.X < 0 ? 'Left' : 'Right';
				var aim = this.Aiming.Y < 0 ? 'Up' : this.Aiming.Y > 0 ? 'Down' : 'Straight';
				
				if (this.Velocity.X)
				{
					var oldMode = this.Mode;
					
					this.Mode = this.Modes.Run[face][aim];
					
					this.Mode.Sprite.Frame = oldMode.Sprite.Frame;
					this.Mode.Sprite.Elapsed = oldMode.Sprite.Elapsed;
				}
				else this.Mode = this.Modes.Stand[face][aim];
				
				Box.SetHFromB(this, this.Mode.H || this.Mode.Sprite.H);
				Box.SetWFromX(this, this.Mode.W || this.Mode.Sprite.W);
				
				this.Focus.X = this.Mode.FFX ? this.X + this.Mode.FFX : this.X;
				this.Focus.Y = this.Mode.FFB ? this.B + this.Mode.FFB : this.Y;
				
				if (Pad.A.Pressed) this.Jump(0, -1);
			}
		}
		else
		{
			this.Freefall();
			
			if (Pad.Up.Down) this.Aiming.Y = -1;
			else if (Pad.Down.Down) this.Aiming.Y = +1;
			else this.Aiming.Y = 0;
			
			if (Pad.Left.Down) this.Facing.X = this.Aiming.X = -1;
			else if (Pad.Right.Down) this.Facing.X = this.Aiming.X = +1;
			else if (this.Aiming.Y) this.Aiming.X = 0;
			else this.Aiming.X = this.Facing.X;
			
			if (Pad.Left.Down || Pad.Right.Down) this.Velocity.X = this.Facing.X * 80;
			
			this.Mode = this.Modes.Jump[this.Facing.X < 0 ? 'Left' : 'Right'];
			
			Box.SetHFromY(this, this.Mode.H || this.Mode.Sprite.H);
			Box.SetWFromX(this, this.Mode.W || this.Mode.Sprite.W);
			
			this.Focus.X = this.Mode.FFX ? this.X + this.Mode.FFX : this.X;
			this.Focus.Y = this.Mode.FFB ? this.B + this.Mode.FFB : this.Y;
		}
		
		if (Pad.B.Pressed) this.Shoot();
		this.RVel = null;
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw ( this.Mode.Sprite,
			this.X + (this.PX - this.Mode.Sprite.PivotX),
			this.Y + (this.PY - this.Mode.Sprite.PivotY)
		);
		
		if (this.Shot)
		{
			this.Zone.Draw(this.ShotSprite, this.Shot.X, this.Shot.Y);
			this.Shot = null;
		}
	}
}
