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
	
	// mousemove event for content
	var mousemove = function(e) {
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
	
	
	// mousedown event for scrollbar mouse down
	var mousedown = function(e) {
		
		// prevent text selection
		e.preventDefault();
		
		// scrollbar is being used
		node.running = true;
		
		// save coordinates for later use (find change of mouse movement)
		var tempY = e.pageY;
		var tempTop = scrollB.offsetTop;
		
		// local mousemove event for scrollbar
		var mousemove = function(e) {
			
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
		
		
		// move scrollbar when mouse down and mouse move
		window.addEventListener('mousemove', mousemove, false);
		
		// cancel mouse movement
		window.addEventListener('mouseup', function(e) {
			node.running = false;
			window.removeEventListener('mousemove', mousemove, false);
		}, false);
	};
	
	// mouseout event for content
	var mouseout = function(e) {
		if(!node.running)
		{
			scrollB.style.opacity = 0;
		}
		scrollB.addEventListener('mouseover', function(e) {
			scrollB.style.opacity = 1;
		}, false);
	};
	
	
	// create container to hold the scrollbar and content
	var div = document.createElement('div');
	div.className = 'content';
	
	// function to get the style of the content
	var getStyleClass = function(className) {
		var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
		for(var x=0;x<classes.length;x++) {
			if(classes[x].selectorText === className) {
				return (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
			}
		}
	};
	
	var getStyleId = function(id) {
		var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
		for(var x=0;x<classes.length;x++) {
			if(classes[x].selectorText === id) {
				return (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
			}
		}
	};
	
	var tmpstyle = '';
	
	// get classname of the node to get the style
	if(node.className.length > 0)
	{
		var className  = node.className;
		tmpstyle = getStyleClass('.'+className);
		tmpstyle = tmpstyle.split('{ ')[1].split(' }')[0];
	} else if(node.id.length > 0)
	{
		var id = node.id;
		tmpstyle = getStyleClass('#'+id);
		tmpstyle = tmpstyle.split('{ ')[1].split(' }')[0];
	} else {
		tmpstyle = window.getComputedStyle(node).cssText;
	}
	
	// set style of content to container
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
	node.addEventListener('mousemove', mousemove, false);
	
	//  on mouse down for clicking on the scrollbar
	scrollB.addEventListener('mousedown', mousedown, false);
	
	// mouse out hide scrollbar
	node.addEventListener('mouseout', mouseout, false);
}
