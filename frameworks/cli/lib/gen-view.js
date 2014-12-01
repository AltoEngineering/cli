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
    , s = require("string");

/*
 Expose Alto namespace
 */
Alto.genView = module.exports = Alto;

Alto.genView = Alto.Object.create ({

    viewName: '',

    _applicationNamespace: '',

    _baseDir: s(__dirname).chompRight('lib').s,

    _templateDirectoryPath: 'templates/view',

    _templateFilePath: 'templates/view/view_template.js',

    _fullTemplateDirectoryPath: function () {
        return this.get('_baseDir') + '/' + this.get('_templateDirectoryPath');
    }.property('_baseDir', '_templateDirectoryPath'),

    _fullTemplateFilePath: function () {
        return this.get('_baseDir') + this.get('_templateFilePath');
    }.property('_baseDir', '_templateFilePath'),

    action: function (args) {
        if (!args[0]) {
            console.log(clc.red('alto view requires a view name.'));
            Alto.cli.displayOptions()
            return
        }

        this.set("viewName", args[0]);
        this._applicationNamespace();
    },

    _applicationNamespace: function () {
        var fileStream = fs.createReadStream(process.cwd() + '/app/application.js')
            , fileStreamAsString = fs.readFileSync(fileStream.path, 'utf8')
            , fileStreamAsBuffer = new Buffer(fileStreamAsString)
            , index = fileStreamAsString.toString().indexOf("=")
            , applicationNamespace = fileStreamAsBuffer.toString('ascii', 0, index - 1);

        this.set('_applicationNamespace', applicationNamespace);

        this.cloneTemplate();
    },

    cloneTemplate: function () {
        var fileTemplate = fs.createReadStream(this.get('_fullTemplateFilePath'))
            , fileData = fs.readFileSync(fileTemplate.path, 'utf8')
            , file = fileData.replace(/<project_name>/gi, this.get('_applicationNamespace'))
            , file = file.replace(/<view_name>/gi, s(this.get('viewName')).capitalize().s + 'View');

        this._writeFile(file);
    },

    _writeFile: function (file) {
        wrench.mkdirSyncRecursive('app/views/', 0777);

        if (fs.existsSync('app/views/' + this.get('viewName') + '_view.js')) {
            console.log(clc.red('A file named ' + this.get('viewName') + '_view.js' + ' already exists.  ' +
            'Canceling view creation.'));
        } else {
            fs.writeFileSync('app/views/' + this.get('viewName') + '_view.js', file)
        }

    }

});