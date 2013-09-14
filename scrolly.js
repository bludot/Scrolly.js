function scrolly(node, e)
{
	// function to scroll on mouse wheel
	var scroll = function(node, black, e)
	{
		e = e || window.event;
		// check blacklist for nodes you dont want scrolled
		if(black.indexOf(e.target.className) === -1 || black.indexOf(e.target.tagName) === -1 || node.running)
		{
			// set node.running for scrollbar display
			node.running = true;
			clearInterval(node.timeout);
			scrollB.style.opacity = 1;
			window.tempit = node;
			// mousewheel
			node.scrollTop += -(e.detail * -10) ? -(e.detail * -10) : -(e.wheelDelta);
			// set height of scrollbar if content height changes
			// get percent of content height relative to scrollHeight. multiply by content
			// height to set the correct scrollbar height
			scrollB.style.height = (node.clientHeight / node.scrollHeight) * node.clientHeight + 'px';
			// set offsetTop of the scrollbar when you scroll
			// percent of scrollTop relative to the height of the content.
			// then multiplied by the scrollbar height
			scrollB.style.top = (node.scrollTop / node.clientHeight) * scrollB.clientHeight + 'px';
			// timeout for scrollbar display
			// when scrolling stops and doesnt continue: hide the scrollbar
			node.timeout = setTimeout(function(e)
			{
				delete node.running;
				scrollB.style.opacity = 0;
			},500);
		}
		// prevent body scrolling
		e.preventDefault();
		return false;
	};
	
	
	// create container to hold the scrollbar and content
	var div = document.createElement('div');
	div.className = 'content';
	
	// get classname of the node to get the style
	var className  = node.className;
	var tmpstyle = '';
	
	// function to get the style of the content
	function getStyle(className) {
		var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
		for(var x=0;x<classes.length;x++) {
			if(classes[x].selectorText === className) {
				return (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
			}
		}
	}
	
	// set style of content to container
	tmpstyle = getStyle('.test');
	tmpstyle = tmpstyle.split('{ ')[1].split(' }')[0];
	div.style.cssText = tmpstyle;
	div.style.overflow = 'hidden';
	
	// add scrollcontainer
	var scrollC = document.createElement('div');
	scrollC.className = 'scrollbar-container';
	scrollC.style.cssText = 'right:0px;';
	
	// add scrollbar
	var scrollB = document.createElement('div');
	scrollB.className = 'scrollbar';
	scrollB.style.cssText = 'height:10px;top:0px;';
	
	// copy content node to add to the container
	var tmpdiv = node.cloneNode(true);
	
	// restore style
	tmpdiv.style.cssText = tmpstyle;
	
	// create container with scrollbar and content
	node.parentNode.appendChild(div);
	node.parentNode.removeChild(node);
	div.appendChild(scrollC);
	scrollC.appendChild(scrollB);
	div.appendChild(tmpdiv);
	node = tmpdiv;
	node.style.width = 'auto';
	
	// start assigning events to the container and scrollbar
	e = e || window.event;
	
	//  set scrollbar height
	scrollB.style.height = (node.clientHeight / node.scrollHeight) * node.clientHeight + 'px';
	
	// on mouse wheeel
	node.addEventListener('mousewheel',  function(e) {
		scroll(node, ['body'], e);
	}, false);
	node.addEventListener('DOMMouseScroll',  function(e) {
		scroll(node, ['body'], e);
	}, false);
	
	// on mouse move for showing scrollbar near the side
	node.onmousemove = function(e) {
		if(e.clientX>(node.clientWidth-10))
		{
			scrollB.style.opacity = 1;
		} else {
			if(node.running === false)
			{
				scrollB.style.opacity = 0;
			}
		}
	};
	
	//  on mouse down for clicking on the scrollbar
	scrollB.onmousedown = function(e) {
		
		// prevent text selection
		e.preventDefault();
		
		// scrollbar is being used
		node.running = true;
		
		// save coordinates for later use (find change of mouse movement)
		var tempY = e.pageY;
		var tempTop = scrollB.offsetTop;

		// move scrollbar when mouse down and mouse move
		window.onmousemove = function(e) {
			
			// temp variable to use when checking if the scrollbar is too high or too low
			var styleTop = tempTop-(tempY-e.pageY);
			
			// set the scrollbar offsetTop
			scrollB.style.top = (styleTop > 0 && styleTop < (node.clientHeight - scrollB.clientHeight)) ? styleTop + 'px' : scrollB.offsetTop;
			
			// set the scrollTop of content if it is greater than '0'
			var setTop = (scrollB.offsetTop / scrollB.clientHeight) * node.clientHeight;
			node.scrollTop = setTop > 0 ? setTop : 0;
			
			// prevent text selection
			e.preventDefault();
		};
		
		// cancel mouse movement
		window.onmouseup = function(e) {
			node.running = false;
			document.onselectstart = function(e) {
				return true;
			};
			window.onmousemove = null;
		};
	};
	
	// mouse out hide scrollbar
	node.onmouseout = function(e) {
		if(!node.running)
		{
			scrollB.style.opacity = 0;
		}
		scrollB.onmouseover = function() {
			scrollB.style.opacity = 1;
		};
	};
}
