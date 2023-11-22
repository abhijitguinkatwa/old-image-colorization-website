const imageInput = document.getElementById('image');
const originalImage = document.querySelector('.original-image img');
const colorizedImage = document.querySelector('.colorized-image img');
const downloadOptions = document.querySelector('.download-options');

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const imageURL = URL.createObjectURL(file);
  const reader = new FileReader();

  reader.onload = (event) => {
    const imageData = event.target.result;
    // Convert the image data to a Base64 string
    const imageBase64 = btoa(imageData);

    // Send the image Base64 string to the server for colorization
    fetch('/colorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageBase64: imageBase64 })
    })
      .then(response => response.json())
      .then(data => {
        const colorizedImageData = data.colorizedImageData;
        const colorizedImageBase64 = `data:image/png;base64,${colorizedImageData}`;

        originalImage.src = imageURL;
        colorizedImage.src = colorizedImageBase64;

        // Enable download options
        const originalDownloadButton = document.createElement('button');
        originalDownloadButton.textContent = 'Download Original Image';
        originalDownloadButton.addEventListener('click', () => {
          downloadImage(imageURL);
        });
        downloadOptions.appendChild(originalDownloadButton);

        const colorizedDownloadButton = document.createElement('button');
        colorizedDownloadButton.textContent = 'Download Colorized Image';
        colorizedDownloadButton.addEventListener('click', () => {
          downloadImage(colorizedImageBase64);
        });
        downloadOptions.appendChild(colorizedDownloadButton);

        const advancedDownloadButton = document.createElement('button');
        advancedDownloadButton.textContent = 'Download Colorized Image with Advanced Options';
        advancedDownloadButton.addEventListener('click', () => {
          // Implement advanced download options here
        });
        downloadOptions.appendChild(advancedDownloadButton);
      });
  };

  reader.readAsDataURL(file);
});

function downloadImage(imageBase64) {
  const link = document.createElement('a');
  link.href = imageBase64;
  link.download = 'image.png';
  link.click();
}
