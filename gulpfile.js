const { src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const del = require('del');

function styles() {
  return src('app/scss/style.scss')
  .pipe(scss({outputStyle: 'compressed'}))
  .pipe(concat('style.min.css')) 
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 version'],
    grid: true
  }))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())
}
function scripts () {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function img(){
  return src('app/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
      {removeViewBox: true},
			{cleanupIDs: false}
      ]
    })
  ]))
  .pipe(dest('dist/images'))
}

function build() {
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')

}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notofy: false
  })
}


function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*html']).on('change', browserSync.reload);
}

exports.styles = styles; 
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.img = img;
exports.build = build;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, img, build);
exports.default = parallel(styles, scripts, browsersync, watching);