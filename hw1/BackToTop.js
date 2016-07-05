var mybtn = document.getElementById('backToTop');
var timer;
var rateScro = 1;
var distScro = 10;
mybtn.addEventListener('click', function()
{
	timer = setInterval("goUp()", rateScro);
	
})

function goUp()
{
	if(window.scrollY > distScro)
	{
		window.scrollTo(0, window.scrollY - distScro);
	}
	else
	{
		window.scrollTo(0, 0);
		clearInterval(timer);
	}
}

window.onscroll = function()
{
	if(scrollY === 0)
	{
		mybtn.style.display = 'none';
	}
	else
	{
		mybtn.style.display = '';
	}
};

//control+option+t in Mac
mybtn.accessKey = 't';

mybtn.init = function(initCond)
{
	this.style.display = 'none';
	this.style.position = 'fixed';
	this.style.cursor = 'pointer';
	var webW = document.body.clientWidth;
	var webH = document.body.clientHeight;

	this.style.width = '100px';
	this.style.height = '50px';

	if(initCond.LeftUp === true)
	{
		this.style.top = '0';
		this.style.left = '0';
	}
	else if(initCond.LeftDown === true)
	{
		this.style.bottom = '0';
		this.style.left = '0';
	}
	else if(initCond.RightUp === true)
	{
		this.style.top = '0';
		this.style.right = '0';
	}
	else if(initCond.RightDown === true)
	{
		this.style.bottom = '0';
		this.style.right = '0';
	}
	else if(typeof initCond.x === 'number' && initCond.y === 'number')
	{
		if(0 <= initCond.x && initCond.x <= webW - this.style.width &&
			0 <= initCond.y && initCond.y <= webH - this.style.height)
		{
			this.style.top = initCond.x;
			this.style.left = initCond.y;
		}
	}
}