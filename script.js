const generateBtn = document.getElementById('generate-btn');
const clearBtn = document.getElementById('clear-btn');
const clothingUrlInput = document.getElementById('clothing-url');
const clothingLayer = document.getElementById('clothing-layer');

generateBtn.addEventListener('click', () => {
  const url = clothingUrlInput.value.trim();
  if (!url) {
    alert('Please paste a clothing image URL!');
    return;
  }

  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Clothing item';
  img.classList.add('clothing-item');

  clothingLayer.appendChild(img);
  clothingUrlInput.value = '';

  makeDraggable(img);
});

clearBtn.addEventListener('click', () => {
  clothingLayer.innerHTML = '';
});

// Drag functionality for clothing images
function makeDraggable(el) {
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  el.style.cursor = 'grab';

  el.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = parseInt(el.style.left, 10) || 0;
    initialTop = parseInt(el.style.top, 10) || 0;
    el.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    el.style.left = initialLeft + dx + 'px';
    el.style.top = initialTop + dy + 'px';
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      el.style.cursor = 'grab';
    }
  });
}
