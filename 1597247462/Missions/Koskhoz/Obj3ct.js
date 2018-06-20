@ = function (parent)
{
	this.Location = { X: 0, Y: 0, Z: 0 };
	this.Rotation = { X: 0, Y: 0, Z: 0, W: 1 };
	this.Velocity = { X: 0, Y: 0, Z: 0 };
	this.Angular = { X: 0, Y: 0, Z: 0, W: 1 };
	
	this.ApplyPhysics = function ()
	{
		// TODO: time
		
		this.Rotation = Turn(this.Rotation, this.Angular);
		this.Location = Add3(this.Location, this.Velocity);
	}
	
	this.Process = this.ApplyPhysics;
	
	this.Prepare = function ()
	{
		for (let fi in this.Faces)
		{
			let f = this.Faces[fi];
			
			for (let ai in f)
			{
				f[ai] = this.Verts[f[ai]];
			}
		}
	}
}
