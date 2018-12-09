# HTML Tool

## Install

Make sure you have `npm` and `gulp 4` installed on your system.

### Installing gulp 4 globally

You will need to remove your current gulp global package before installing v4 in order to do an upgrade.

```
npm rm -g gulp
npm install -g gulp-cli
```

This command removes your current global package and installs v4 from the gulp-cli 4.0 branch.
Make sure you don't get any errors from the first command before you type the second.

To verify what version you have installed globally, you can run the below command (and should see a similar output).

```
$ gulp -v
CLI version 2.0.1
```


## How to run

Open your terminal (cmd) and run commands below:

```
cd project_folder
npm install
gulp
```


## Preview

[VIEW DEMO](#)


## Twig template engine

- [Documentation: Vietnamese](https://viblo.asia/p/twig-trong-template-DZrGNNLjGVB)

- [Documentation: English](https://twig.symfony.com/doc/2.x/templates.html)


## Project structure folder

    .
    ├── dist                     # Compiled files
    ├── src                      # Source files
    │   ├── assets
    │   │   ├── css
    │   │   ├── fonts
    │   │   ├── images
    │   │   ├── js
    │   │   └── libraries
    │   ├── data
    │   ├── sass
    │   │   ├── base
    │   │   ├── components
    │   │   ├── layouts
    │   │   ├── libraries
    │   │   ├── mixins
    │   │   └── style.scss
    │   ├── scripts
    │   └── views
    │       ├── parts
    │       │   ├── components
    │       │   ├── extras
    │       │   ├── includes
    │       │   │   └── sidebar
    │       │   └── pages
    │       ├── shared
    │       │   └── layout.html
    │       └── index.html
    └── README.md

> Add new page & Add new data.
>
> Ex: `src/views/page_name.html`, `src/data/page_name.json`

## Libraries CSS/JS/FONTS

- Bootstrap 4: [https://getbootstrap.com/docs/4.1/getting-started/introduction/](https://getbootstrap.com/docs/4.1/getting-started/introduction/)
- Swiper Slide: [https://idangero.us/swiper/demos/](https://idangero.us/swiper/demos/)
- PhotoSwipe: [http://photoswipe.com/](http://photoswipe.com/)
- FontAwesome 5: [https://fontawesome.com/icons?d=gallery](https://fontawesome.com/icons?d=gallery)
