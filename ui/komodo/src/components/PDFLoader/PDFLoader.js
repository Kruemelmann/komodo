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
        var textlayer_container = document.getElementById('textlayer-container');

        var viewport = page.getViewport(
            {scale: 2, }
        );
        var outputScale = window.devicePixelRatio || 1;

        let page_num = page._pageIndex
        let numRenderedPages = document.getElementById("canvas-container").childElementCount;
        // -> no need to calculate the textcontainer since they are equal

        //create new page elements if needed
        if (page_num >= numRenderedPages) {
            let node_canvas = document.createElement("canvas");
            node_canvas.setAttribute("id", "the-canvas"+page_num);
            canvas_container.appendChild(node_canvas);

            let node_textlayer = document.createElement("div");
            node_textlayer.classList.add("textlayer"+page_num);
            node_textlayer.classList.add("textLayer");
            textlayer_container.appendChild(node_textlayer);
        }
        //remove page elements if they are not needed
        let lastPageIndex = numPages
        if (lastPageIndex < numRenderedPages) {
            for (let i = 0, len = (numRenderedPages - lastPageIndex); i < len; i++) {
                canvas_container.removeChild(canvas_container.lastChild);
                textlayer_container.removeChild(textlayer_container.lastChild);
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

        page.getTextContent().then(function(textContent){
            var textLayer = document.querySelector('.textlayer'+page_num);
            //var textLayer = document.querySelector(".textLayer");

            // FIXME offsetTop need to be calculated for every page
            textLayer.style.left = canvas.offsetLeft + 'px';
            textLayer.style.top = canvas.offsetTop + 'px';
            textLayer.style.width = canvas.offsetWidth + 'px';
            textLayer.style.height = canvas.offsetHeight + 'px';

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
            <div id="canvas-container" />
            <div id="textlayer-container" />
        </>
    );

}

export default PDFLoader;
