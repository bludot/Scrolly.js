function scrolly(node, e)
{
	
	e = e || window.event;
	
	var body = false;
	if(node === document.body)
	{
		body = true;
	}
	
	// clone nodes
	var cloneNodes = function( orgNode ){
		var orgNodeEvenets = orgNode.getElementsByTagName('*');
		var cloneNode = orgNode.cloneNode( true );
		var cloneNodeEvents = cloneNode.getElementsByTagName('*');

		var allEvents = new Array('onabort','onbeforecopy','onbeforecut','onbeforepaste','onblur','onchange','onclick',
			'oncontextmenu','oncopy','ondblclick','ondrag','ondragend','ondragenter', 'ondragleave' ,
			'ondragover','ondragstart', 'ondrop','onerror','onfocus','oninput','oninvalid','onkeydown',
			'onkeypress', 'onkeyup','onload','onmousedown','onmousemove','onmouseout',
			'onmouseover','onmouseup', 'onmousewheel', 'onpaste','onreset', 'onresize','onscroll','onsearch', 'onselect','onselectstart','onsubmit','onunload');
		
		
		// The node root
		for( var j=0; j<allEvents.length ; j++ ){
			if( orgNode[allEvents[j]] )
			{
				cloneNode[allEvents[j]] = orgNode[allEvents[j]];
			}
		}
		
		// Node descendants
		for( var i=0 ; i<orgNodeEvenets.length ; i++ ){
			for( var j=0; j<allEvents.length ; j++ ){
				if( orgNodeEvenets[i][allEvents[j]] )
				{
					cloneNodeEvents[i][allEvents[j]] = orgNodeEvenets[i][allEvents[j]];
				}
			}
		}
		
		return cloneNode;
	};
	
	
	// function to scroll on mouse wheel
	var scroll = function(node, e)
	{
		e = e || window.event;
		e.preventDefault();
			// set node.running for scrollbar display
			node.running = true;
			clearInterval(node.timeout);
			scrollB.style.opacity = 1;
			window.tempit = node;
			
			// mousewheel
			if(!e.touches)
			{
				node.scrollTop +=  -(e.wheelDelta) ? -(e.wheelDelta) : -(e.detail * -10);
			} else {
				var place = node.clientHeight / (-(e.touches[0].clientY-node.tmp));
				node.last = (e.touches[0].clientY-node.tmp);
				node.scrollTop += (place);
			}
			
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
				node.running = false;
				scrollB.style.opacity = 0;
			}, 500);
		return false;
	};
	
	
	// scroll for body tag
	var bscroll = function(node, e)
	{
		e = e || window.event;
		
			// set node.running for scrollbar display
			node.running = true;
			clearInterval(node.timeout);
			scrollB.style.opacity = 1;
			
			// mousewheel
			/*if(isFirefox)
			{
				document.documentElement.scrollTop += -(e.detail * -10) ? -(e.detail * -10) : -(e.wheelDelta);
			} else {
				node.scrollTop += -(e.detail * -10) ? -(e.detail * -10) : -(e.wheelDelta);
			}*/
    var delta;
    if (e.wheelDelta) {
      if(isFirefox) {
        delta = e.wheelDelta / 10;
      } else {
        delta = e.wheelDelta / 3;
      }
    } else if (e.detail) {
      if(isFirefox) {
        delta = -e.detail * 10;
      } else {
        delta = -e.detail / 10;
      }
    }
    
    if(isFirefox)
			{
				document.documentElement.scrollTop += -delta
			} else {
				node.scrollTop += -delta;
			}
			
			// set height of scrollbar if content height changes
			// get percent of content height relative to scrollHeight. multiply by content
			// height to set the correct scrollbar height
			if(isFirefox)
			{
				scrollB.style.height = (window.innerHeight / document.documentElement.scrollHeight) * window.innerHeight + 'px';
			}else {
				scrollB.style.height = (window.innerHeight / node.scrollHeight) * window.innerHeight + 'px';
			}
			
			// set offsetTop of the scrollbar when you scroll
			// percent of scrollTop relative to the height of the content.
			// then multiplied by the scrollbar height
			if(isFirefox)
			{
				scrollB.style.top = (document.documentElement.scrollTop / window.innerHeight) * scrollB.clientHeight + 'px';
			} else {
				scrollB.style.top = (node.scrollTop / window.innerHeight) * scrollB.clientHeight + 'px';
			}
			
			
			// timeout for scrollbar display
			// when scrolling stops and doesnt continue: hide the scrollbar
			node.timeout = setTimeout(function(e)
			{
				node.running = false;
				scrollB.style.opacity = 0;
			}, 500);
		// prevent body scrolling
		e.preventDefault();
		return false;
	};
	
	// mousemove event for content
	var mousemove = function(e) {
		if(!node.running)
		{
			if(e.clientX>(node.clientWidth-10))
			{
				scrollB.style.opacity = 1;
			} else {
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
			scrollB.style.top = (styleTop > 0 && styleTop < (node.clientHeight - scrollB.clientHeight)) ? styleTop + 'px' : scrollB.offsetTop + 'px';
			
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
	
	// mousedown for body tag
	var bmousedown = function(e) {
		
		// prevent text selection
		e.preventDefault();
		
		// scrollbar is being used
		node.running = true;
		
		// save coordinates for later use (find change of mouse movement)
		var tempY = e.clientY;
		var tempTop = scrollB.offsetTop;
		
		// local mousemove event for scrollbar
		var bmousemove = function(e) {
			
			// temp variable to use when checking if the scrollbar is too high or too low
			var styleTop = tempTop-(tempY-e.clientY);
			
			// set the scrollbar offsetTop
			scrollB.style.top = (styleTop > 0 && styleTop < (window.innerHeight - scrollB.clientHeight)) ? styleTop + 'px' : scrollB.offsetTop + 'px';
			
			// set the scrollTop of content if it is greater than '0'
			var setTop = (scrollB.offsetTop / scrollB.clientHeight) * window.innerHeight;
			if(isFirefox)
			{
				document.documentElement.scrollTop = setTop > 0 ? setTop : 0;
			} else {
				node.scrollTop = setTop > 0 ? setTop : 0;
			}
			
			// prevent text selection
			e.preventDefault();
		};
		
		
		// move scrollbar when mouse down and mouse move
		window.addEventListener('mousemove', bmousemove, false);
		
		// cancel mouse movement
		window.addEventListener('mouseup', function(e) {
			node.running = false;
			window.removeEventListener('mousemove', bmousemove, false);
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
	
	var isFirefox = typeof InstallTrigger !== 'undefined';
	
	// get classname of the node to get the style
	if(node.className)
	{
		var className  = node.className;
		tmpstyle = getStyleClass('.'+className);
		if(tmpstyle)
		{
			tmpstyle = tmpstyle.split('{ ')[1].split(' }')[0];
		} else {
			tmpstyle = node.style.cssText;
		}
	} else if(node.id)
	{
		var id = node.id;
		tmpstyle = getStyleClass('#'+id);
		if(tmpstyle)
		{
			tmpstyle = tmpstyle.split('{ ')[1].split(' }')[0];
		} else {
			tmpstyle = node.style.cssText;
		}
	} else if(!node.className && !node.id && !isFirefox) {
		tmpstyle = node.style.cssText;
	}
	
	// set style of content to container
	console.log(tmpstyle);
	div.style.cssText = tmpstyle;
	div.style.overflow = 'hidden';
	if(div.style.margin)
	{
		div.style.marginLeft = 0;
		div.style.marginRight = 0;
	}
	
	// add scrollcontainer
	var scrollC = document.createElement('div');
	scrollC.className = 'scrollbar-container';
	scrollC.style.cssText = 'position: absolute;top: 0px;bottom: 0px;right: 10px;width: 10px;padding: 0px;right:0px;z-index:99999';
	
	// add scrollbar
	var scrollB = document.createElement('div');
	scrollB.className = 'scrollbar';
	scrollB.style.cssText = 'position: relative;width: 6px;height: 100%;right: 0px;background: #222;border: 1px solid #C1C1C1;z-index: 3;top: 0px;opacity:0;-webkit-transition: opacity .5s ease;height:10px;top:0px;';
	
	// copy content node to add to the container
	var tmpdiv = cloneNodes(node);
	//tmpdiv.className = node.className;
	
	// restore style
	tmpdiv.style.cssText = tmpstyle;
	//tmpdiv.style.top = '-100%';
	
	// create container with scrollbar and content
	if(!body)
	{
		var tmpclass = node.className;
		var tmpid = node.id;
		node.parentNode.appendChild(div);
		//var tmp = div.className;
		div.className = 'Scrolly';
		node.parentNode.removeChild(node);
		div.appendChild(scrollC);
		scrollC.appendChild(scrollB);
		div.appendChild(tmpdiv);
		if(tmpdiv.style.position === "absolute")
		{
			tmpdiv.style.top = 0+'px';
		}
		if(div.clientHeight !== 0)
		{
			tmpdiv.style.height = div.clientHeight + 'px';
		}
		node = tmpdiv;
		node.style.width = 'auto';
		for(var i =0; i < node.parentNode.querySelectorAll('*').length; i++)
		{
			var temp = node.parentNode.querySelectorAll('*')[i].className;
			node.parentNode.querySelectorAll('*')[i].className = 'Scrolly '+temp;
		}
		node.className = 'Scrolly '+tmpclass;
		node.id = tmpid;
		div.children = div.children[1].children;
	} else {
		
		node.style.position = 'relative';
		node.style.height = '100%';

		
		document.documentElement.appendChild(scrollC);
		scrollC.appendChild(scrollB);
		
		// set needed body styles
		node.style.overflow = 'hidden';
		node.style.margin = 0;
		node.style.padding = 0;
		
		
		
		scrollC.style.position = 'fixed';
		scrollC.style.height = window.innerHeight + 'px';
		scrollC.style.zIndex = 99999;
		// our main container is now the first container
		//node = document.body.children[0];
		node = document.body;
		
		// start assigning events to the container and scrollbar
	e = e || window.event;
	
	//  set scrollbar height
	scrollB.style.height = (window.innerHeight / node.scrollHeight) * window.innerHeight + 'px';
	
	// on mouse wheeel
	node.addEventListener('mousewheel',  function(e) {
		if(!e.target.className || e.target.className.split(' ')[0] !== 'Scrolly')
		{
			bscroll(node, e);
		}
	}, false);
	node.addEventListener('DOMMouseScroll',  function(e) {
		if(!e.target.className || e.target.className.split(' ')[0] !== 'Scrolly')
		{
			bscroll(node, e);
		}
	}, false);
	
	// on mouse move for showing scrollbar near the side
	node.addEventListener('mousemove', mousemove, false);
	
	//  on mouse down for clicking on the scrollbar
	scrollB.addEventListener('mousedown', bmousedown, false);
	
	// mouse out hide scrollbar
	node.addEventListener('mouseout', mouseout, false);
	return false;
		
	}
	
	
	// start assigning events to the container and scrollbar
	e = e || window.event;
	
	//  set scrollbar height
	scrollB.style.height = (node.clientHeight / node.scrollHeight) * node.clientHeight + 'px';
	
	// set style of scrollbar
	scrollB.style.top = 0+'px';
	
	// on mouse wheeel
	node.parentNode.addEventListener('mousewheel',  function(e) {
		scroll(node, e);
	}, false);
	node.parentNode.addEventListener('DOMMouseScroll',  function(e) {
		scroll(node, e);
	}, false);
	
	node.parentNode.addEventListener('touchmove', function(e) {
		e.preventDefault();
		scroll(node, e);
	}, false);
	
	node.parentNode.addEventListener('touchstart', function(e) {
		e.preventDefault();
		node.tmp = e.touches[0].clientY;
		var d = new Date();
		node.time = d.getTime();
	}, false);
	
	node.parentNode.addEventListener('touchend', function(e) {
		e.preventDefault();
		/*var d = new Date();
		var time = d.getTime()-node.time;
		var num = (node.last);
		console.log(time);
		num*=time;
		node.interval = setInterval(function() {
			if(num > 0)
			{
				num--;
			} else {
				num++;
			}
			node.scrollTop -= num;
			if(num > -1 && num < 1)
			{
				window.clearInterval(node.interval);
			}
		}, time);*/
		node.tmp = 0;
	}, false);
	
	// on mouse move for showing scrollbar near the side
	node.parentNode.addEventListener('mousemove', mousemove, false);
	
	//  on mouse down for clicking on the scrollbar
	scrollB.addEventListener('mousedown', mousedown, false);
	
	// mouse out hide scrollbar
	node.parentNode.addEventListener('mouseout', mouseout, false);
}
