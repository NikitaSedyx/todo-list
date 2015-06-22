var gulp = require("gulp");

var jade = require("gulp-jade")
var concat = require("gulp-concat")
var csso = require("gulp-csso")
var rename = require("gulp-rename")
var uglify = require("gulp-uglify")
var jshint = require("gulp-jshint")

gulp.task("compile-jade", function(){
  gulp.src("./*.jade")
    .pipe(jade({
      pretty:true
    }))
    .on("error", console.log)
    .pipe(gulp.dest("./build"))
})

gulp.task("concat-css", function(){
  gulp.src("./css/**/*.css")
    .pipe(concat("index.css"))
    .pipe(gulp.dest("./build/css"))
    .pipe(rename("index.min.css"))
    .pipe(csso())
    .pipe(gulp.dest("./build/css"))
})

gulp.task('lint', function() {
  gulp.src("./js/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task("concat-js", function(){
  gulp.src("./js/**/*.js")
    .pipe(concat("index.js"))
    .pipe(gulp.dest("./build/js"))
    .pipe(rename("index.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./build/js"))
})

gulp.task("watch", function(){
  gulp.watch("./*.jade", function(){
    gulp.run("compile-jade")
  })

  gulp.watch("./css/**/*.css", function(){
    gulp.run("concat-css")
  })

  gulp.watch("./js/**/*.js", function(){
    gulp.run("concat-js")
  })
})

gulp.task("default", ["concat-js", "concat-css", "compile-jade", "watch"])