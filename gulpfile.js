var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var nib         = require('nib');
var browserify  = require('browserify');
var transform   = require('vinyl-transform');
var merge       = require('merge-stream');
var runSequence = require('run-sequence');
var saveLicense = require('uglify-save-license');
var spritesmith = require('gulp.spritesmith');
var browserSync = require('browser-sync');
var proxy       = require('proxy-middleware');
var reload      = browserSync.reload;

var path = {
  assets: 'assets',
  tmp: '.tmp',
  build: 'build'
};

gulp.task('stylus', function() {
  return gulp.src(path.assets+'/stylus/*.styl')
    .pipe($.plumber())
    .pipe($.stylus({
      use: nib()
    }))
    .pipe(gulp.dest(path.tmp+'/css'))
    .pipe(reload({stream:true}));
});

gulp.task('sprite', function() {
  var spriteData = gulp.src(path.assets+'/img/sprites/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.styl',
    imgPath: '../img/sprite.png',
    cssFormat: 'stylus'
  }));
  return merge(
    spriteData.img.pipe(gulp.dest(path.tmp+'/img')),
    spriteData.css.pipe(gulp.dest(path.assets+'/stylus/var'))
  );
});

gulp.task('browserify', function() {
  return gulp.src(path.assets+'/js/*.js')
    .pipe($.plumber())
    .pipe(transform(function(filename){
      return browserify(filename).bundle();
    }))
    .pipe(gulp.dest(path.tmp+'/js'))
    .pipe(reload({stream:true}));
});

gulp.task('jshint', function() {
  return gulp.src(path.assets+'/js/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('uglify', function() {
  return gulp.src(path.tmp+'/js/*.js')
    .pipe($.uglify({
      preserveComments: saveLicense
    }))
    .pipe(gulp.dest(path.build+'/js'));
});

gulp.task('copy:tmp', function() {
  return gulp.src([
      path.assets+'/**/*.!(styl|js|md)',
      '!'+path.assets+'/img/sprites/**'
    ])
    .pipe(gulp.dest(path.tmp));
});

gulp.task('clean:tmp', function() {
  return gulp.src(path.tmp, {read: false})
    .pipe($.clean());
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(path.assets+'/js/*js', ['browserify']);
  gulp.watch(path.assets+'/stylus/*styl', ['stylus']);
});

gulp.task('browser-sync', function() {
  var url = require('url');
  var proxyOptions = url.parse('http://localhost:8080/api');
  proxyOptions.route = '/api';

  browserSync({
    port: 3000,
    server: {
      baseDir: path.tmp,
      middleware: [proxy(proxyOptions)]
    }
  });
});

/*
gulp.task('mock-server', function() {
  browserSync({
    proxy: 'localhost:8080/easymock'
  });
});
*/

gulp.task('server', function() {
  runSequence(
    'clean:tmp',
    'sprite',
    ['copy:tmp','stylus', 'browserify'],
    'watch'
  );
});