import { React, useRef, useEffect } from 'react';
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { pdfjsWorker } from "pdfjs-dist/build/pdf.worker.entry";
import './PDFLoader.css';

import { w3cwebsocket as W3CWebSocket } from "websocket";
const client = new W3CWebSocket('ws://localhost:9090/ws/pdf');

const PDFLoader = () => {
    var url = 'http://localhost:9090/pdf';
    const loadpdf = () => {
        var canvas_container = document.getElementById('canvas-container');
        canvas_container.innerHTML = '';

        var loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(function(pdf) {
            var page_count = pdf.numPages;
            for (let i = 1; i <= page_count; i++) {
                pdf.getPage(i).then(function(page) {
                    var viewport = page.getViewport(
                        {scale: 2, }
                    );
                    var outputScale = window.devicePixelRatio || 1;

                    let node = document.createElement("canvas");
                    node.setAttribute("id", "the-canvas"+i);
                    canvas_container.appendChild(node);

                    var canvas = document.getElementById('the-canvas'+i);

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

                });
            }
        });
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
            <div id="canvas-container">
            </div>
        </>
    );

}

export default PDFLoader;
