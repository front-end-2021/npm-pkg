### The package is present images by slide image in frame divided by column around the center view
   ![test col-slider package](https://live.staticflickr.com/65535/51761145941_091d74543c.jpg)
### Usage    
1. import { colSlider } from "col-slider"
2. Get array image
    ```
    const images = [{src: "img url"}]
    ```
    i. Item is object has src property
3. call function with important params then set parent element use class name or id
    ```
    colSlider({
        slides: images
    }).append('.parentClassName');
    ```
4. In web application: User can click/touch down and drag horizontal to move on the left/right
5. Happy codding!!!

> Demo in React app
```
import React, { useState, useEffect } from 'react';
import './App.css';
import { colSlider } from 'col-slider';

function App() {
    return (
        <div className="App">
        <header className="App-header">
            <MainBody />
        </header>
        </div>
    );
}

export default App;

function MainBody() {
    useEffect(() => {
        const imgs = [
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' }
        ];
        colSlider({
        slides: imgs,
        mainWidth: '75%' //, viewWidth: 800
        }).append('.dnbBody');
    });
    return (
        <div className="dnbBody">
        <h2>Dainb demo col-slider</h2>
        </div>
    );
}

```

> Version 1.2.0 - output active index in function onDragEnd
```
//import React, { useState, useEffect } from 'react';
function MainBody() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const imgs = [
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' },
            { src: 'https://live.staticflickr.com/65535/51728456656_7e4105ffc0.jpg' }
        ];
    colSlider({
      slides: imgs, 
      mainWidth: '75%'
    }).append('.dnbBody').onDragEnd(function(_index){
      setIndex(_index);
    });
  });
  return (
    <div className="dnbBody">
      {console.log(index)}
      <h2>Dainb demo col-slider</h2>
    </div>
  );
}
```

[![Demo col-slider in React App](https://img.youtube.com/vi/G27LJT9HlbA/0.jpg)](https://www.youtube.com/watch?v=G27LJT9HlbA)

### Source code [Github/col-slider](https://github.com/front-end-2021/npm-pkg/tree/main/col-slider)

##### The version 1.2.0 (output active index in function onDragEnd)
##### The version 1.1.2 (allow mainWidth undefined)
##### The version 1.1.1 (mainWidth is string or number)