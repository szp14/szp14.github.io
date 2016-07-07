var eventQueue = [];

var block = document.getElementsByClassName('chatBlock animaMoveUp')[0];
blockListener = function()
{
	block.removeEventListener('webkitAnimationEnd', blockListener);
	this.style.animationPlayState = 'paused';
	var firstBar = this.children[0];
	this.removeChild(firstBar);
	this.classList.remove('animaMoveUp');
	this.offsetWidth = this.offsetWidth;
	this.classList.add('animaMoveUp');
}


function createNewBar(message)
{
	var newBar = document.createElement('div');
	newBar.className = 'chatBar';

	var newImg = document.createElement('div');
	newImg.className = 'chatImg';
	newImg.style.backgroundImage = "url(" + message.headimgurl + ")";
	newImg.style.font
	newImg.innerText = message.nickname;
	var newInfo = document.createElement('div');
	newInfo.className = 'chatInfo';
	newInfo.innerHTML = "<marquee scrollamount = '50'>" + message.content + "</marquee>";

	newBar.appendChild(newImg);
	newBar.appendChild(newInfo);
	return newBar;
}

var socket = io.connect('https://wall.cgcgbcbc.com');

socket.on('connect', function(){
	console.log('connect');
})

socket.on('new message', function (message) 
{
	var newBar = createNewBar(message);
	eventQueue.push(newBar);
});


function bulletinInfo(message)
{ 
	var board = document.getElementsByClassName('bulletin')[0];
	board.innerHTML = "<marquee scrollamount = '50'>" + message.nickname + ' ' + message.content + "</marquee>";
	setTimeout(function()
	{
		board.innerHTML = '';
	}, 10000);
}

socket.on('admin', function (message) 
{
	bulletinInfo(message);
});

function updateInfo()
{
	var newBar = eventQueue.shift();
	block.appendChild(newBar);
	block.addEventListener('webkitAnimationEnd', blockListener, false);
	block.style.animationPlayState = 'running';	
}

setInterval(function()
{
	if(eventQueue.length > 0)
	{
		updateInfo();
	}
}, 200);

function load()
{
	var ajax = new XMLHttpRequest();
  	ajax.onreadystatechange = function()
  	{
  		if (ajax.readyState == 4 && ajax.status == 200)
  		{
  			var history = JSON.parse(ajax.responseText);
       		for(var i = 2; i >= 0; i--)
       		{
        		var newBar = createNewBar(history[i]);
				block.appendChild(newBar);
       		}
     	}
  	};
	ajax.open("GET","https://wall.cgcgbcbc.com/api/messages?num=3", true);
	ajax.send();
}