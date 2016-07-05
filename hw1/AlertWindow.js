var Modal = new Object();

Modal.init = function(initCond)
{
	  this.content = typeof initCond.content === 'string' ? initCond.content : '';
	  this.draggable = initCond.draggable === false ? false : true;
	  this.closeKey = typeof initCond.closeKey === 'number' ? initCond.closeKey : 27;
} 

Modal.alert = function()
{
    var myWin = document.createElement('div');
    myWin.id ='myWin';
    myWin.tabIndex = -1;
    myWin.style.background = 'white';
    myWin.style.border = '1px solid DodgerBlue';
    myWin.style.position = 'fixed';
    myWin.style.top = '50%';
    myWin.style.left = '50%';
    if(this.draggable === true)
    {
        myWin.addEventListener("mousedown", drag, false);
    }
 
    function drag(e)
    {
        var e = e || window.event;    
        var _this = document.getElementById('myWin');  
        var diffX = e.clientX - _this.offsetLeft;
        var diffY = e.clientY - _this.offsetTop; 
 
        document.addEventListener("mousemove",move, false);
        document.addEventListener("mouseup",up, false);
 
        function move(e)
        {
            var left = e.clientX - diffX;
         	  var top = e.clientY - diffY;
 
            if(left < 0)
            {
                left = 0;
            }
            else if(left > document.body.clientWidth - _this.clientWidth)
            {
                left = document.body.clientWidth - _this.clientWidth;
            }
 
           	if(top < 0)
           	{
                top = 0;
           	}
           	else if(top > document.body.clientHeight - _this.clientHeight)
           	{
                top = document.body.clientHeight - _this.clientHeight;
            }
 
            _this.style.left = left + 'px';
            _this.style.top = top + 'px';
        }

        function up()
        {
	    	    document.removeEventListener("mousemove", move, false);
            document.removeEventListener("mouseup", up, false);
        }
    }

    myWin.onkeydown = function(e)
    {
  		  var keynum;
  		  if(window.event) // IE
    	  {
    	  	  keynum = e.keyCode
    	  }
  		  else if(e.which) // Netscape/Firefox/Opera
    	  {
    	  	  keynum = e.which
    	  }
        //alert(keynum);
    	  if(keynum === Modal.closeKey)
    	  {

    	   		document.body.removeChild(document.getElementById('myWin'));
    	  }
    }
    var myClose = document.createElement('div');
    myClose.style.background = 'DodgerBlue';
    myClose.style.cursor = 'pointer';
    myClose.style.width = '40px'
    myClose.style.color = 'white'
    myClose.innerText = '关闭';
    myClose.onclick = function(e)
    {
    	  document.body.removeChild(document.getElementById('myWin'));
    }

    var myContent = document.createElement('p');
    myContent.innerText = this.content;
    myContent.textAlign = 'center';


    document.body.appendChild(myWin);
    // var frag = document.createDocumentFragment();
    // frag.appendChild(myClose);
    // frag.appendChild(myContent);
    document.getElementById('myWin').appendChild(myClose);
    document.getElementById('myWin').appendChild(myContent);
    document.getElementById('myWin').focus();
}
