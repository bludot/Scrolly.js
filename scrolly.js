function scrolly(node, e)
{
	var scroll = function(node, black, e)
	{
		e = e || window.event;
		if(black.indexOf(e.target.className) === -1 || black.indexOf(e.target.tagName) === -1 || node.running)
		{
			node.running = true;
			clearInterval(window.timeout);
			node.parentNode.querySelector('.scrollbar').style.opacity = 1;
			window.tempit = node;
			node.scrollTop += -(e.detail * -10) ? -(e.detail * -10) : -(e.wheelDelta / 5);
			node.parentNode.querySelector('.scrollbar').style.height = (node.clientHeight / node.scrollHeight) * node.clientHeight + 'px';
			node.parentNode.querySelector('.scrollbar').style.top = (node.scrollTop / node.clientHeight) * node.parentNode.querySelector('.scrollbar').clientHeight + 'px';
			window.timeout = setTimeout(function(e)
			{
				delete node.running;
				node.parentNode.querySelector('.scrollbar').style.opacity = 0;
			},500);
		}
		e.preventDefault();
		return false;
	};
	var div = document.createElement('div');
	div.className = 'content';
	var className  = node.className;
	var tmpstyle = '';
	function getStyle(className) {
		var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
		for(var x=0;x<classes.length;x++) {
			if(classes[x].selectorText === className) {
				return (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
			}
		}
	}
	tmpstyle = getStyle('.test');
	console.log(tmpstyle);
	tmpstyle = tmpstyle.split('{ ')[1].split(' }')[0];
	div.style.cssText = tmpstyle;
	div.style.overflow = 'hidden';
	var scrollC = document.createElement('div');
	scrollC.className = 'scrollbar-container';
	scrollC.style.cssText = 'right:0px;';
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
	node.parentNode.querySelector('.scrollbar').style.height = (node.clientHeight / node.scrollHeight) * node.clientHeight + 'px';
	node.addEventListener('mousewheel',  function(e) {
		scroll(node, ['body'], e);
	}, false);
	node.addEventListener('DOMMouseScroll',  function(e) {
		scroll(node, ['body'], e);
	}, false);
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
	node.parentNode.querySelector('.scrollbar').onmousedown = function(e) {
		node.running = true;
		document.onselectstart = function(e) {
			return false;
		};
		console.log('down');
		var tempY = e.pageY;
		var tempTop = node.parentNode.querySelector('.scrollbar').offsetTop;
		window.onmousemove = function(e) {
			var styleTop = tempTop-(tempY-e.pageY);
			node.parentNode.querySelector('.scrollbar').style.top = (styleTop > 0 && styleTop < (node.clientHeight - node.parentNode.querySelector('.scrollbar').clientHeight)) ? styleTop + 'px' : node.parentNode.querySelector('.scrollbar').offsetTop;
			console.log(tempTop - (tempY - e.pageY));
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
	node.onmouseout = function(e) {
		if(!node.running)
		{
			node.parentNode.querySelector('.scrollbar').style.opacity = 0;
		}
		node.parentNode.querySelector('.scrollbar').onmouseover = function() {
			node.parentNode.querySelector('.scrollbar').style.opacity = 1;
		}
	};
}
