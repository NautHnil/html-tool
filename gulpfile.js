const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const del = require('del');
const path = require('path');
const babel = require('gulp-babel');
const beautifyes6 = require('gulp-beautify');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const rtlcss = require('gulp-rtlcss');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

var projectName = path.basename(__dirname);

/**
 * Clean build
 */
gulp.task('clean:dist', function () {
  return del('./' + projectName);
});

gulp.task('clean', gulp.series('clean:dist'));

/**
 * HTML
 */
gulp.task('html', function () {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./' + projectName))
    .pipe(browserSync.stream());
});

/**
 * Compile SASS, minify and run stylesheet throught autoperfixer.
 */
gulp.task('sass', function () {
  return gulp.src('./src/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded', errLogToConsole: true }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./src/assets/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('css', function () {
  return gulp.src('./src/assets/css/**/*.css')
    .pipe(autoprefixer())
    .pipe(gulp.dest('./' + projectName + '/assets/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('css:min', function () {
  return gulp.src(['./src/assets/css/style.css', './src/assets/css/style-rtl.css'])
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./src/assets/css'));
});

/**
 * Convert stylesheet RTL
 */
gulp.task('rtlcss', function () {
  return gulp.src('./src/assets/css/style.css')
    .pipe(rtlcss())
    .pipe(rename({ suffix: '-rtl' }))
    .pipe(gulp.dest('./src/assets/css'));
});

/**
 * Compile ES6, minify and run js copy
 */
gulp.task('es6', function () {
  return gulp.src('./src/scripts/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(beautifyes6({ indent_size: 2 }))
    .pipe(gulp.dest('./src/assets/js'))
    .pipe(browserSync.stream({ match: '**/*.js' }));
});

gulp.task('js', function () {
  return gulp.src('./src/assets/js/**/*.js')
    .pipe(gulp.dest('./' + projectName + '/assets/js'));
});

/**
 * Images copy
 */
gulp.task('images', function () {
  return gulp.src('./src/assets/images/**/*')
    .pipe(gulp.dest('./' + projectName + '/assets/images'))
    .pipe(browserSync.stream());
});

/**
 * Minify Images
 */
gulp.task('images:min', function () {
  var configs = {
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [pngquant()]
  };

  return gulp.src('./' + projectName + '/assets/images/**/*')
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest('./' + projectName + '/assets/images'));
});

/**
 * Fonts copy
 */
gulp.task('fonts', function () {
  return gulp.src('./src/assets/fonts/**/*')
    .pipe(gulp.dest('./' + projectName + '/assets/fonts'))
    .pipe(browserSync.stream());
});

/**
 * Start browsersync and watch change file.
 */
gulp.task('watch', function () {
  browserSync.init({
    server: {
      baseDir: './' + projectName,
      directory: false
    }
  });

  gulp.watch('./src/*.html').on('change', gulp.parallel('html'), browserSync.reload());

  gulp.watch('./src/sass/**/*.scss', gulp.parallel('sass', 'rtlcss', 'css:min'));

  gulp.watch('./src/assets/css/**/*.css', gulp.parallel('css'));

  gulp.watch('./src/scripts/**/*.js', gulp.parallel('es6'));

  gulp.watch('./src/assets/js/**/*.js', gulp.parallel('js'));

  gulp.watch('./src/assets/fonts/**/*', gulp.parallel('fonts'));

  gulp.watch('./src/assets/images/**/*', gulp.parallel('images'));
});

/**
 * Build gulp
 */
gulp.task('build', gulp.series('clean', 'html', 'sass', 'rtlcss', 'css:min', 'css', 'es6', 'js', 'fonts', 'images'));

gulp.task('default', gulp.series('build', 'watch'));
