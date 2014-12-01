// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 * Module dependencies.
 */

var clc = require('cli-color')
    , Alto = require('../../runtime/lib/sc-runtime.js')
    , wrench = require('wrench')
    , fs = require('fs')
    , path = require('path')
    , s = require("string");

/*
 Expose Alto namespace
 */
Alto.new = module.exports = Alto;

Alto.new = Alto.Object.create({

    projectName: '',

    _templatesDirectory: 'templates/',

    _baseDir: s(__dirname).chompRight('lib').s,

    _templatesFullPath: function() {
        return this.get('_baseDir') + this.get('_templatesDirectory');
    }.property('_baseDir', '_templatesDirectory'),

    action: function (args) {

        if (!args[0]) {
            console.log(clc.red('alto new requires a project name.'));
            Alto.cli.displayOptions()
            return
        }

        this.set("projectName", args[0]);
        this.cloneProject();
    },

    cloneProject: function () {
        console.log(clc.xterm(118)("Creating a new alto project"));
        /**
         Copy the applications file structure from our templates
         */
        wrench.copyDirRecursive(this.get('_templatesFullPath') + 'new', this.get('projectName'), false, this._cloneProjectHandler);
        console.log(clc.xterm(159)('Bootstrapping application file structure.'));
    },

    _cloneProjectHandler: function (error) {
        var that = Alto.new;
        if (!error) {
            that._modifyClonedProjectFileContent();
        } else {
            console.log(error)
            console.log(clc.red('A project named ' + that.get('projectName') + ' already exists.  Canceling project creation.'));
        }
    },

    _modifyClonedProjectFileContent: function () {
        // find all javascript files
        var allContent = wrench.readdirSyncRecursive(this.get('projectName'))
            , allJavaScriptFiles = []
            , that = Alto.new;

        console.log(clc.xterm(159)('Creating application namespace.'));

        for (var i = 0, len = allContent.length; i < len; i++) {
            var file = allContent[i];

            filePath = path.join(that.get('projectName'), file);

            if (fs.lstatSync(filePath).isFile()) {
                that._writeApplicationNamespace(filePath);
            }

        }

        console.log(clc.xterm(159)('Application is ready.'));
    },

    _writeApplicationNamespace: function (file) {
        var that = Alto.new
            , projectNameCaps = s(that.get('projectName')).capitalize().s
            , data = fs.readFileSync(file, 'utf8')
            , newNameSpace = data.replace(/<project_name>/gi, projectNameCaps);

        fs.writeFileSync(file, newNameSpace)
    }

});