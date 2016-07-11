var mineArea;
var remainingMine;
var remainingBlock;
var gameStatus;
//0: gameover; 
//1: running in normal mode
//2: after initializing but before running in normal mode
//3: running in loop mode
//4: after initializing but before running in loop mode
var begTime;
var blockEdge = 30;
var lastX, lastY;
var dragging = false;

function chooseBlock(i, j)
{
	if(gameStatus == 1) return $('#b' + i + '-' + j);
	var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
	var ii = i < 1 ? lenX : (i > lenX ? 1 : i);
	var jj = j < 1 ? lenY : (j > lenY ? 1 : j);
	var allBlocks = $('#b' + ii + '-' + jj);
	if(ii == 1 || jj == 1 || ii == lenX || jj == lenY)
	{
		var mI = ii == 1 ? lenX + 1 : (ii == lenX ? 0 : ii);
		var mJ = jj == 1 ? lenY + 1 : (jj == lenY ? 0 : jj);
		if(mI != ii && mJ != jj)
			allBlocks = $('#b' + ii + '-' + jj + ',' + '#b' + mI + '-' + mJ + 
				',' + '#b' + ii + '-' + mJ + ',' + '#b' + mI + '-' + jj);
		else
			allBlocks = $('#b' + ii + '-' + jj + ',' + '#b' + mI + '-' + mJ);
	}
	return allBlocks;
}

$(function()
{
	$('#gamemain').mouseup(function(e)
	{
		var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
		dragging = false;
		var clickBlock = $(e.target);
		var id = clickBlock.attr('id');
		var	x = parseInt(id.substring(1, id.indexOf('-'))); 
		var	y = parseInt(id.substring(id.indexOf('-') + 1));
		if(x < 1 || x > lenX || y < 1 || y > lenY) return;
		if(gameStatus == 1)
		{
			x = lastX;
			y = lastY;
		}
		clickBlock = chooseBlock(x, y);
		if(gameStatus == 1 || gameStatus == 3)
		{
			if(e.which == 1)
			{
				if(clickBlock.hasClass('hidden'))
				{
					gameStatus == 1 ? sweepBlock(x, y) : sweepBlockLoop(x, y);
				}
				else if(!clickBlock.hasClass('flag'))
				{
					gameStatus == 1 ? sweepBlockAround(x, y) : sweepBlockAroundLoop(x, y);
					for(var i = x - 1; i <= x + 1; i++)
					{
						for(var j = y - 1; j <= y + 1; j++)
						{
							var block = chooseBlock(i, j);
							if(block.hasClass('hint')) block.removeClass('hint');
						}
					}
				}
			}
			else if(e.which == 3 && (clickBlock.hasClass('hidden') || clickBlock.hasClass('flag')))
			{
				if(clickBlock.hasClass('flag'))
				{
					clickBlock.removeClass('flag');
					clickBlock.addClass('hidden');
					remainingMine++;
					remainingBlock++;
				}
				else
				{
					clickBlock.removeClass('hidden');
					clickBlock.addClass('flag');
					remainingMine--;
					remainingBlock--;
				}
				$('#gamelastnum').text(remainingMine);
			}
			if(remainingMine == remainingBlock) gameover(true);
		}
		else if(gameStatus == 2 || gameStatus == 4)
		{
			if(e.which == 1)
			{
				gameStatus == 2 ? sweepBlock(x, y) : sweepBlockLoop(x, y);
				begTime = (new Date()).getTime();
				startTimer();
			}
		}
	});
	$('#gamemain').mousedown(function(e)
	{
		var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
		var clickBlock = $(e.target);
		var id = clickBlock.attr('id');
		var	x = parseInt(id.substring(1, id.indexOf('-'))); 
		var	y = parseInt(id.substring(id.indexOf('-') + 1));
		clickBlock = chooseBlock(x, y);
		lastX = x, lastY = y;
		if(x < 1 || x > lenX || y < 1 || y > lenY) return;
		if(gameStatus == 1 || gameStatus == 3)
		{
			dragging = true;
			if(e.which == 1)
			{
				if(!clickBlock.hasClass('hidden') && !clickBlock.hasClass('flag'))
				{
					for(var i = x - 1; i <= x + 1; i++)
					{
						for(var j = y - 1; j <= y + 1; j++)
						{
							var block = chooseBlock(i, j);
							if(block.hasClass('hidden')) block.addClass('hint');
						}
					}
				}
			}
		}
	});
	$('#gamemain').mousemove(function(e)
	{
		if(dragging == true && gameStatus == 3)
		{
			var clickBlock = $(e.target);
			var id = clickBlock.attr('id');
			var	x = parseInt(id.substring(1, id.indexOf('-'))); 
			var	y = parseInt(id.substring(id.indexOf('-') + 1));
			var dict = {x: x - lastX, y: y - lastY};
			lastX = x, lastY = y;
			moveMineArea(dict);
		}
	});
	$('body').keydown(function(e)
	{
		if(gameStatus == 3)
		{
			var key = String.fromCharCode(e.which);
			var dict = {x: 0, y: 0};
			switch(key)
			{
			case 'W':
				dict.y = -1;
				break;
			case 'A':
				dict.x = -1;
				break;
			case 'S':
				dict.y = 1;
				break;
			case 'D':
				dict.x = 1;
				break;
			}
			moveMineArea(dict);
		}
	});
	$('#gamemain').bind('contextmenu', function() {return false;});
});

