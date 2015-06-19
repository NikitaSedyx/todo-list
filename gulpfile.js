var gulp = require("gulp");

var jade = require("gulp-jade")
var concat = require("gulp-concat")
var csso = require("gulp-csso")
var rename = require("gulp-rename")

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

gulp.task("watch", function(){
  gulp.watch("./*.jade", function(){
    gulp.run("compile-jade")
  })

  gulp.watch("./css/**/*.css", function(){
    gulp.run("concat-css")
  })
})

gulp.task("default", ["concat-css", "compile-jade", "watch"])