var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var browserify  = require('browserify');
var transform   = require('vinyl-transform');
var runSequence = require('run-sequence');
var saveLicense = require('uglify-save-license');
var spritesmith = require('gulp.spritesmith');

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

gulp.task('sprite', function() {
  var spriteData = gulp.src(path.assets+'/img/sprites/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../img/sprite.png'
  }));
  spriteData.img.pipe(gulp.dest(path.tmp+'/img'));
  spriteData.css.pipe(gulp.dest(path.assets+'/scss/var'));
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

gulp.task('copy:tmp', function() {
  return gulp.src([
      path.assets+'/**/*.!(scss|js|md)',
      '!'+path.assets+'/img/sprites/**'
    ])
    .pipe(gulp.dest(path.tmp));
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
  runSequence(
    'clean:tmp',
    'sprite',
    ['copy:tmp','compass', 'browserify'],
    'watch'
  );
});