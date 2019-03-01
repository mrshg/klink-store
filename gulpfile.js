var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    stylus = require('gulp-stylus'),
    rupture = require('rupture'),
    autoprefixer = require('autoprefixer-stylus'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    nib = require('nib'),
    livereload = require('gulp-livereload'),
    include = require('gulp-include'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel');



var errorMessage = {
    message: "<%= error.message %>",
    title: "ERROR"
};

// Symfony paths
var assetLocation = 'src/AppBundle/Resources/public/';
var outputAssetLocation = 'web/assets/';

var paths = {
    allImages : [assetLocation + 'img/**/*.{png,jpg,jpeg,gif,svg}', assetLocation + '!img/svg_symbol_sprites/**', assetLocation + '!img/svg_css_sprites/**'],
    scripts:  [assetLocation + 'scripts/**/*.js', '!' + assetLocation + 'scripts/{app.js,imports,imports/**}'],
    scriptsCustom:  assetLocation + 'scripts/app.js',
    styles: assetLocation + 'styles/**/*.{styl,css}'
};

var outputDir = outputAssetLocation + 'dist/';

var imageminOptions = {
    optimizationLevel: 3,
    progressive: true,
    interlaced: true
};

var lrOptions = {
    // host: 'localhost',
    // port: 8080,
    //start: true,
    //quiet: true
};




// =============================================================================
// IMAGES
// =============================================================================
gulp.task('compressImages', function () {
    var dest = outputDir + '/img';
    return gulp.src(paths.allImages)
        .pipe(plumber())
        .pipe(imagemin( imageminOptions ))
        .on("error", notify.onError(errorMessage))
        .pipe(gulp.dest(dest))
        .pipe(livereload(lrOptions));
});


// =============================================================================
// SCRIPTS
// =============================================================================

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    //.pipe(concat('all.js'))
    //.pipe(uglify())
    .on("error", notify.onError(errorMessage))
    .pipe(gulp.dest(outputDir +  'scripts/'))
    .pipe(livereload(lrOptions));
});


gulp.task('scriptsCustom', function () {
  return gulp.src(paths.scriptsCustom)
    .pipe(plumber())
    .pipe(include())
    .on("error", notify.onError(errorMessage))
    .pipe(sourcemaps.init())
    .on("error", notify.onError(errorMessage))
    .pipe(babel())
    .on("error", notify.onError(errorMessage))
    //.pipe(concat('app.js'))
    //.on("error", notify.onError(errorMessage))
    .pipe(sourcemaps.write('.'))
    .on("error", notify.onError(errorMessage))
    //.pipe(uglify())
    //.on("error", notify.onError(errorMessage))
    .pipe(gulp.dest(outputDir +  'scripts/'))
    .pipe(livereload(lrOptions));
});


// =============================================================================
// STYLES
// =============================================================================
gulp.task('styles', function () {
    return gulp.src(assetLocation + 'styles/main.styl')
      .pipe(plumber())
      .pipe(stylus({
          //paths: ['src/styl/'],
          "include css": true,
          errors: true,
          compress: false,
          sourcemaps: true,
          // use: [rupture(), nib(), autoprefixer('last 4 version', 'safari 5', 'ie 8', 'ie 9', 'ios 6', 'android 4')]
          use: [rupture(), nib(), autoprefixer({ browsers: ['> 1%', 'IE 8', 'IE 9', 'IE 10', 'IE 11']})]

      }))
      .on("error", notify.onError(errorMessage))
      .pipe(gulp.dest(outputDir + 'styles'))
      .pipe(livereload(lrOptions));
});


// =============================================================================
// WATCHERS
// =============================================================================
gulp.task('watch', function() {
    livereload.listen(lrOptions);
    //GULP 4
    //watch(paths.markup, gulp.parallel('markup'));
    //watch(paths.scripts, gulp.parallel('scripts'));
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch([paths.scriptsCustom, assetLocation + 'scripts/components/*.js', assetLocation + 'scripts/models/*.js'], ['scriptsCustom']);
    gulp.watch(paths.allImages, ['compressImages']);
});

gulp.task('copyAssets', function () {
     gulp.src(assetLocation + 'fonts/*.*')
       .pipe(plumber())
       .pipe(gulp.dest(outputDir + 'fonts'));
});

gulp.task('basic', ['styles', 'scripts', 'scriptsCustom', 'compressImages', 'copyAssets']);
gulp.task('compile', ['basic']);
gulp.task('default', ['basic', 'watch']);
//gulp.task('default', function() {
//    gulp.watch(assetLocation + 'fonts/*', ['styles']);
//});


//@todo:task for bower components concat

//@todo:fix error with uglify
//gulp.task('prod', ['styles', 'scripts', 'compressImages', 'svgCssSprites', 'svgSymbolSprites'], function() {
//    gulp.src(outputDir + 'styles/*.css')
//        .pipe(concat('app.css'))
//        .pipe(uglify()).on("error", notify.onError(errorMessage))
//        .pipe(gulp.dest(outputDir));
//});


