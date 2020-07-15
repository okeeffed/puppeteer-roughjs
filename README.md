# Puppeteer + Katex

This project accompanies a blog post found on my [website](https://blog.dennisokeeffe.com).

## Getting started

```s
yarn
```

## Running examples

```s
node index.js --math="f(a,b,c) = (a^2+b^2+c^2)^3"
node index.js --math="u=\frac{-y}{x^2+y^2}\,,\quad v=\frac{x}{x^2+y^2}\,,\quad w=0\,."
node index.js --math="e^x=1+x+\frac{x^2}{2}+\frac{x^3}{6}+\cdots=\sum_{n\geq0}\frac{x^n}{n!}"
node index.js --math="\int_a^bu\frac{d^2v}{dx^2}\,dx=\left.u\frac{dv}{dx}\right|_a^b-\int_a^b\frac{du}{dx}\frac{dv}{dx}\,dx."
```
