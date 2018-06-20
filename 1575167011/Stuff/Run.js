RunningID = null;
Running = null;
JumpTo = null;

Scheduled = [];
Loaded = [];
Ready = [];


SrcSeed = new Date().getTime();

IdToSrc = function (id)
{
	return PREFIX + id + '?' + SrcSeed;
}

DirFromId = function (id)
{
	let sep = id.lastIndexOf('/');
	if (sep != -1) return id.substr(0, sep + 1);
	else return '';
}

RelToAbs = function (id, rel)
{
	if (rel[rel.length - 1] == '/')
	{
		var spl = rel.split('/');
		rel += spl[spl.length - 2];
	}
	
	if (rel.indexOf('.') == -1) rel += '.js'; 
	
	if (rel[0] == '/') return rel.substr(1);
	else if (id) return DirFromId(id) + rel;
	else return rel;
}


function Schedule (id, o) { Scheduled.push(Scheduled[id] = o); }
function SetLoaded (id, o) { Loaded.push(Loaded[id] = o); }
function SetReady (id, o) { Ready.push(Ready[id] = o); }


function Load (id)
{
	if (
		id in Scheduled ||
		id in Loaded ||
		id in Ready
	) return;
	
	switch (id.split('.').pop())
	{
		case 'js' : Schedule(id, new Script(id)); break;
		case 'png': Schedule(id, new Raster.FromFile(id)); break;
		case 'ogg': Schedule(id, new Clip(id)); break;
	}
}


function Render ()
{
	if (JumpTo)
	{
		if (JumpTo == RunningID)
		{
			Running = new Ready[RunningID];
		}
		else
		{
			for (var i = 0; i < Scheduled.length; i++)
			{
				if (Scheduled[i].Dispose) Scheduled[i].Dispose();
			}
			
			Scheduled = [];
			Loaded = [];
			Ready = [];
			
			Running = null;
			RunningID = JumpTo;
			Load(RunningID);
		}
		
		JumpTo = null;
	}
	
	Screen.C2D.clearRect(0, 0, Screen.W, Screen.H);
	
	if (Loaded.length < Scheduled.length) return;
	else if (Ready.length < Loaded.length) {
		for (var i = Loaded.length - 1; i >= 0; i--) Loaded[i].Realize();
		Running = new Ready[RunningID]();
	}
	
	Running.Render();
	
	Input.Forget();
	Screen.Expose();
}


function Jump (id)
{
	if (!id) JumpTo = RunningID;
	else JumpTo = RelToAbs(RunningID, id);
}


window.addEventListener ("load", function () {
	
	Jump(Config.Get('START', START));
	
	Clock.Start ( function () {
		
		try { Render(); }
		catch (e) {
			console.error(e);
			Clock.Stop();
		}
		
	} );
	
} );
