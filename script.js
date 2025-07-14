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

  // Create wrapper div for clothing image + handles
  const wrapper = document.createElement('div');
  wrapper.classList.add('clothing-wrapper');
  wrapper.style.top = '60px';
  wrapper.style.left = '40px';
  wrapper.style.width = '200px';

  // Create clothing image
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Clothing item';

  wrapper.appendChild(img);
  clothingLayer.appendChild(wrapper);
  clothingUrlInput.value = '';

  // Make wrapper draggable
  makeDraggable(wrapper);

  // Add resize handles
  addResizeHandles(wrapper);

  // Add selection handler
  wrapper.addEventListener('mousedown', (e) => {
    e.stopPropagation(); // Prevent deselect when clicking inside
    selectWrapper(wrapper);
  });

  // Auto select new wrapper
  selectWrapper(wrapper);
});

// Clear all clothing
clearBtn.addEventListener('click', () => {
  clothingLayer.innerHTML = '';
  selectedWrapper = null;
});

// Click outside to deselect
document.addEventListener('mousedown', (e) => {
  if (!clothingLayer.contains(e.target)) {
    deselectWrapper();
  }
});

function selectWrapper(wrapper) {
  if (selectedWrapper) {
    selectedWrapper.classList.remove('selected');
  }
  selectedWrapper = wrapper;
  selectedWrapper.classList.add('selected');
}

function deselectWrapper() {
  if (selectedWrapper) {
    selectedWrapper.classList.remove('selected');
    selectedWrapper = null;
  }
}

function makeDraggable(el) {
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  el.style.cursor = 'grab';

  el.addEventListener('mousedown', (e) => {
    // Only drag if clicking on the wrapper but not on handles
    if (e.target.classList.contains('resize-handle')) return;

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

function addResizeHandles(wrapper) {
  const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  handles.forEach((dir) => {
    const handle = document.createElement('div');
    handle.classList.add('resize-handle', dir);

    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      startResize(e, wrapper, dir);
    });

    wrapper.appendChild(handle);
  });
}

function startResize(e, wrapper, direction) {
  e.preventDefault();

  const startX = e.clientX;
  const startY = e.clientY;

  const startWidth = wrapper.offsetWidth;
  const startHeight = wrapper.offsetHeight;

  const startLeft = parseInt(wrapper.style.left, 10) || 0;
  const startTop = parseInt(wrapper.style.top, 10) || 0;

  function doResize(ev) {
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    if (direction.includes('e')) {
      newWidth = startWidth + dx;
    }
    if (direction.includes('s')) {
      newHeight = startHeight + dy;
    }
    if (direction.includes('w')) {
      newWidth = startWidth - dx;
      newLeft = startLeft + dx;
    }
    if (direction.includes('n')) {
      newHeight = startHeight - dy;
      newTop = startTop + dy;
    }

    // Minimum size limits
    if (newWidth < 20) newWidth = 20;
    if (newHeight < 20) newHeight = 20;

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
