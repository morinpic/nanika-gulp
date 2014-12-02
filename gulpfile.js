var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var browserify  = require('browserify');
// var source     = require('vinyl-source-stream');
var transform   = require('vinyl-transform');
var runSequence = require('run-sequence');
var saveLicense = require('uglify-save-license');

var path = {
  assets: 'assets',
  tmp: '.tmp',
  build: 'build'
};

gulp.task('connect', function() {
  $.connect.server({
    port: '9000',
    livereload: true
  });
});

gulp.task('compass', function() {
  return gulp.src(path.assets+'/scss/*.scss')
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'expanded',
      compass: true
    }))
    .pipe(gulp.dest(path.tmp+'/css'))
    .pipe($.connect.reload());
});

gulp.task('browserify', function() {
  return gulp.src(path.assets+'/js/*.js')
    .pipe($.plumber())
    .pipe(transform(function(filename){
      return browserify(filename).bundle();
    }))
    .pipe(gulp.dest(path.tmp+'/js'))
    .pipe($.connect.reload());
});

gulp.task('uglify', function() {
  return gulp.src(path.tmp+'/js/*.js')
    .pipe($.uglify({
      preserveComments: saveLicense
    }))
    .pipe(gulp.dest(path.build+'/js'));
});

gulp.task('clean:tmp', function() {
  return gulp.src(path.tmp, {read: false})
    .pipe($.clean());
});

gulp.task('watch', ['connect'], function() {
  gulp.watch(path.assets+'/js/*js', ['browserify']);
  gulp.watch(path.assets+'/scss/*scss', ['compass']);
});

gulp.task('server', function() {
  console.log('call server');
  runSequence(
    'clean:tmp',
    ['compass', 'browserify'],
    'watch'
  );
});