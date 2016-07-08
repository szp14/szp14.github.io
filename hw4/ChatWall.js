var eventQueue = [];
var timer;
var isProtected = false;

var block = document.getElementsByClassName('chatBlock animaMoveUp')[0];

function protectFirstBar(ok)
{
	var parent = block.parentNode;  //chatFixedBlock
	var grandp = parent.parentNode; //mainWindow
	if(ok == true)
	{
		var firstBar = block.children[0];
		var secondBar = block.children[1];
		var thirdBar = block.children[2];
		block.removeChild(firstBar);

		firstBar.style.height = '27%';
		secondBar.style.height = '50%';
		thirdBar.style.height = '50%';
		parent.style.height = '53%';
		firstBar.children[0].children[2].src = 'icon.jpg';
		firstBar.children[0].children[0].innerText = 'admin';

		grandp.removeChild(parent);
		grandp.appendChild(firstBar);
		grandp.appendChild(parent);
	}
	else
	{
		var firstBar = grandp.children[1];
		grandp.removeChild(firstBar);
		var secondBar = block.children[0];
		var thirdBar = block.children[1];
		block.removeChild(secondBar);
		block.removeChild(thirdBar);

		parent.style.height = '80%';
		firstBar.style.height = '33%';
		secondBar.style.height = '33%';
		thirdBar.style.height = '33%';
		block.appendChild(firstBar);
		block.appendChild(secondBar);
		block.appendChild(thirdBar);
	}
}

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

	var name = document.createElement('div');
	name.className = 'imgName';
	name.innerText = message.nickname;
	newImg.appendChild(name);

	var bkImg = document.createElement('img');
	bkImg.src = 'loading.gif';
	bkImg.style.width = '100px';
	bkImg.style.height = '100px';
	bkImg.style.position = 'absolute';
	bkImg.style.bottom = '0';
	bkImg.style.left = '20px';
	newImg.appendChild(bkImg);

	var bkImg2 = document.createElement('img');
	bkImg2.src = message.headimgurl;
	bkImg2.style.width = '100px';
	bkImg2.style.height = '100px';
	bkImg2.style.position = 'absolute';
	bkImg2.style.bottom = '0';
	bkImg2.style.left = '20px';
	bkImg2.style.display = 'none';
	bkImg2.onload = function()
	{
		this.previousSibling.style.display = 'none';
		this.style.display = '';
	}
	newImg.appendChild(bkImg2);

	var newInfo = document.createElement('div');
	newInfo.className = 'chatInfo';
	if(message.content.length * 50 > 960)
	{
		newInfo.innerHTML = "<marquee scrollamount = '50'>" + message.content + "</marquee>";
	}
	else
	{
		newInfo.innerHTML =  message.content;
	}

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
	if(isProtected == false)
	{
		protectFirstBar(isProtected = !isProtected);
	}
	clearTimeout(timer);
	var info = block.parentNode.parentNode.children[1].children[1];
	info.innerHTML = "<marquee scrollamount = '50' style = 'color: red'>" + message.content + "</marquee>";
	timer = setTimeout(function()
	{
		protectFirstBar(isProtected = !isProtected);
	}, 10000);
}

socket.on('admin', function (message) 
{
	bulletinInfo(message);
});

function updateInfo()
{
	var newBar = eventQueue.shift();
	newBar.style.height = isProtected ? '50%' : '33%';
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
}, 300);

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