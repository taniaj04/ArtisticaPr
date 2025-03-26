const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let isEraser = false;
let lastX = 0;
let lastY = 0;
let lineWidth = 5;
let strokeColor = '#000000';

const setCanvasResolution = () => {
    const scale = window.devicePixelRatio || 1;
    canvas.width = 600 * scale;
    canvas.height = 400 * scale;
    canvas.style.width = '600px';
    canvas.style.height = '400px';
    ctx.scale(scale, scale);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
};
setCanvasResolution();

function reproducirSonido(ruta) {
    const audio = new Audio(ruta);
    audio.play()
        .then(() => console.log('Sonido reproducido:', ruta))
        .catch((error) => console.error('Error al reproducir sonido:', ruta, error));
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    ctx.strokeStyle = isEraser ? '#ffffff' : strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

document.getElementById('colorPicker').addEventListener('change', (e) => {
    strokeColor = e.target.value;
    isEraser = false; 
});

document.getElementById('lineWidth').addEventListener('input', (e) => {
    lineWidth = e.target.value;
    document.getElementById('lineWidthValue').textContent = lineWidth;
    isEraser = false; 
});

document.getElementById('eraserButton').addEventListener('click', () => {
    reproducirSonido('colorear.mp3');
    isEraser = true;
});

document.getElementById('clearButton').addEventListener('click', () => {
    reproducirSonido('sonido.mp3');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('saveButton').addEventListener('click', () => {
    reproducirSonido('colorear.mp3');

    canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'mi_arte.png';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href); 
    }, 'image/png');
});

document.getElementById('restartButton').addEventListener('click', () => {
    const audio = new Audio('sonido.mp3');
    audio.play()
        .then(() => {
            console.log('Reproduciendo sonido...');
            audio.addEventListener('ended', () => {
                console.log('Sonido terminado, recargando página...');
                location.reload();
            });
        })
        .catch((error) => {
            console.error('Error al reproducir sonido:', error);
            location.reload();
        });
});

document.getElementById('exitButton').addEventListener('click', () => {
    reproducirSonido('sonido.mp3');
    setTimeout(() => {
        const userConfirmed = window.confirm('No te olvides de guardar tu obra de arte antes de salir. 😊');
        if (userConfirmed) {
            window.location.href = 'index.html';
        }
    }, 100);
});
