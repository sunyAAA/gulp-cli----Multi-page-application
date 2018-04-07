var gulp = require('gulp')
var stylus = require('gulp-stylus')                 
var autoprefixer = require('gulp-autoprefixer')
var nib = require('nib')
var csso = require('gulp-csso')
var uglify = require('gulp-uglify')
var babel = require('gulp-babel')
var minimist = require('minimist')
var rename = require('gulp-rename')
var include = require('gulp-file-include')

var browserify = require('browserify')
var through2 = require('through2')

var connect = require('gulp-connect')

var knownOptions = {
  string: 'name',
  default: { name: process.env.NODE_ENV || 'template' }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('mkFile',function(){
  console.log(options.name)
  gulp.src('./src/template.html')
    .pipe(include())
    .pipe(rename(options.name+'.html'))
    .pipe(gulp.dest('./dist'))
    
})


//   stylus 编译压缩
gulp.task('stylus',function(){
  return gulp.src('./src/styl/*.styl')
            .pipe(stylus({
              use : nib
            }))
            .pipe(autoprefixer())
            .pipe(csso())
            .pipe(gulp.dest('./dist/style'))
            .pipe(connect.reload());
})


//   CommonJS规范编译打包   ES5
gulp.task('browserify', function() {
  return gulp.src('./src/js/*.js')
    .pipe(through2.obj(function(file, enc, next) {
      browserify(file.path)
        // .transform(reactify)
        .bundle(function(err, res) {
          err && console.log(err.stack);
          file.contents = res;
          next(null, file);
        });
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify()) 
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload());
});

//单独的html热更新
gulp.task('html', function () {
  gulp.src('./dist/*.html')
    .pipe(connect.reload());
});

// 启动开发服务器
gulp.task('connect', function() {
  connect.server({
    root: './dist',
    livereload: true,
    port : 8001
  });
});

// 热更新监控 监听了依赖项
gulp.task('watch', function(){
  gulp.watch('./src/styl/base/*.styl',['stylus'])
  gulp.watch('./src/styl/*.styl', ['stylus']);
  gulp.watch('./src/js/models/*.js', ['browserify']);
  gulp.watch('./src/js/*.js', ['browserify']);
  gulp.watch('./dist/*.html', ['html']);
})

gulp.task('dev',['connect','html','stylus','browserify','watch'])