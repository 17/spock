var ProjectManager = (function () {
    function ProjectManager() {
        this.projects = spock.storageService.getProjects();
    }

    ProjectManager.prototype.add = function (dir, cb) {

        //判断是否已经存在该项目
        var exist = false;
        _.each(this.projects, function (project) {
            if (!path.relative(project.path, dir)) {
                exist = true;
            }
        });

        if (!exist) {

            var project_name = path.basename(dir);
            var project_id = spock.util.uid(project_name);

            var GruntFile = findup('Gruntfile.{js,coffee}', {cwd: dir, nocase: true});
            var gulpFile = findup('gulpfile.js', {cwd: dir, nocase: true});

            if (!GruntFile && !gulpFile) {
                window.alert('Unable to find config file.');
                return
            }

            var type = GruntFile ? 'grunt' : gulpFile ? 'gulp' : null;

            if (type === 'grunt') {

                var grunt = require(dir + '/node_modules/grunt/');

                require(GruntFile)(grunt);
                var TaskList = grunt.task._tasks;

            } else if (type === 'gulp') {

                var resolve = require(dir + '/node_modules/gulp/node_modules/resolve/');
                var gulp = require(resolve.sync('gulp', {basedir: dir + '/node_modules/'}));

                require(gulpFile);
                var TaskList = gulp.tasks;

            }

            var tasks = [];
            _.each(TaskList, function (task) {
                tasks.push(task.name);
            });

            var project = {
                id: project_id,
                name: project_name,
                path: dir,
                tasks: tasks,
                type: type,
                config: {
                }
            };

            this.projects.push(project);
            spock.storageService.setProjects(this.projects);

            cb(project);
        }
    };


    ProjectManager.prototype.remove = function (id) {

        this.projects = _.reject(this.projects, function (project) {
            return project.id === id;
        });

        //更新 projects
        spock.storageService.setProjects(this.projects);

        //杀死项目的进程
        spock.terminalManager.killProjectWorkers(id);

    };

    ProjectManager.prototype.getById = function (id) {
        return _.find(spock.projectManager.projects, function (project) {
            return project.id == id;
        });
    };

    return ProjectManager;
})();