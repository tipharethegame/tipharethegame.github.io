Config =
{
	Get: function (key, defval)
	{
		if (key in window) return window[key];
		else return defval;
	},
	
	Set: function (key, val)
	{
		window[key] = val;
	},
}

var kvs = location.search.substr(1).split(',');
for (var i in kvs) { var kv = kvs[i].split(':'); window[kv[0]] = kv[1]; }
