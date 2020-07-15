# Puppeteer + Katex

This project accompanies a blog post found on my [website](https://blog.dennisokeeffe.com).

## Install globally on the local

```s
yarn deploy
```

## Getting started

```s
yarn
```

## Running examples

```s
rough - Quick RoughJS diagram generator

Examples
---

> rough "Testing this this{} | Another one | Third one {fill: 'red'}"
> rough "Testing this this{fill: 'blue', fillWeight: 3, hachureGap: 8} | Another one | Third one{fill: 'red'} | Final square {fillStyle: 'solid'}"
> rough "This is a very long sentence that will resize the box | This box will keep that width {fill: 'yellow', hachureGap: 3} "

Rough Options
---
hachureAngle: 60 // angle of hachure
hachureGap: 8 // gap between hachure lines
fillStyle: 'solid' // solid fill
fillWeight: 3 // thicker lines for hachure
```

## Resources

1. [Open Sans](https://fonts.google.com/specimen/Open+Sans?sidebar.open&selection.family=Open+Sans)
2. [Text onto Canvas](https://www.w3schools.com/graphics/canvas_text.asp)
3. [RoughJS](https://roughjs.com/)
4. [Puppeteer](https://github.com/puppeteer/puppeteer)
5. [Yargs Parser](https://github.com/yargs/yargs-parser)
6. [Screenshots with Puppeteer - Blog Post](https://blog.dennisokeeffe.com/blog/2020-07-01-screenshot-anything-with-puppeteer/)
7. [Intro Yargs Parser - Blog Post](https://blog.dennisokeeffe.com/blog/yargs-parser/)
