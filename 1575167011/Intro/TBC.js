@ = function ()
{
	this.Text = new '''/Common/Text'''("TO BE CONTINUED");
	this.Text.CenterBlock();
	
	this.Render = function ()
	{
		Screen.Blank();
		this.Text.Draw();
	}
}
