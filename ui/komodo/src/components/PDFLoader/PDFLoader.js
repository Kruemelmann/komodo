import { React, useRef, useEffect } from 'react';
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { pdfjsWorker } from "pdfjs-dist/build/pdf.worker.entry";
import './PDFLoader.css';

import { w3cwebsocket as W3CWebSocket } from "websocket";

var currentLocation = window.location.hostname+":"+window.location.port;
var client = new WebSocket('ws://'+currentLocation+'/ws/pdf');

const PDFLoader = () => {
    var url = 'http://' + currentLocation + '/pdf';

    const loadpdf = () => {
        var canvas_container = document.getElementById('canvas-container');
        //TODO delete all older canvas -> flickering and "scrolling" up
        //canvas_container.innerHTML = '';

        var loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(async function(pdf) {
            for (let i = 1; i <= pdf.numPages; i++) {
                let a = await pdf.getPage(i).then((page) => {
                    renderpage(page, pdf.numPages)
                });

            }
        });
    }

    const renderpage = (page, numPages) => {
        var canvas_container = document.getElementById('canvas-container');
        var viewport = page.getViewport(
            {scale: 2, }
        );
        var outputScale = window.devicePixelRatio || 1;

        let page_num = page._pageIndex
        let numRenderedPages = document.getElementById("canvas-container").childElementCount;
        //create new canvas element if needed
        if (page_num >= numRenderedPages) {
            let node = document.createElement("canvas");
            node.setAttribute("id", "the-canvas"+page_num);
            canvas_container.appendChild(node);
        }
        //remove canvas elements if they are not needed
        let lastPageIndex = numPages
        if (lastPageIndex < numRenderedPages) {
            for (let i = 0, len = (numRenderedPages - lastPageIndex); i < len; i++) {
                canvas_container.removeChild(canvas_container.lastChild);
            }
        }


        var canvas = document.getElementById('the-canvas'+page_num);
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height =  Math.floor(viewport.height) + "px";
        var context = canvas.getContext('2d');

        var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
        var renderContext = {
            canvasContext: context,
            transform: transform,
            viewport: viewport
        };
        page.render(renderContext);
        var textLayerDiv = document.getElementById('textLayer');
        page.getTextContent().then(function(textContent){
            var textLayer = document.querySelector(".textLayer");

            textLayer.style.left = canvas.offsetLeft + 'px';
            textLayer.style.top = canvas.offsetTop + 'px';
            textLayer.style.height = canvas.offsetHeight + 'px';
            textLayer.style.width = canvas.offsetWidth + 'px';

            pdfjsLib.renderTextLayer({
                textContent: textContent,
                container: textLayer,
                viewport: viewport,
                textDivs: []
            });
        })
    }

    useEffect(()=>{
        loadpdf()
    }, [loadpdf])

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
        loadpdf()
    };

    return (
        <>
            <div id="canvas-container"></div>
            <div class="textLayer"></div>
        </>
    );

}

export default PDFLoader;
