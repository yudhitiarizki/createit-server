import React, { useState } from 'react';

function App() {
  const [imagesSend, setImages] = useState([
    { id: 1, file: null },
    { id: 2, file: null },
  ]);

  const handleChange = (id) => (event) => {
    const file = event.target.files[0];
    setImages(
      imagesSend.map((image) => {
        if (image.id === id) {
          return { ...image, file };
        }
        return image;
      })
    );
  };

  const submit = () => {
    const image = imagesSend.map((image) => {
        return image.file
    })
  }

  return (
    <div>
      <form>
        <label htmlFor="image1">Choose image 1:</label>
        <input type="file" id="image1" onChange={handleChange(1)} />
        <br />
        <label htmlFor="image2">Choose image 2:</label>
        <input type="file" id="image2" onChange={handleChange(2)} />
      </form>
      <ul>
        {images.map((image, index) => (
          <li key={index}>
            {image.file ? image.file.name : 'No image selected'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
