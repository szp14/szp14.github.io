var mode = 0;

$(document).ready(function()
{
	$("#classic").click(function()
	{
		change_mode(0);
	});
	$("#loop").click(function()
	{
		change_mode(1);
	});
	$("#easy").click(function()
	{
		if(mode == 0)
		{
			init(10, 10, 10);
		}
		else if(mode == 1)
		{
			initLoop(10, 10, 10);
		}
		adjust(10, 10);
	});
	$("#normal").click(function()
	{
		if(mode == 0)
		{
			init(16, 16, 40);
		}
		else if(mode == 1)
		{
			initLoop(16, 16, 40);
		}
		adjust(16, 16);
	});
	$("#hard").click(function()
	{
		if(mode == 0)
		{
			init(30, 16, 99);
		}
		else if(mode == 1)
		{
			initLoop(30, 16, 99);
		}
		adjust(30, 16);
	});
	$("#custom").click(function()
	{
		$("#option").slideToggle("slow");
	});
	$("#start").click(function()
	{
		custom_init();
	});
	$("#help").click(function()
	{
		$("#gamehelp").slideToggle("slow");
	});
	$("#result").click(function()
	{
		$("#result")[0].style.display = "none";
	});
	document.getElementById("soundlose").volume = 0.1;
	document.getElementById("soundwin").volume = 0.1;
	document.getElementById("soundexpand").volume = 0.1;
});

function change_mode(m)
{
	mode = m;
	if(m == 0)
	{
		$("#classic").css("border-color", "#000000");
		$("#loop").css("border-color", "#066000");
	}
	else
	{
		$("#classic").css("border-color", "#066000");
		$("#loop").css("border-color", "#000000");
	}
}

function custom_init()
{
	var x = $("#widthnum").attr("value") - 0;
	var y = $("#heightnum").attr("value") - 0;
	var m = $("#minenum").attr("value") - 0;
	if(x < 5)
	{
		x = 5;
	}
	if(x > 30)
	{
		x = 30;
	}
	if(y < 5)
	{
		y = 5;
	}
	if(y > 30)
	{
		y = 30;
	}
	if(y > x)
	{
		var temp = y;
		y = x;
		x = temp;
	}
	if(m < x * y * 0.05)
	{
		m = Math.ceil(y * x * 0.05);
	}
	if(m > x * y * 0.3)
	{
		m = Math.floor(y * x * 0.3);
	}
	$("#widthnum").attr("value", x);
	$("#heightnum").attr("value", y);
	$("#minenum").attr("value", m);
	
	if(mode == 0)
	{
		init(x, y, m);
	}
	if(mode == 1)
	{
		initLoop(x, y, m);
	}
	adjust(x, y);
}

function adjust(x, y)
{
	$("#result")[0].style.display = "none";
	var r = get_rate(x, y);
	$("#gamemain")[0].style.webkitTransform = "scale(" + r + ")";
	
	var dh = $(document).height() - $(window).height();
	$('html, body').animate({scrollTop: dh}, 'slow');
	$('#gametime').text('0');
}

function get_rate(x, y)
{
	var width = $(window).width();
	var height = $(window).height();
	var rate = 1;
	if(x * 30 > width * 0.95)
	{
		rate = 1;
	}
	else if(y * 30 < height * 0.7)
	{
		rate = height * 0.7 / (y * 30);
		if(rate > 5/3)
		{
			rate = 5/3;
		}
		if(x * 30 * rate > width * 0.95)
		{
			rate = width * 0.95 / (x * 30);
		}
	}
	return rate;
}

function result(win)
{
	play_sound(win);
	var w = $("#result")[0];
	w.style.top = $(document).scrollTop() + 0.5 * $(window).height() + "px";
	w.style.display = "block";
	if(win == 0)
	{
		$("#ending")[0].style.backgroundPosition = "bottom left";
	}
	else
	{
		$("#ending")[0].style.backgroundPosition = "top left";
	}		
}

function play_sound(x)
{
	if(x == 0)
	{
		document.getElementById("soundlose").play();
	}
	else if(x == 1)
	{
		document.getElementById("soundwin").play();
	}
	else if(x == 2)
	{
		document.getElementById("soundexpand").play();
	}
}