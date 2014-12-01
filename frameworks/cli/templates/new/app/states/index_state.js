<project_name>.indexState = Alto.State.create ({

    enterState: function() {
        if (!<project_name>.indexView) {
            <project_name>.indexView = <project_name>.IndexView.create({attachToNode: 'body'});
        }
    },

    exitState: function() {
        Alto.DomUtil.removeNodeFromParent(<project_name>.indexView.node, 'body');
        Alto.Object.destroyInstance('<project_name>.indexView');
    }

});