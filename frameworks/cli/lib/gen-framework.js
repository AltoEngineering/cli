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
Alto.genFramework = module.exports = Alto;


Alto.genFramework = Alto.Object.create ({

    frameworkName: '',

    _applicationNamespace: '',

    _baseDir: s(__dirname).chompRight('lib').s,

    _templateDirectoryPath: 'templates/framework',

    _templateFilePath: 'templates/framework/framework_template.js',

    _fullTemplateDirectoryPath: function () {
        return this.get('_baseDir') + '/' + this.get('_templateDirectoryPath');
    }.property('_baseDir', '_templateDirectoryPath'),

    _fullTemplateFilePath: function () {
        return this.get('_baseDir') + this.get('_templateFilePath');
    }.property('_baseDir', '_templateFilePath'),

    _templatesFullPath: function() {
        return this.get('_baseDir') + this.get('_templatesDirectory');
    }.property('_baseDir', '_templatesDirectory'),

    action: function (args) {

        if (!args[0]) {
            console.log(clc.red('alto framework requires a framework name.'));
            Alto.cli.displayOptions()
            return
        }

        this.set("frameworkName", args[0]);
        this.cloneTemplate();
    },

    cloneTemplate: function () {
        var fileTemplate = fs.createReadStream(this.get('_fullTemplateFilePath'))
            , fileData = fs.readFileSync(fileTemplate.path, 'utf8')
            , file = fileData.replace(/<framework_name>/gi,  s(this.get('frameworkName')).capitalize().s);

        this._writeFile(file);
    },

    _writeFile: function (file) {
        wrench.mkdirSyncRecursive('frameworks/' + this.get('frameworkName'), 0777);

        if (fs.existsSync('app/frameworks/' + this.get('frameworkName') + '/core.js')) {
            console.log(clc.red('A framework named ' + this.get('frameworkName')  + ' already exists.  ' +
            'Canceling framework creation.'));
        } else {
            fs.writeFileSync('frameworks/' + this.get('frameworkName') + '/core.js', file)
        }

    },

    cloneProject: function () {
        console.log(clc.xterm(118)("Creating a new framework"));
        /**
         Copy the applications file structure from our templates
         */

        wrench.copyDirRecursive(this.get('_templatesFullPath') + 'framework', process.cwd() + '/framework/' + this.get('frameworkName'), false, this._cloneProjectHandler);
    },

    _cloneProjectHandler: function (error) {
        var that = Alto.genFramework;
        if (!error) {
            that._modifyClonedProjectFileContent();
        } else {
            console.log(error)
            console.log(clc.red('A project named ' + that.get('frameworkName') + ' already exists.  Canceling project creation.'));
        }
    },

    _modifyClonedProjectFileContent: function () {
        // find all javascript files
        var allContent = wrench.readdirSyncRecursive(process.cwd() + '/framework/' + this.get('frameworkName'))
            , allJavaScriptFiles = []
            , that = Alto.genFramework;

        for (var i = 0, len = allContent.length; i < len; i++) {
            var file = allContent[i];

            filePath = path.join(process.cwd() + '/framework/' + this.get('frameworkName'), file);

            if (fs.lstatSync(filePath).isFile()) {
                that._writeApplicationNamespace(filePath);
            }

        }

        console.log(clc.xterm(159)('Application is ready.'));
    },

    _writeApplicationNamespace: function (file) {
        var that = Alto.genFramework
            , frameworkNameCaps = s(that.get('frameworkName')).capitalize().s
            , data = fs.readFileSync(file, 'utf8')
            , newNameSpace = data.replace(/<framework_name>/gi, frameworkNameCaps);

        fs.writeFileSync(file, newNameSpace)
    }

});