---
title: Moving jsPsych experiments online to Gorilla
date: "2021-12-30"
description: "A guide to moving jsPsych online to the Gorilla online behavioral experiment platform."
---

⚠️ **This guide is outdated, please read the updates at the [end](#updates) of this post for up-to-date advice.**

After spending time developing jsPsych experiments to run offline in a laboratory and online using the Gorilla platform, I decided to spend some time trying to work out a way that I could streamline my development such that I would only have to modify code in one location - on my laptop in the comfort of my own development environment and configuration.

## Using JavaScript with Gorilla

Gorilla allows users to create a *jsPsych Starter* task that includes a template JavaScript (JS) file and resources that allow the user to integrate jsPsych projects into Gorilla. Gorilla has a nice online IDE that facilitates development.

The main advantage of writing JS inside the Gorilla online IDE is having easy integration with the Gorilla API. The *main* file created by Gorilla in the experiment template is initialised with the following contents:

```JavaScript
import gorilla = require("gorilla/gorilla");

// Make sure to upload the jsPsych files you need to the resources tab.
// This should include the main jsPsych.js, jsPsych.css and likely at least one plugin.
// In this case, we use the jspsych-html-keyboard-response.js plugin file.
var jsPsych = window['jsPsych'];

gorilla.ready(function(){

  var timeline = [];

  var hello_trial = {
    type: 'html-keyboard-response',
    stimulus: 'Hello world!'
  }

  timeline.push(hello_trial);

  jsPsych.init({
    display_element: $('#gorilla')[0],
    timeline: timeline,
    on_data_update: function(data){
      gorilla.metric(data);
    },
    on_finish: function(){
      gorilla.finish();
    }
  });
})
```

From here, there are two ways of working with JS in Gorilla:

**Method One:** Modify source code using the online IDE. This method is safe, and will work almost all of the time. There will be very few unexpected errors. I personally think the online IDE is quite nice, particularly for smaller experiments!

**Method Two:** Write JS locally, modifying and copying it inside the `gorilla.ready` function when it is ready to be tested in Gorilla. Based on my experience using this method, there are many traps that you can fall into, and many repetitive operations when copying code from the local development environment to Gorilla. If you want to split your code into multiple files, there is no safety when referencing `export`-ed objects and classes. This method can lead to carnage if not thoroughly tested.

What if I want to add some other exciting third-party libraries like WebGazer? Use 3D stimuli built with WebGL or WebAssembly? React even? As it stands, there is no easy way to facilitate this kind of integration with Gorilla.

The solution I propose will accomplish the following goals:

1. One codebase that is operable in both the local development environment and on the Gorilla platform.
2. Ability to bundle additional third-party libraries such as React, WebGazer, and WebAssembly executables.
3. Develop experiments using TypeScript or JavaScript (TS / JS).
4. Streamline development of online experiments using Gorilla by enabling use of modern web development tools such as Webpack.

A solution to these challenges would allow developers to compile the code to test at least the functionality and appearance locally, and the only functionality unable to be tested locally would be the Gorilla API calls.

The bedrock of this solution I am proposing is essentially a targeted build system. Conceptually, there are two build targets: *desktop* (local development environment), and *gorilla* (online on the Gorilla platform). Build target *desktop* is the target used when building and testing the task locally, and the *gorilla* build is only run before uploading or integrating the task with the Gorilla platform.

## Local development

Before I start explaining my solution, I would be well-served explaining the primary challenge I encountered along the way. Hopefully if someone knows a better way to address this, they may be able to help me out!

Based on the contents of the *main* file above, we can see straight away that there will be issues when trying to run and test this code locally.

The primary issue, on line 1, is the `import gorilla = require("gorilla/gorilla");` call. The `gorilla/gorilla` package is not publicly available via NPM, so this is the first thing that will not be possible locally. This is the linkage to the API used throughout the code.

Later in the file, we see calls to `gorilla.ready`, `gorilla.metric`, and `gorilla.finish`, all essential functions when integrating the task to the Gorilla API.

We can be confident when building and testing the game in a local development environment, it is not possible to test the specific API calls.

Disclaimer: You won’t be able to run the code snippets without some setup or configuration. The code snippets below are intended to be pseudocode that hopefully explain my intentions and strategy to developing a solution.

### Digging into the code

Let’s get started with the easy part - deciding what code to run at execution time. This part of the system relies somewhat on JS being a ‘scripting’ language, opposed to a compiled language. I specified a `config.js` file which held, amongst other parameters, the build target string (`gorilla` or `desktop`). I created a new basic `if` block like the following:

```JavaScript
// Initialise jsPsych and Gorilla (if required)
if (config.target === 'gorilla') {
  // ...
} else if (config.target === 'desktop') {
  // ...
}
// ...
```

Now we can easily specify what code we want to run on each target platform.

### `window` objects

An important (and somewhat hacky) concept that underlies this solution is the existence of objects in `window` space. These objects are somewhat similar to global variables, and can be accessed like any other JS object by calling `window['object-name']`. When an `import` statement is compiled and then eventually executed, some imported libraries may configure a new `window` object. Fortunately for us, that’s exactly what jsPsych and Gorilla do. At runtime, `window['jsPsych']` and `window['gorilla']` (only if the code is running on Gorilla though) objects exist.

What’s the catch with this method? Well, we can only reliably access `window` objects after the window has loaded. So, I will wrap the `if` statement above in a function called when the window has finished loading. This function is the `window.onload` function. We end up with the following code:

```JavaScript
// ...
window.onload = () => {
  const timeline = []

  // Define your timeline here!

  if (config.target === 'gorilla') {
    // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
    const _gorilla = window['gorilla'];
    const _jsPsych = window['jsPsych'];
    // ...
  } else if (config.target === 'desktop') {
    // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
    const _jsPsych = window['jsPsych'];
    // ...
  }
}
// ...
```

You’ll see that I’ve also included variables inside the `if` blocks that store `window['jsPsych']` and `window['gorilla']` as required. We only need jsPsych for the desktop target, but we need both Gorilla and jsPsych for the Gorilla version.

In any subsequent code inside the `if` blocks will be run depending on the platform specified in the configuration file.

### Targeting `desktop`

Let’s start with an easy win, setting up the `desktop` configuration. The first thing to do is to check that jsPsych has actually been loaded successfully. The easiest way to catch most possible errors is to wrap the `jsPsych.init` method in an `if` block like so:

```JavaScript
// ...
} else if (config.target === 'desktop') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _jsPsych = window['jsPsych'];
  if (_jsPsych) {
    // jsPsych.init block here...
  } else {
    console.error('Fatal: jsPsych not loaded.');
  }
}
// ...
```

You’ll see I added an error message if for some reason the variable comes back `undefined`.

Next I need to make sure I `import ...` any other jsPsych plugins that I plan to be using in my timeline. This should be done at the top of the file.

Finally, I can then call the `jsPsych.init` method using my parameters of choice, but note how the `_jsPsych` variable is used below:

```JavaScript
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
} else if (config.target === 'desktop') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _jsPsych = window['jsPsych'];

  if (_jsPsych) {
    _jsPsych.init({
      timeline: timeline,
      on_finish: function() {
        // ...
      },
      // ...
    });
  } else {
    console.error('Fatal: jsPsych not loaded.');
  }
}
// ...
```

That’s it for `desktop`! Hopefully you see there is a simple logical sequence like so:

- Get the jsPsych `window` object.
- If it is defined, continue.
- If it is not defined, stop execution.
- Load any plugins that were used in the experiment timeline.
- Call the `jsPsych.init` method.

Let’s move onto the final challenge, getting the `gorilla` target working!

### Targeting `gorilla`

I will start with the code snippet below that is inside the `window.onload` function:

```JavaScript
// ...
if (config.target === 'gorilla') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _gorilla = window['gorilla'];
  const _jsPsych = window['jsPsych'];
  // ...
}
// ...
```

The next step is to confirm that Gorilla and jsPsych have been loaded correctly, raising an error if not:

```JavaScript
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
if (config.target === 'gorilla') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _gorilla = window['gorilla'];
  const _jsPsych = window['jsPsych'];

  if (_gorilla &amp;&amp; _jsPsych) {
    // gorilla.ready block here...
  } else {
    console.error(`Fatal: Gorilla or jsPsych not loaded.`);
  }
}
// ...
```

Next, I can add a call to the `gorilla.ready` function, similar to the original online template file:

```JavaScript
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
if (config.target === 'gorilla') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _gorilla = window['gorilla'];
  const _jsPsych = window['jsPsych'];

  if (_gorilla &amp;&amp; _jsPsych) {
    // Require any jsPsych plugins, so that they are loaded here
    _gorilla.ready(function() {
      // jsPsych.init block here...
    });
  } else {
    console.error(`Fatal: Gorilla or jsPsych not loaded.`);
  }
}
// ...
```

Finally, I can essentially paste in the `jsPsych.init` call from the original template file inside the `gorilla.ready` API call. I just need to replace any `jsPsych` references with `_jsPsych`, and any `gorilla` references with `_gorilla` like so:

```JavaScript
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
if (config.target === 'gorilla') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _gorilla = window['gorilla'];
  const _jsPsych = window['jsPsych'];

  if (_gorilla &amp;&amp; _jsPsych) {
    // Require any jsPsych plugins, so that they are loaded here
    _gorilla.ready(function() {
      _jsPsych.init({
        display_element: $('#gorilla')[0],
        timeline: timeline,
        on_data_update: function(data){
          _gorilla.metric(data);
        },
        on_finish: function(){
          _gorilla.finish();
        }
      });
    });
  } else {
    console.error(`Fatal: Gorilla or jsPsych not loaded.`);
  }
}
// ...
```

And that’s it! That’s the essence of coding up the two alternate implementation depending on whether the target is `gorilla` or `desktop`.

You should have something that generally resembles the snippet below:

```JavaScript
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
window.onload = () => {
  const timeline = []

  // Define your timeline here!

  if (config.target === 'gorilla') {
    // Wait for the entire page to be loaded before initialising jsPsych and Gorilla
    // Once all modules are loaded into the window, access Gorilla API and jsPsych library
    const _gorilla = window['gorilla'];
    const _jsPsych = window['jsPsych'];

    // Make sure Gorilla and jsPsych are loaded
    if (_gorilla &amp;&amp; _jsPsych) {
      _gorilla.ready(function() {
        _jsPsych.init({
          display_element: $('#gorilla')[0],
          timeline: timeline,
          on_data_update: function(data) {
            _gorilla.metric(data);
          },
          on_finish: function() {
            _gorilla.finish();
          },
        });
      });
    } else {
      console.error(`Fatal: Gorilla or jsPsych not loaded.`);
    }
  } else if (config.target === 'desktop') {
    // Once all modules are loaded into the window, access jsPsych library
    const _jsPsych = window['jsPsych'];

    // Make sure jsPsych is loaded
    if (_jsPsych) {
      _jsPsych.init({
        timeline: timeline,
        on_finish: function() {

        },
      });
    } else {
      console.error(`Fatal: jsPsych not loaded.`);
    }
  }
}
```

## How am I using this?

While this guide will help you write code that will operate mostly as intended on the Gorilla platform and offline, it isn't perfect, and there have been numerous challenges I have encountered when using the strategy I have described.

I will write an updated guide in the future, however I have developed *Neurocog.js*, a JavaScript library that wraps around an existing jsPsych experiment. With a bit of additional configuration, this library allows any jsPsych experiment to operate on the Gorilla platform. It is available on [GitHub](https://github.com/Brain-Development-and-Disorders-Lab/Neurocog.js) and is installable via NPM as the `neurocog` package.

## Tools

Here’s a bit more detail below about the tools and how I specifically used them.

### TypeScript

I used TypeScript for this project, requiring me to configure a TS compiler. The configuration I have currently allows JS, TS, and JSX / TSX to all reside together and be bundled. TS also provides a bit more confidence in typing, catching a few potential bugs when compiling it to JS.

### Webpack

Webpack acted as the bundler that would compile the TS code and bundle any dependencies.

I also made use of the Webpack development server, which would reload the in-browser preview each time I made a change. I needed to then incorporate the `HtmlWebpackPlugin` that would generate a HTML file alongside the bundled code enabling the preview to be rendered in the browser. You can see the exact configuration in the `webpack.config.js` file in the root of the repository.

### React

I was able to easily incorporate React into the example project linked above. I created a `screens.tsx` file which I plan to fill out with a few examples showcasing the capabilities of this project. Currently, I have tested a number of React UI libraries, including [React Bootstrap](https://react-bootstrap.github.io), [Chakra UI](https://chakra-ui.com/), and currently [Grommet](https://v2.grommet.io/). I recommend using Grommet for building experiments since the included components prioritize accessibility.

## Conclusion

Let’s revisit the goals of this project:

- One codebase that is operable in the local development environment and on the Gorilla platform.
- Ability to bundle additional third-party libraries such as React, WebGazer, and even WebAssembly executables.
- Develop experiments using TypeScript or JavaScript (TS / JS).
- Streamline development of online experiments using Gorilla by enabling use of modern web development tools such as Webpack.

Firstly, we’ve allowed a distinction to be made between the `desktop` and `gorilla` build targets. The code initialising jsPsych is subtly different between the two targets, however it allows jsPsych to be configured correctly for each target.

Secondly, since we are using modern development tools such as TypeScript, Webpack, and `yarn`, we are able to add dependencies and import them as required. This includes React and WebGazer which are both integrated with the repository. Additionally, I have had success creating a basic 3D game in Unity, exporting it to the HTML5 / WebGL target, and loading the WASM module both in the desktop and Gorilla builds.

Thirdly, this has already been covered above, but TS and JS are supported in the codebase. Additionally, TSX and JSX formats can be used given that React is well-supported.

Finally, the entire process has been simplified and streamlined, making use of modern development tools. The use of these tools has made it possible to create experiments that run both locally and on Gorilla. These tools have opened online experimentation to an enormous collection of open-source libraries that will hopefully lead to exciting and adventurous online experiments being created in the future.

I would appreciate any feedback that more experienced web developers may have on this project! I am somewhat new to web development, so any testing would be much-appreciated also.

## Updates

### Update 27 November 2021

You’ll see in most of the code snippets that interact with Gorilla or jsPsych, I make use of inline `require()` statements. This is not a good idea, and I have learnt otherwise recently. Fortunately it is an easy adjustment to make, simply substitute the `require()` statements for identical `import ...` statements at the top of the file. If you had been following along anyway, you should have included `import 'jspsych/jspsych'`. It is simply a matter of `import`-ing rather than `require()`-ing.

I have updated the code snippets accordingly.

### Update 03 September 2022

The idea behind this project has remained unchanged, however the delivery has changed significantly. I no longer would recommend using this guide. I would instead strongly recommend looking into my [Neurocog.js](https://github.com/Brain-Development-and-Disorders-Lab/Neurocog.js) project. This new project takes the problem being solved by this guide and packages an improved and tested solution into a user-friendly library that requires minimal configuration or source code changes.
