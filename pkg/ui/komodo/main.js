var pdfjsLib = window.pdfjsLib || globalThis.pdfjsLib;

var currentLocation = window.location.hostname+":"+window.location.port;
var client;
var url = 'http://' + currentLocation + '/pdf';

const loadpdf = () => {
    if (!pdfjsLib) {
        console.error('PDF.js library not loaded');
        return;
    }
    
    var canvas_container = document.getElementById('canvas-container');
    //TODO delete all older canvas -> flickering and "scrolling" up
    //canvas_container.innerHTML = '';

    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(async function(pdf) {
        for (let i = 1; i <= pdf.numPages; i++) {
            let a = await pdf.getPage(i).then((page) => {
                renderpage(page, pdf.numPages, i - 1); // Pass page number as index (0-based)
            });

        }
    }).catch(function(error) {
        console.error('Error loading PDF:', error);
    });
}

const renderpage = (page, numPages, pageIndex) => {
    var canvas_container = document.getElementById('canvas-container');
    var textlayer_container = document.getElementById('textlayer-container');

    if (!canvas_container || !textlayer_container) {
        console.error('Canvas or text layer container not found');
        return;
    }

    var viewport = page.getViewport({scale: 1.5});
    var outputScale = window.devicePixelRatio || 1;

    // Use the passed pageIndex parameter instead of page.pageIndex
    let page_num = pageIndex !== undefined ? pageIndex : (page.pageIndex || 0);
    console.log('Rendering page:', page_num, 'Total pages:', numPages);
    let numRenderedPages = canvas_container.childElementCount;

    //create new page elements if needed
    if (page_num >= numRenderedPages) {
        let node_canvas = document.createElement("canvas");
        node_canvas.setAttribute("id", "the-canvas"+page_num);
        canvas_container.appendChild(node_canvas);

        let node_textlayer = document.createElement("div");
        node_textlayer.classList.add("textlayer"+page_num);
        node_textlayer.classList.add("textLayer");
        textlayer_container.appendChild(node_textlayer);
        
        // Force DOM update
        canvas_container.offsetHeight;
    }
    //remove page elements if they are not needed  
    let lastPageIndex = numPages;
    if (lastPageIndex < numRenderedPages) {
        for (let i = 0, len = (numRenderedPages - lastPageIndex); i < len; i++) {
            canvas_container.removeChild(canvas_container.lastChild);
            textlayer_container.removeChild(textlayer_container.lastChild);
        }
    }

    // Get canvas element after ensuring it exists
    var canvas = document.getElementById('the-canvas'+page_num);
    if (!canvas) {
        console.error('Canvas element not found for page', page_num);
        return;
    }

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + "px";
    canvas.style.height = Math.floor(viewport.height) + "px";
    
    var context = canvas.getContext('2d');
    if (!context) {
        console.error('Could not get canvas context');
        return;
    }
    
    var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
    var renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport
    };
    
    var renderTask = page.render(renderContext);
    
    renderTask.promise.then(function () {
        return page.getTextContent();
    }).then(function(textContent) {
        var textLayer = document.querySelector('.textlayer'+page_num);
        if (!textLayer) {
            console.error('Text layer not found for page', page_num);
            return;
        }
        
        // Calculate offset from canvas position
        var canvasRect = canvas.getBoundingClientRect();
        var containerRect = canvas_container.getBoundingClientRect();
        
        textLayer.style.left = (canvasRect.left - containerRect.left) + 'px';
        textLayer.style.top = (canvasRect.top - containerRect.top) + 'px';
        textLayer.style.width = canvas.offsetWidth + 'px';
        textLayer.style.height = canvas.offsetHeight + 'px';

        // Clear existing text
        textLayer.innerHTML = '';
        
        // Modern PDF.js text layer rendering
        if (pdfjsLib.renderTextLayer) {
            pdfjsLib.renderTextLayer({
                textContentSource: textContent,
                container: textLayer,
                viewport: viewport,
                textDivs: []
            });
        }
    }).catch(function(error) {
        console.error('Error rendering text layer:', error);
    });
}


function connectWebSocket() {
    client = new WebSocket('ws://'+currentLocation+'/ws/pdf');
    
    client.onopen = () => {
        console.log('WebSocket Client Connected');
    };
    
    client.onmessage = (message) => {
        console.log('WebSocket message received:', message.data);
        loadpdf();
    };
    
    client.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        // Reconnect after 1 second
        setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connectWebSocket();
        }, 1000);
    };
    
    client.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

function initializeApp() {
    if (!pdfjsLib) {
        pdfjsLib = window.pdfjsLib || globalThis.pdfjsLib;
    }
    
    if (!pdfjsLib) {
        console.error('PDF.js library still not available');
        return;
    }

    // Configure PDF.js worker for newer versions
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    connectWebSocket();
    loadpdf();
}

window.addEventListener('load', function () {
    setTimeout(initializeApp, 100);
})
