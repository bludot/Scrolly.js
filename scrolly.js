function scrolly(node, e)
{
	//function to scroll on mouse wheel
	var scroll = function(node, black, e)
	{
		e = e || window.event;
		//check blacklist for nodes you dont want scrolled
		if(black.indexOf(e.target.className) === -1 || black.indexOf(e.target.tagName) === -1 || node.running)
		{
			//set node.running for scrollbar display
			node.running = true;
			clearInterval(window.timeout);
			node.parentNode.querySelector('.scrollbar').style.opacity = 1;
			window.tempit = node;
			//mousewheel
			node.scrollTop += -(e.detail * -10) ? -(e.detail * -10) : -(e.wheelDelta / 5);
			//set height of scrollbar if content height changes
			node.parentNode.querySelector('.scrollbar').style.height = (node.clientHeight / node.scrollHeight) * node.clientHeight + 'px';
			//set scrolltop
			node.parentNode.querySelector('.scrollbar').style.top = (node.scrollTop / node.clientHeight) * node.parentNode.querySelector('.scrollbar').clientHeight + 'px';
			//timeout for scrollbar display
			window.timeout = setTimeout(function(e)
			{
				delete node.running;
				node.parentNode.querySelector('.scrollbar').style.opacity = 0;
			},500);
		}
		//prevent body scrolling
		e.preventDefault();
		return false;
	};
	//create container to hold the scrollbar and content
	var div = document.createElement('div');
	div.className = 'content';
	var className  = node.className;
	var tmpstyle = '';
	//get style of the content
	function getStyle(className) {
		var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
		for(var x=0;x<classes.length;x++) {
			if(classes[x].selectorText === className) {
				return (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
			}
		}
	}
	//set style of content to container
	tmpstyle = getStyle('.test');
	tmpstyle = tmpstyle.split('{ ')[1].split(' }')[0];
	div.style.cssText = tmpstyle;
	div.style.overflow = 'hidden';
	//add scrollcontainer
	var scrollC = document.createElement('div');
	scrollC.className = 'scrollbar-container';
	scrollC.style.cssText = 'right:0px;';
	//add scrollbar
	var scrollB = document.createElement('div');
	scrollB.className = 'scrollbar';
	scrollB.style.cssText = 'height:10px;top:0px;';
	var tmpdiv = node.cloneNode(true);
	tmpdiv.style.cssText = tmpstyle;
	node.parentNode.appendChild(div);
	node.parentNode.removeChild(node);
	div.appendChild(scrollC);
	scrollC.appendChild(scrollB);
	div.appendChild(tmpdiv);
	node = tmpdiv;
	node.style.width = 'auto';
	e = e || window.event;
	// set scrollbar height
	node.parentNode.querySelector('.scrollbar').style.height = (node.clientHeight / node.scrollHeight) * node.clientHeight + 'px';
	//on mouse wheeel
	node.addEventListener('mousewheel',  function(e) {
		scroll(node, ['body'], e);
	}, false);
	node.addEventListener('DOMMouseScroll',  function(e) {
		scroll(node, ['body'], e);
	}, false);
	//on mouse move for showing scrollbar near the side
	node.onmousemove = function(e) {
		if(e.clientX>(node.clientWidth-10))
		{
			node.parentNode.querySelector('.scrollbar').style.opacity = 1;
		} else {
			if(node.running === false)
			{
				node.parentNode.querySelector('.scrollbar').style.opacity = 0;
			}
		}
	};
	// on mouse down for clicking on the scrollbar
	node.parentNode.querySelector('.scrollbar').onmousedown = function(e) {
		node.running = true;
		document.onselectstart = function(e) {
			return false;
		};
		var tempY = e.pageY;
		var tempTop = node.parentNode.querySelector('.scrollbar').offsetTop;
		//move scrollbar when mouse down and mouse move
		window.onmousemove = function(e) {
			var styleTop = tempTop-(tempY-e.pageY);
			node.parentNode.querySelector('.scrollbar').style.top = (styleTop > 0 && styleTop < (node.clientHeight - node.parentNode.querySelector('.scrollbar').clientHeight)) ? styleTop + 'px' : node.parentNode.querySelector('.scrollbar').offsetTop;
			var setTop = (node.parentNode.querySelector('.scrollbar').offsetTop / node.parentNode.querySelector('.scrollbar').clientHeight) * node.clientHeight;
			node.scrollTop = setTop > 0 ? setTop : 0;
		};
		window.onmouseup = function(e) {
			node.running = false;
			document.onselectstart = function(e) {
				return true;
			};
			window.onmousemove = null;
		};
	};
	//mouse out hide scrollbar
	node.onmouseout = function(e) {
		if(!node.running)
		{
			node.parentNode.querySelector('.scrollbar').style.opacity = 0;
		}
		node.parentNode.querySelector('.scrollbar').onmouseover = function() {
			node.parentNode.querySelector('.scrollbar').style.opacity = 1;
		};
	};
}
