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
        loadingTask.promise.then(async function(pdf) {
            for (let i = 1; i <= pdf.numPages; i++) {
               let a = await pdf.getPage(i).then(renderpage);
            }
        });
    }

    let page_num = 0
    const renderpage = (page) => {
        var canvas_container = document.getElementById('canvas-container');
        var viewport = page.getViewport(
            {scale: 2, }
        );
        var outputScale = window.devicePixelRatio || 1;

        let node = document.createElement("canvas");
        node.setAttribute("id", "the-canvas"+page_num);
        canvas_container.appendChild(node);

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
        page_num++;

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
