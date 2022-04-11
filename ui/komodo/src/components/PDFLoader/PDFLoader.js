import { React, useRef } from 'react';
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { pdfjsWorker } from "pdfjs-dist/build/pdf.worker.entry";

const PDFLoader = () => {
    var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
    const canvasRef = useRef();

    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
            var scale = 1.5;
            var viewport = page.getViewport({ scale: scale, });
            var outputScale = window.devicePixelRatio || 1;
            var canvas = document.getElementById('the-canvas');
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
            <canvas id="the-canvas" ></canvas>
        </>
    );

}

export default PDFLoader;
