### The package is present 
   [![Demo col-slider in React App](https://img.youtube.com/vi/G27LJT9HlbA/0.jpg)](https://youtu.be/MtMBibH7aJI)
### Usage    
1. Install npm package: 
    ```
    npm i bind-typewriter
    ```
2. Import in project: 
    ```
    import { bindTypewriter } from "bind-typewriter"
    ```
3. Setting
    ```
    const options = {
        start: '0.6s',
        attribute: `[data-typewriter="animation"]`,
        cursorColor: 'black'    // #fff
    }
    // default options = undefined
    ```
    i. 
4. Usage: 
    a. import
    ```
    import { bindTypewriter } from 'bind-typewriter';
    ```
    b. call function
    ```
    bindTypewriter(options).run();
    ```
5. remove library (optional)
    ```
    bindTypewriter().remove();
    ```
6. Happy codding!!!

> Demo in React app
```
    import React, { useState, useEffect } from 'react';
    import './App.css';
    import { bindTypewriter } from 'bind-typewriter';

    function App() {
        return (
            <div className="App">
            <header className="App-header">
                <BindTypewriterBody />
            </header>
            </div>
        );
    }

    export default App;

    function BindTypewriterBody() {
        const [index, setIndex] = useState(0);
    
        useEffect(() => {

        if(index > 3) bindTypewriter().remove();
        else bindTypewriter({cursorColor: 'white'}).run();

        setTimeout(function(){
            setIndex(index + 1);
        }, 6666);

        });
        return (
        <div className="DnbBindTypewriter">
            <h2 data-typewriter="animation">{index % 2 == 0 ? `Demo bind-typewriter ${index}` : `Demo ${index}`}</h2>
        </div>
        );
    }

```

##### The version 1.0.0