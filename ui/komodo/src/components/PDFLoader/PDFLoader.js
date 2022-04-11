import { React, useRef } from 'react';
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { pdfjsWorker } from "pdfjs-dist/build/pdf.worker.entry";
import './PDFLoader.css';

const PDFLoader = () => {
    var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
    const canvasRef = useRef();

    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
            var viewport = page.getViewport(
                {scale: 2, }
            );

            var outputScale = window.devicePixelRatio || 1;
            var canvas = document.getElementById('the-canvas');
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
    });

    return (
        <>
            <div class="canvas-container">
                <canvas id="the-canvas" />
            </div>
        </>
    );

}

export default PDFLoader;