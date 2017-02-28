var Yonder = (function(prjName) {
    var addModule = function(str) {
        var modules = str.split('.');
        var parent = this;

        if (modules[0] === prjName) {
            modules.splice(0, 1);
        }

        for (var i = 0, len = modules.length; i < len; i++) {
            var current = modules[i];

            if (!parent[current]) {
                parent[current] = {};
            }

            parent = parent[current];
        }

        return parent;
    };

    return {
        addModule: addModule
    }
}('Yonder'));

// Require modules
Yonder.addModule('Yonder.components');
