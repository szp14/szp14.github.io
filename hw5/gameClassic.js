function init(lenX, lenY, numMine, clickX, clickY)
{
	remainingBlock = lenX * lenY;
	gameStatus = 2;
	remainingMine = numMine;
	mineArea = new Array(lenX + 2);
	$.each(mineArea, function(row) {mineArea[row] = new Array(lenY + 2);});
	for(var i = 1; i <= lenX; i++)
		for(var j = 1; j <= lenY; j++)
			mineArea[i][j] = 0;
	while(numMine > 0)
	{
		var i = Math.ceil(Math.random() * lenX);
		var j = Math.ceil(Math.random() * lenY);
		var ok;
		if(clickX == undefined) ok = true;
		else if(Math.abs(i - clickX) <= 1 && Math.abs(j - clickY) <= 1) ok = false;
		else ok = true;
		if(mineArea[i][j] != -1 && ok)
		{
			mineArea[i][j] = -1;
			numMine--;
		}
	}
	for(var x = 1; x <= lenX; x++)
		for(var y = 1; y <= lenY; y++)
			if(mineArea[x][y] != -1)
				for(var i = x - 1; i <= x + 1; i++)
					for(var j = y - 1; j <= y + 1; j++)
						if(i >= 1 && i <= lenX && j >= 1 && j <= lenY && mineArea[i][j] == -1)
							mineArea[x][y]++;
	var area = '';
	for(var i = 1; i <= lenX; i++)
		for(var j = 1; j <= lenY; j++)
			area += "<div id = 'b" + i + '-' + j + 
				"' style = 'left: " + (i - 1) * blockEdge + 
				"px; top: " + (j - 1) * blockEdge + "px;' class = 'hidden'></div>";
	$('#gamemain').html(area).width(lenX * blockEdge).height(lenY * blockEdge).show();
	$('#gamewarning').html('');
	$('#gamesubmenu').show();
	$('#gamelastnum').text(remainingMine);
}

function sweepBlock(x, y)
{
	var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
	var block = $('#b' + x + '-' + y);
	if(gameStatus == 2 && mineArea[x][y] != 0)
	{
		init(lenX, lenY, remainingMine, x, y);
		sweepBlock(x, y);
		return;
	}
	if(mineArea[x][y] == -1)
	{
		switch(gameStatus)
		{
		case 1:
			block.removeClass('hidden')
			block.addClass('bomb');
			gameover(false);
			break;
		default:
			if(block.hasClass('hidden')) 
			{
				block.removeClass('hidden');
				block.addClass('bomb');
			}
			break;
		}
	}
	else if(mineArea[x][y] >= 0)
	{
		if(block.hasClass('flag'))
		{
			block.removeClass('flag')
			block.addClass('wrong');
			if(gameStatus == 1) gameover(false);
		}
		else if(mineArea[x][y] > 0)
		{
			block.removeClass('hidden');
			block.html(mineArea[x][y]).addClass('num' + mineArea[x][y]);
			if(gameStatus == 1) remainingBlock--;
		}
		else
		{
			play_sound(2);
			block.removeClass('hidden');
			block.addClass('clear');
			if(gameStatus == 1 || gameStatus == 2)
			{
				gameStatus = 1;
				remainingBlock--;
				for(var i = x - 1; i <= x + 1; i++)
					for(var j = y - 1; j <= y + 1; j++)
						if(i >= 1 && i <= lenX &&
							j >= 1 && j <= lenY &&
							$('#b' + i + '-' + j).hasClass('hidden'))
							sweepBlock(i, j);
			}
		}
	}
}

function sweepBlockAround(x, y)
{
	var numFlag = 0, numHidden = 0;
	for(var i = x - 1; i <= x + 1; i++)
	{
		for(var j = y - 1; j <= y + 1; j++)
		{
			if(mineArea[i][j] != undefined)
			{
				var block = $('#b' + i + '-' + j);
				if(block.hasClass('flag')) 
				{
					if(mineArea[i][j] != -1) 
					{
						gameover(false);
						return;
					}
					numFlag++;
					numHidden++;
				}
				else if(block.hasClass('hidden')) numHidden++;
			}
		}
	}
	if(numFlag == mineArea[x][y] && numHidden > numFlag)
	{
		for(var i = x - 1; i <= x + 1; i++)
		{
			for(var j = y - 1; j <= y + 1; j++)
			{
				var block = $('#b' + i + '-' + j);
				if(mineArea[i][j] >= 0 && block.hasClass('hidden'))
					sweepBlock(i, j);
			}
		}
	}
}