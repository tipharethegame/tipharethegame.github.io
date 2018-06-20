Clock =
{
	FPS: Config.Get("FPS", 30),
	
	Start: function (callfun)
	{
		this.Call = callfun;
		this.Factor = 1 / Clock.FPS;
		
		if (this.interval) clearInterval(this.interval);
		this.interval = setInterval(this.Call, this.Factor * 1000);
		
		this.Running = true;
	},
	
	Stop: function ()
	{
		if (this.interval) clearInterval(this.interval);
		this.interval = null;
		this.Running = false;
	}
}

function Timer (period)
{
	this.Period = period;
	this.Elapsed = 0;
	
	this.Tick = function ()
	{
		this.Elapsed += Clock.Factor;
		if (this.Elapsed < this.Period) return false;
		else { this.Elapsed = 0; return true; }
	}
}

function RTimer (min, max)
{
	this.Next = function ()
	{
		this.Elapsed = 0;
		this.Period = Randge(min, max);
	}
	
	this.Tick = function ()
	{
		this.Elapsed += Clock.Factor;
		if (this.Elapsed < this.Period) return false;
		else { this.Next(); return true; }
	}
	
	this.Next();
}

function Delay (that, t, f)
{
	return setTimeout(function () { f.call(that) }, t * 1000);
}

function Speedometer (subj)
{
	this.Subject = subj;
	
	this.X = 0;
	this.Y = 0;
	
	this.OldX = this.Subject.X;
	this.OldY = this.Subject.Y;
	
	this.Measure = function ()
	{
		this.X = (this.Subject.X - this.OldX) * Clock.FPS;
		this.Y = (this.Subject.Y - this.OldY) * Clock.FPS;
		
		this.OldX = this.Subject.X;
		this.OldY = this.Subject.Y;
	}
}

function ProbSec (prob)
{
	return Math.random() <= Clock.Factor * prob;
}
