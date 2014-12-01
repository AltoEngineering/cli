// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 * Module dependencies.
 */

var clc = require('cli-color')
    , Alto = require('../../runtime/lib/sc-runtime.js');

/*
    Expose Alto namespace
*/
Alto = module.exports = Alto;

Alto.cli = Alto.Object.create ({

    version: '0.0.2',

    commands: {},

    options: [{
        command: "new <project_name>",
        commandUsage: "alto new <project_name>",
        description: "Creates a new alto project with a default app",
        example: "alto new artifex"
    }, {
        command: "gen-model <model_name>",
        commandUsage: "alto gen-model <model_name>",
        description: "Generates a new model for a specific application.",
        example: "alto gen-model user"
    },{
        command: "gen-view <view_name>",
        commandUsage: "alto gen-view <view_name>",
        description: "Generates a new view for a specific application.",
        example: "alto gen-view login"
    },{
        command: "gen-controller <controller_name>",
        commandUsage: "alto gen-controller <controller_name>",
        description: "Generates a new view for a specific application.",
        example: "alto gen-controller user"
    },{
        command: "gen-state <state_name>",
        commandUsage: "alto gen-state <state_name>",
        description: "Generates a new state for a specific application.",
        example: "alto gen-state authentication"
    },{
        command: "gen-framework <framework_name>",
        commandUsage: "alto gen-framework <framework_name>",
        description: "Creates a new framework for application specific API's or for third-party javascript frameworks.",
        example: "alto gen-framework shared || alto gen-framework raphaël"
    },{
        command: "server",
        commandUsage: "alto server",
        description: "Starts your local server.",
        example: "alto server"
    }],

    parseComands: function() {
        var options =  this.get("options"),
            key;

        for (var i = 0, length = options.length; i < length; i++) {

            option = options[i],
            option.command = option.command.split(" ");

            key = option.command[0];
            this.commands[key] = option.command.slice(1, option.command.length);

        }
    },

    displayOptions:  function () {
        var options =  this.get("options"),
            option,
            formattedOptions = [' ','Alto-Cli Commands:', ' '];

        for (var i = 0, length = options.length; i < length; i++) {
            option = options[i];
            formattedOptions.push(
                clc.xterm(255)(option.commandUsage),
                clc.xterm(153)(option.description),
                clc.xterm(230)(option.example),
                option.notes ? clc.xterm(219)(option.notes) : ''
            );

            if (option.notes) {
                formattedOptions.push('');
            }
        }

        formattedOptions = formattedOptions.join('\n').replace(/^/gm, '    ');

        return console.log(formattedOptions);

    },

    action: function(args) {
        var commands = this.get("commands");

        if (args == 'version' || args == '--version' || args == 'v' || args == '--v' ) {
            console.log(clc.xterm(153)('version 0.0.1'));
        } else if (this.commands[args[0]]) {
            if (Alto[args[0]]) {
                Alto[args[0]].action(args.slice(1, args.length));
            } else {
                var parsedCommand = args[0].slice(4, args[0].length)
                    , klass = 'gen' + parsedCommand.capitalize();

                Alto[klass].action(args.slice(1, args.length))
            }
        } else {
            this.displayOptions()
        }
    },

    init: function () {
        this.parseComands();
    }

});


