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
  
  // Append the new clothing image on top of mannequin
  clothingLayer.appendChild(img);

  // Clear input after adding
  clothingUrlInput.value = '';
});

clearBtn.addEventListener('click', () => {
  clothingLayer.innerHTML = '';
});
