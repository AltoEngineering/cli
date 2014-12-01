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
Alto.server = module.exports = Alto;

Alto.server = Alto.Object.create ({

    action: function (args) {
        console.log("Starting server");
    }

});