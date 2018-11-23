const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const twig = require('gulp-twig');
const data = require('gulp-data');
const beautifyCode = require('gulp-beautify-code');
const path = require('path');
const fs = require('fs');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require("gulp-uglify");
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const autoprefixer = require("gulp-autoprefixer");
const rtlcss = require("gulp-rtlcss");
const cleanCss = require('gulp-clean-css');
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');

const project_name = 'dist';
const pathFiles = {
  sass: {
    src: ['src/sass/*.scss'],
    all: ['src/sass/**/*.scss'],
    dest: ['src/assets/css/']
  },
  twig: {
    data: ['src/data/'],
    type: 'html',
    src: ['src/views/*.html'],
    all: ['src/views/**/*.html', 'src/data/**/*.json'],
    dest: [project_name]
  },
  es7: {
    src: ['src/scripts/**/*.js'],
    dest: ['src/assets/js/']
  },
  cssFiles: {
    src: ['src/assets/css/**/*.css'],
    rtl: ['src/assets/css/style.css'],
    dest: [project_name + '/assets/css/']
  },
  jsFiles: {
    src: ['src/assets/js/**/*.js'],
    dest: [project_name + '/assets/js/']
  },
  libFiles: {
    src: ['src/assets/libraries/**/*'],
    dest: [project_name + '/assets/libraries/']
  },
  fontFiles: {
    src: ['src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}'],
    dest: [project_name + '/assets/fonts/']
  },
  imageFiles: {
    src: ['src/assets/images/**/*.{jpg,jpeg,png,svg,ico,gif}'],
    dest: [project_name + '/assets/images/']
  }
};

/**
 * Clean build project
 */
gulp.task('clean', () => {
  return del([project_name]);
});

/**
 * Compile Twig/Html files
 */
gulp.task('twigFiles', () => {
  let jsonData = undefined;
  return gulp.src(pathFiles.twig.src)
    .pipe(data(function (file) {
      jsonData = JSON.parse(fs.readFileSync(pathFiles.twig.data + path.basename(file.path).replace(pathFiles.twig.type, '') + 'json'));
      return jsonData;
    }))
    .pipe(twig({
      data: jsonData
    }))
    .pipe(beautifyCode({
      indent_size: 4,
      unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br'],
      preserve_newlines: false
    }))
    .pipe(gulp.dest(pathFiles.twig.dest))
    .pipe(browserSync.stream());
});

/**
 * Compile ES7 Javascript
 */
gulp.task('es7Files', () => {
  return gulp.src(pathFiles.es7.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('all.bundle.js'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(pathFiles.es7.dest))
    .pipe(browserSync.stream());
});

/**
 * Compile Sass files
 */
sass.compiler = require('node-sass');
gulp.task('sassFiles', () => {
  return gulp.src(pathFiles.sass.src)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sourcemaps.init())
    .pipe(sass.sync({
      outputStyle: 'expanded',
      errLogToConsole: true
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./maps'))
    .pipe(plumber.stop())
    .pipe(gulp.dest(pathFiles.sass.dest))
    .pipe(browserSync.stream({
      match: "**/*.css"
    }));
});

/**
 * RTL stylesheet file
 */
gulp.task('rtlFile', () => {
  return gulp.src(pathFiles.cssFiles.rtl)
    .pipe(sourcemaps.init())
    .pipe(rtlcss())
    .pipe(rename({
      suffix: "-rtl"
    }))
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest(pathFiles.sass.dest))
    .pipe(browserSync.stream({
      match: "**/*.css"
    }));
});

/**
 * CSS files
 */
gulp.task('cssFiles', () => {
  return gulp.src(pathFiles.cssFiles.src)
    // .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(gulp.dest(pathFiles.cssFiles.dest))
    .pipe(browserSync.stream());
});

gulp.task('cssFiles:min', () => {
  return gulp.src(pathFiles.cssFiles.src)
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(pathFiles.cssFiles.dest))
    .pipe(browserSync.stream());
});

/**
 * JS files
 */
gulp.task('jsFiles', () => {
  return gulp.src(pathFiles.jsFiles.src)
    .pipe(gulp.dest(pathFiles.jsFiles.dest))
    .pipe(browserSync.stream())
});

gulp.task('jsFiles:min', () => {
  return gulp.src(pathFiles.jsFiles.src)
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(pathFiles.jsFiles.dest))
    .pipe(browserSync.stream())
});

/**
 * Font files
 */
gulp.task('fontFiles', () => {
  return gulp.src(pathFiles.fontFiles.src)
    .pipe(gulp.dest(pathFiles.fontFiles.dest))
    .pipe(browserSync.stream())
});

/**
 * Library files
 */
gulp.task('libFiles', () => {
  return gulp.src(pathFiles.libFiles.src)
    .pipe(gulp.dest(pathFiles.libFiles.dest))
    .pipe(browserSync.stream())
});

/**
 * Image minify files
 */
gulp.task('imageFiles', () => {
  var configs = {
    progressive: true,
    svgoPlugins: [{
      removeViewBox: false
    }],
    use: [pngquant()]
  };

  return gulp.src(pathFiles.imageFiles.src, {
      since: gulp.lastRun('imageFiles')
    })
    .pipe(imagemin({
      optimizationLevel: 5
    }, configs))
    .pipe(gulp.dest(pathFiles.imageFiles.dest))
    .pipe(browserSync.stream());
});

/**
 * Start browserSync and watch change files
 */
gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: "./" + project_name,
      directory: false
    }
  });

  gulp.watch(pathFiles.twig.all, gulp.series('twigFiles'));
  gulp.watch(pathFiles.es7.src, gulp.series('es7Files'));
  gulp.watch(pathFiles.sass.all, gulp.series('sassFiles', 'rtlFile'));
  gulp.watch(pathFiles.cssFiles.src, gulp.series('cssFiles', 'cssFiles:min'));
  gulp.watch(pathFiles.jsFiles.src, gulp.series('jsFiles', 'jsFiles:min'));
  gulp.watch(pathFiles.imageFiles.src, gulp.series('imageFiles'));
  gulp.watch(pathFiles.fontFiles.src, gulp.series('fontFiles'));
  gulp.watch(pathFiles.libFiles.src, gulp.series('libFiles'));
});

/**
 * Build files
 */
const build = gulp.series('clean', gulp.parallel('twigFiles', 'sassFiles', 'es7Files'), gulp.parallel('cssFiles', 'cssFiles:min', 'jsFiles', 'jsFiles:min', 'imageFiles', 'fontFiles', 'libFiles'));
gulp.task('build', build);

/**
 * Export default task
 */
gulp.task('default', gulp.series('build', 'watch'));