function moveMineArea(dict)
{
	if(dict.x == 0 && dict.y == 0) return;
	var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
	var temArea = new Array(lenX + 2);
	$.each(temArea, function(row) {temArea[row] = new Array(lenY + 2);});
	for(var i = 1; i <= lenX; i++)
	{
		for(var j = 1; j <= lenY; j++)
		{
			var ii = (i + dict.x - 1 + lenX) % lenX + 1;
			var jj = (j + dict.y - 1 + lenY) % lenY + 1;
			temArea[ii][jj] = mineArea[i][j];
		}
	}
	delete mineArea;
	mineArea = temArea;
	var area = '';
	for(var i = 0; i <= lenX + 1; i++)
	{
		for(var j = 0; j <= lenY + 1; j++)
		{
			var i0 = i, j0 = j;
			if(i == 0 || i == lenX + 1 || j == 0 || j == lenY + 1)
			{
				i0 = i < 1 ? lenX : (i > lenX ? 1 : i);
				j0 = j < 1 ? lenY : (j > lenY ? 1 : j);
			}
			var ii = (i0 - dict.x - 1 + lenX) % lenX + 1;
			var jj = (j0 - dict.y - 1 + lenY) % lenY + 1;
			var block = $('#b' + ii + '-' + jj);
			var number = '', classType = block.attr('class');
			if(i0 != i || j0 != j) classType += ' translucent';
			if(block.attr('class').indexOf('num') != -1) 
				number = block.attr('class')[3];
			area += "<div id = 'b" + i + '-' + j + 
				"' style = 'left: " + (i - 1) * blockEdge + 
				"px; top: " + (j - 1) * blockEdge + "px;' class = '" + classType +
				 "'>" + number + "</div>";
		}
	}
	$('#gamemain').html(area).width(lenX * blockEdge).height(lenY * blockEdge).show();
}

function startTimer()
{
	if(gameStatus == 1 || gameStatus == 3)
	{
		var timeNow = (new Date()).getTime();
		$('#gametime').text(Math.ceil((timeNow - begTime) / 1000));
		setTimeout('startTimer()', 500);
	} 
	else if(gameStatus == 2 || gameStatus == 4) $('#gametime').text('0');
}

function gameover(win)
{
	var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
	var originMode = gameStatus;
	gameStatus = 0;
	if(win)
	{
		remainingMine = 0;
		$('#gamelastnum').text(remainingMine);
	}
	for(var i = 1; i <= lenX; i++)
	{
		for(var j = 1; j <= lenY; j++)
		{
			if(win)
			{
				var block = chooseBlock(i, j);
				if(block.hasClass('hidden'))
				{
					block.removeClass('hidden');
					block.addClass('flag');
				}
			}
			else originMode == 1 ? sweepBlock(i, j) : sweepBlockLoop(i, j);
		}
	}
	result(win);
	//$('#gamewarning').text(win ? 'Congratulation! You win!' : 'Sorry, you lose.');
}