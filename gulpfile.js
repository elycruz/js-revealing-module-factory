/**
 * Created by elydelacruz on 2/21/17.
 */

'use strict';

const path =    require('path'),
    crypto =    require('crypto'),
    gulp =      require('gulp'),
    eslint =    require('gulp-eslint'),
    uglify =    require('gulp-uglify'),
    header =    require('gulp-header'),
    fncallback = require('gulp-fncallback'),
    sourcemaps = require('gulp-sourcemaps'),
    rollup =    require('gulp-better-rollup'),
    babel =     require('gulp-babel'),
    gulpIf =    require('gulp-if'),
    del =       require('del'),
    chalk =     require('chalk'),
    KarmaServer = require('karma').Server,
    log = console.log.bind(console),
    packageJson =   require('./package.json'),
    gulpConfig =   require('./gulpfileConfig.json'),

    // Common paths
    // Build path
    publicPath = './dist',

    fileHeaderBody = '<%= fileName %> <%= version %> | License: <%= license %> | Homepage: <%= homepage %> | ' +
        '<%= hashAlgo.toUpperCase() %> Checksum: <%= fileHash %> | Generated: <%= date %>',

    minifiedFileHeader = '/**! ' + fileHeaderBody + ' **/',

    iifeFileName = 'revealingModuleFactory',

    argv = require('yargs')
        .default('dev', false)
        .argv,
    devMode = argv.dev;

function clean () {
    const paths = gulpConfig.clean.srcArgs[0];
    return del(paths)
        .then(paths => {
            if (paths.length > 0) {
                log(chalk.dim('\nThe following file paths have been deleted: \n - ' + paths.join('\n - ') + '\n'));
            }
            else {
                log(chalk.dim(' - No paths to clean.') + '\n');
            }
        })
        .catch(log);
}

function eslintTask () {
    return gulp.src(['./src/js/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function karmaTask (done) {
    return new KarmaServer({
        configFile: __dirname + '/karma.conf.js'
        // singleRun: true
    }, done).start();
}

function buildJs () {
    const hashAlgo = 'sha1',
        data = {hashAlgo: hashAlgo, date: new Date()};
    return gulp.src.apply(gulp, gulpConfig.js.srcArgs)
        .pipe(sourcemaps.init())
        .pipe(rollup({moduleName: iifeFileName, format: 'iife'}))
        .pipe(babel())
        .pipe(gulpIf(!devMode, uglify()))
        .pipe(fncallback(function (file, enc, cb) {
            const hasher = crypto.createHash(hashAlgo);
            hasher.update(file.contents.toString(enc));
            data.fileHash = hasher.digest('hex');
            data.fileName = path.basename(file.path);
            cb();
        }))
        .pipe(header(minifiedFileHeader, Object.assign(data, packageJson)))
        .pipe(gulpIf(!devMode, sourcemaps.write(gulpConfig.paths.sourcemaps)))
        .pipe(gulp.dest(publicPath));
}

gulp.task('clean', clean);

gulp.task('eslint', eslintTask);

gulp.task('karma', karmaTask);

gulp.task('build-js', ['eslint'], buildJs);

gulp.task('build', ['build-js']);

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/**/*.@(json|js)', ['build-js']);
});

gulp.task('default', ['watch'], function () {
    if (devMode) {
        log('\nRunning in "--dev" mode.\n');
    }
    return Promise.resolve();
});
