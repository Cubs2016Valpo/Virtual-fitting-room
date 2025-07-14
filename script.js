const generateBtn = document.getElementById('generate-btn');
const clearBtn = document.getElementById('clear-btn');
const clothingUrlInput = document.getElementById('clothing-url');
const clothingLayer = document.getElementById('clothing-layer');

let selectedWrapper = null;

generateBtn.addEventListener('click', () => {
  const url = clothingUrlInput.value.trim();
  if (!url) {
    alert('Please paste a clothing image URL!');
    return;
  }

  // Create wrapper div
  const wrapper = document.createElement('div');
  wrapper.classList.add('clothing-wrapper');
  wrapper.style.top = '60px';
  wrapper.style.left = '40px';
  wrapper.style.width = '200px';
  wrapper.style.height = 'auto';

  // Create clothing image
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Clothing item';
  img.style.width = '100%'; // Make image follow wrapper width
  img.style.height = '100%'; // 🔧 This is key: image scales with wrapper

  wrapper.appendChild(img);
  clothingLayer.appendChild(wrapper);
  clothingUrlInput.value = '';

  makeDraggable(wrapper);
  addResizeHandles(wrapper);
  wrapper.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    selectWrapper(wrapper);
  });

  selectWrapper(wrapper);
});

clearBtn.addEventListener('click', () => {
  clothingLayer.innerHTML = '';
  selectedWrapper = null;
});

document.addEventListener('mousedown', (e) => {
  if (!clothingLayer.contains(e.target)) {
    deselectWrapper();
  }
});

function selectWrapper(wrapper) {
  if (selectedWrapper && selectedWrapper !== wrapper) {
    deselectWrapper();
  }
  selectedWrapper = wrapper;
  wrapper.classList.add('selected');
  wrapper.querySelectorAll('.resize-handle').forEach(handle => {
    handle.style.display = 'block';
  });
}

function deselectWrapper() {
  if (!selectedWrapper) return;
  selectedWrapper.classList.remove('selected');
  selectedWrapper.querySelectorAll('.resize-handle').forEach(handle => {
    handle.style.display = 'none';
  });
  selectedWrapper = null;
}

function makeDraggable(el) {
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('resize-handle')) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(el.style.left) || 0;
    startTop = parseInt(el.style.top) || 0;

    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    el.style.left = startLeft + dx + 'px';
    el.style.top = startTop + dy + 'px';
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function addResizeHandles(wrapper) {
  const directions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  directions.forEach(dir => {
    const handle = document.createElement('div');
    handle.className = `resize-handle ${dir}`;
    handle.style.display = 'none';
    wrapper.appendChild(handle);

    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      startResize(e, wrapper, dir);
    });
  });
}

function startResize(e, wrapper, direction) {
  e.preventDefault();

  const startX = e.clientX;
  const startY = e.clientY;

  const startWidth = wrapper.offsetWidth;
  const startHeight = wrapper.offsetHeight;
  const startLeft = parseInt(wrapper.style.left) || 0;
  const startTop = parseInt(wrapper.style.top) || 0;

  function doResize(ev) {
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    if (direction.includes('e')) newWidth = startWidth + dx;
    if (direction.includes('s')) newHeight = startHeight + dy;
    if (direction.includes('w')) {
      newWidth = startWidth - dx;
      newLeft = startLeft + dx;
    }
    if (direction.includes('n')) {
      newHeight = startHeight - dy;
      newTop = startTop + dy;
    }

    if (newWidth < 30) newWidth = 30;
    if (newHeight < 30) newHeight = 30;

    wrapper.style.width = newWidth + 'px';
    wrapper.style.height = newHeight + 'px';
    wrapper.style.left = newLeft + 'px';
    wrapper.style.top = newTop + 'px';
  }

  function stopResize() {
    window.removeEventListener('mousemove', doResize);
    window.removeEventListener('mouseup', stopResize);
  }

  window.addEventListener('mousemove', doResize);
  window.addEventListener('mouseup', stopResize);
}
