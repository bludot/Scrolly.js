function scrolly(node, e)
{
	
	e = e || window.event;
	
	var body = false;
	if(node === document.body)
	{
		body = true;
	}
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
	div.className = node.className;
	
	// function to get the style of the content
	var getStyleClass = function(className) {
		var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
		for(var x=0;x<classes.length;x++) {
			var tmp = classes[x].selectorText.split('{');
			if(tmp[0].split(' ')[tmp[0].split(' ').length-1] === className) {
				return (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
			}
		}
	};
	
	var getStyleId = function(id) {
		var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
		for(var x=0;x<classes.length;x++) {
			var tmp = classes[x].selectorText.split('{');
			if(tmp[0].split(' ')[tmp[0].split(' ').length-1] === id) {
				return (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
			}
		}
	};
	
	var tmpstyle = '';
	
	// get classname of the node to get the style
	if(node.className)
	{
		var className  = node.className;
		tmpstyle = getStyleClass('.'+className);
		console.log(tmpstyle);
		tmpstyle = tmpstyle.split('{ ')[1].split(' }')[0];
	} else if(node.id)
	{
		var id = node.id;
		tmpstyle = getStyleClass('#'+id);
		console.log(tmpstyle);
		tmpstyle = tmpstyle.split('{ ')[1].split(' }')[0];
	} else if(!node.className && !node.id) {
		tmpstyle = window.getComputedStyle(node).cssText;
		console.log(tmpstyle);
	}
	
	// set style of content to container
	div.style.cssText = tmpstyle;
	div.style.overflow = 'hidden';
	div.style.marginLeft = 0;
	div.style.marginRight = 0;
	
	// add scrollcontainer
	var scrollC = document.createElement('div');
	scrollC.className = 'scrollbar-container';
	scrollC.style.cssText = 'position: absolute;top: 0px;bottom: 0px;right: 10px;width: 10px;padding: 0px;right:0px;';
	
	// add scrollbar
	var scrollB = document.createElement('div');
	scrollB.className = 'scrollbar';
	scrollB.style.cssText = 'position: relative;width: 6px;height: 100%;right: 0px;background: #222;border: 1px solid #C1C1C1;z-index: 3;top: 0px;opacity:0;-webkit-transition: opacity .5s ease;height:10px;top:0px;';
	
	// copy content node to add to the container
	var tmpdiv = node.cloneNode(true);
	tmpdiv.className = '';
	
	// restore style
	tmpdiv.style.cssText = tmpstyle;
	//tmpdiv.style.top = '-100%';
	
	// create container with scrollbar and content
	if(!body)
	{
		node.parentNode.appendChild(div);
		var tmp = div.className;
		div.className = 'Scrolly '+tmp;
		node.parentNode.removeChild(node);
		div.appendChild(scrollC);
		scrollC.appendChild(scrollB);
		div.appendChild(tmpdiv);
		tmpdiv.style.height = div.clientHeight + 'px';
		node = tmpdiv;
		node.style.width = 'auto';
		tmp = node.className;
		node.className = 'Scrolly '+tmp;
		for(var i =0; i < node.parentNode.querySelectorAll('*').length; i++)
		{
			tmp = node.parentNode.querySelectorAll('*')[i].className;
			node.parentNode.querySelectorAll('*')[i].className = 'Scrolly '+tmp;
		}
	} else {
		
		// body cannot be contained or be a container
		
		// copy body elements
		var tmpbody = node.innerHTML;
		
		// make new container for content twice
		var divC = div.cloneNode(true);
		
		// empty body innerHTML
		//node.innerHTML = '';
		
		// add both containers
		//node.appendChild(div);
		
		// add second container to hold body contents
		//div.appendChild(divC);
		
		// set second container styles to enable scrolling
		divC.style.position = 'relative';
		divC.innerHTML = tmpbody;
		node.style.position = 'relative';
		node.style.height = window.innerHeight + 'px';
		node.children[0].style.position = 'relative';
		node.children[0].style.height = window.innerHeight + 'px';
		
		// add scrollbars to 1st container.
		node.appendChild(scrollC);
		scrollC.appendChild(scrollB);
		
		// set needed body styles
		node.style.overflow = 'hidden';
		node.style.margin = 0;
		node.style.padding = 0;
		
		// make 2nd container the scrollHeight so we can scroll the content
		//divC.style.height = node.children[0].scrollHeight + 'px';
		
		
		scrollC.style.position = 'fixed';
		// our main container is now the first container
		//node = document.body.children[0];
		node = document.body;
		
		// start assigning events to the container and scrollbar
	e = e || window.event;
	
	//  set scrollbar height
	scrollB.style.height = (node.clientHeight / node.scrollHeight) * node.clientHeight + 'px';
	
	// on mouse wheeel
	window.addEventListener('mousewheel',  function(e) {
		console.log(e.target.tagName);
		if(!e.target.className || e.target.className.split(' ')[0] !== 'Scrolly')
		{
			scroll(node, [], e);
		}
	}, false);
	window.addEventListener('DOMMouseScroll',  function(e) {
		if(!e.target.className || e.target.className.split(' ')[0] !== 'Scrolly')
		{
			console.log(e.target.className.split(' '));
			scroll(node, [], e);
		}
	}, false);
	
	// on mouse move for showing scrollbar near the side
	//node.addEventListener('mousemove', mousemove, false);
	
	//  on mouse down for clicking on the scrollbar
	scrollB.addEventListener('mousedown', mousedown, false);
	
	// mouse out hide scrollbar
	//node.addEventListener('mouseout', mouseout, false);
	return false;
		
	}
	
	
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
