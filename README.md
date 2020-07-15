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

> node index.js "Testing this this{} | Another one | Third one {fill: 'red'}"
> node index.js "Testing this this{fill: 'blue', fillWeight: 3, hachureGap: 8} | Another one | Third one{fill: 'red'} | Final square {fillStyle: 'solid'}"
> node index.js "This is a very long sentence that will resize the box | This box will keep that width {fill: 'yellow', hachureGap: 3} "

Roughjs Options
---
hachureAngle: 60 // angle of hachure
hachureGap: 8 // gap between hachure lines
fillStyle: 'solid' // solid fill
fillWeight: 3 // thicker lines for hachure
```
