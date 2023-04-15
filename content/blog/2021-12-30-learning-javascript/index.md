---
title: Learning JavaScript
date: "2021-12-30"
description: "My head spent the year in JavaScript, I've dumped some of my experiences and learnings here."
archive: true
---

Here I want to write a bit about my adventure being new to JavaScript as a software engineering grad. My coursework focussed on OOP-adjacent languages such as Java and Python, and I had little-to-no coursework using JavaScript.

I’m going to include some **real** source code, to show you that this honestly where I was at. For more context, I’ll be referring to a project I’ve been working on for about 18 months now, a project I joined in the final year of my studies before becoming part of my first research job outside of university.

I think I started how most people start when learning - ‘vanilla’ JavaScript, HTML, and CSS. No fancy frameworks or tools, just the .js, .html, and .css files in my text editor and Chrome. I had made myself a personal website, just a small site hosted statically on GitHub Pages. In high school, I had always enjoyed playing around with at least HTML and CSS (JavaScript was a mystery to me). Looking back at the quality of the code and knowing what I know now, it’s easy to shudder at the horrors of having to build web content like this. To put it in perspective, that was all I understood at the time - it’s easy to forget that we all have to start somewhere.

## My first real project

I joined a research project in July 2020, and I needed to build some online experiments. Obviously JavaScript was the way to go. I stumbled across the jsPsych library, and needed to include it in my project. Naturally I just downloaded it and referenced it in the HTML file I created. Here’s one of the early project structures:

```Text
- task/
  - css/
  - img/
  - js/
    - jspsych-6/
       ...
    - Board.js
    - Card.js
    - Game.js
    - GameManager.js
    - Main.js
  - README.md
  - index.html
```

You’ll notice that I was still somewhat OOP-minded when creating the structure, one file per JavaScript ‘class’.

I did need to generate HTML, so I went ahead and manually created it before setting the value of `innerHTML` on the target.

```HTML
html += "<table>"
html += "<tr>"
html += "<td>"
```

This made sense to me at the time, and it served me well for quite a while!

## `document.createElement`-ing

As I learnt more about JavaScript and its relationship with the DOM, I started using JavaScript to create and modify DOM elements programmatically. While I think this is perfectly reasonable for modification, such as `style` or `innerText`, I found it to be quite tedious when creating elements. I just felt like there was a lot of duplicate code and repetitive lines - it wasn’t fun writing this code.

```JavaScript
const heading = document.createElement('h1');
heading.className = 'instructions-heading';
heading.innerText = 'Instructions';
document.body.appendElement(heading);```
```

I think the snippet above sums up the `createElement` experience well, creating a new ‘part’ requires the same few lines:

- Creating it using the createElement command.
- Assigning a className if styling existed.
- Assigning the value or content if required.
- Appending the element to the body or wherever it is meant to go.

For a while, I used a combination of `document.createElement` and generating HTML before assigning `innerHTML`.

## The advent of NPM

There was a lot going on with this project, and I hadn’t really had time to experiment with proper tools or frameworks up until this point, I was basically still working with ‘vanilla’ JavaScript. When I found some time over the summer break, I read up on NPM. I had heard of NPM along the way, but I had never really looked into it. What a wonderful discovery this was! You mean I don’t have to store jsPsych with my source code? import is a thing? Libraries?

### The world opens up

Once I worked out that I needed a `package.json` file, I set to work identifying some libraries I could use. I was able to move jsPsych to being a dependency, and I started looking for other useful tools I might be able to integrate with my project.

### Workflow automation

This is the part where I talk about Gulp. I don’t know why I chose Gulp for my project, I just remember the name from reading articles about web development.

Honestly, (possibly controversial) I feel like there is no way your average developer actually critically evaluates different tooling options before choosing something. They just use whatever they are familiar with, however they came across it. Learning a new tool, from experience, is a tedious process! It makes sense to just shoehorn a familiar tool into the requirements.

I was getting frustrated while testing my project - I was having to move and copy files manually before I could preview it in the browser. I inadvertently created a bootleg development server in the process.

Gulp just copied over images and code into one directory when I wanted to test the project, and I ran a `http-server` instance in that folder. Sure, I needed to run gulp build every time I needed to refresh the project in the browser, but it absolutely made life easier. Obviously Gulp is a far more capable tool, but that’s all I knew of at the time.

Initially, I didn’t fully understand the purpose of the node_modules folder and how it was interacted with. This is the first Gulp task I created:

```JavaScript
const { src, dest } = require('gulp');

function defaultTask(cb) {
    // Install jsPsych plugins.
    src("js/src/jspsych-**.js")
    .pipe(dest("node_modules/jspsych/plugins"));
    cb();
}

exports.default = defaultTask
```

At the time, I had in my head that I would use the `<script>` tags in my HTML file to reference files only in the `node_modules` folder. Naturally, my concept of ‘installing’ my code was to copy it into a destination in the node_modules folder.

The following month, my strategy switched, and I decided to create a build task that simply copied everything required to run the project into a `dist/` directory. A snippet from this Gulp task is below:

```JavaScript
// Copy from 'node_modules/'
src('node_modules/jspsych/**/*')
  .pipe(dest(`dist/${projects&#91;i]}/js/jspsych`));
```

What a rollercoaster! We’ve gone from copying files *into* `node_modules` to now copying files *out* of `node_modules`. This was an interesting phase of the project.

### Types

Around the same time I started looking into NPM, I decided that TypeScript was also worth investigating. I remember a few friends during my coursework talking about TypeScript and how they used it to build some web apps or used it at their internships - I had never thought of using it myself.

The scary part for me was needing a compiler. That was until I saw you could still include JavaScript alongside your TypeScript files. So, I jumped right in and instead of sensibly starting with just one file, I started trying to get the entire project translated to TypeScript. I remember playing around with just the compiler using the documentation, but I was finding I wasn’t sure what I wanted the compiler to generate. I wanted to be able to test my task locally! How was I supposed to compile my TypeScript then test it in the browser?

### Configuration hell and operator error

Before I go on, I need to talk about the mess I found myself in trying to integrate all these new tools at once. Don’t get me wrong, it is definitely possible (I use all of them now), but when you are new to the tools and ecosystems, I found myself in **configuration hell** for days on end. Nothing seemed to work at first. package.json, .config.js files, TypeScript, Gulp, NPM, everything had errors it seemed, and apparently import wasn’t recognized in the browser? All these promises from the tools and their nice websites, but nothing was working?

### Redemption

After all these difficulties while attempting to integrate an entire ecosystem of tools, I went looking for boilerplate code or miracle tools that would automatically set everything up for me. I found TSDX and Webpack initially. I really liked TSDX because it seemed to work out of the box, but it was more focussed on creating libraries, which I wasn’t (or I thought I wasn’t).

This left me looking to Webpack. I also had heard of Webpack from a friend who created games in JavaScript, so I understood it was some sort of packaging tool. Looking into it further, I found all the potential solutions to my problems - TypeScript compilation, development servers? Webpack had it all.

### Packing up

After plenty of Googling, trial-and-error, and StackOverflow searching, I finally created a Webpack configuration that allowed me to have live previews in the browser after compiling all of my TypeScript and JavaScript source code. I was finally able to ditch my template HTML file since the development server generated one for me! I had finally moved entirely over to JavaScript for generating HTML.

I quickly learnt that I wasn’t supposed to copy files from `node_modules`, Webpack allowed me to use import statements and would organize the files for me! I obviously went through and cleaned up the tasks in gulpfile.js. I was still outputting to the dist/ directory, but I was outputting ‘compiled’ JavaScript rather than just copying files from `node_modules`.

At this point in time, I was happy with how the codebase was structured. I was using tools properly now, and the code quality had noticeably improved now that TypeScript was providing an enhanced development experience inside Visual Studio Code. I had also integrated ESLint.

## Exploring frameworks

Even after I had integrated NPM and other tools, I didn’t think of using React or a similar framework in the project. For sure, this saved me plenty of time when previewing and testing the project, but one issue still remained - creating and updating the DOM still felt clunky and dangerous! Additionally, some of the project required complex interfaces and stimuli that was becoming difficult to create and test using `innerHTML` and `document.createElement()`.

### React

I honestly chose React because it was the only framework I had heard of people using. I didn’t know where to get started with the framework, but the documentation seemed to indicate that there was a ‘component’ system that could be described using the same angle-brace notation as regular HTML.

I had no idea what the render function was, I didn’t even know I needed a `react-dom` library! I started by playing around with React in a separate project, and I copied over most of the configuration I set up from my original project.

After throwing together a few components, I created a set of screens for my project, and finally I created a ‘switcher’ for changing the screen. The months leading up to learning React was when I was learning the most. Trying to integrate multiple large tools at once taught me many things very quickly. I think integrating React and learning the basics was actually one of the easier and most enjoyable stages of this project.

Don’t get me wrong, there are plenty of React things I don’t fully understand yet - rest assured I spent some days just trying to work out how my `useState` and `useEffect` hooks were breaking the rules.

## What have I learned?

Adjacent to all the frameworks and tools, I learnt more about how I learn. While experimenting with the tools, I was finding that the easiest way for me to learn these tools was to be using them actively in a project. The whole ‘learn by doing’ thing works for me, it may not work for you.

Learning React or TypeScript is more about learning tools rather than a language. Your knowledge of the language will impede you much less than your knowledge of using tools in your development process.

You don’t *have* to use all these frameworks and tools. Sure, it makes your life much easier, but technically everything is still compiled into JavaScript. Prior to finding these tools, the ‘vanilla’ JavaScript path was successful to an extent.

Don’t try and learn multiple new tools at once. I managed to finally get my head around them just recently. In all the Googling to try and get the tools to play nicely, I copied parts of configurations and used a trial-and-error strategy to get things working. I’ve recently reviewed the configurations for my own benefit to try and understand what exactly is going on.

Definitely use tools like TSDX. It makes your life much easier - you probably won’t have to get stuck in configuration files. There is merit, however, to doing some tooling yourself. It gives you the opportunity to really learn a tool and how you can use it in your specific context.

## In conclusion

This has been me just rambling about my experience starting with JavaScript and ending with a cyclonic collaboration of tools generating some nice web content. All of this is just my opinion though, I’m still learning the quirks of these tools as I continue to use them.
