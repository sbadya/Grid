(function(externalParent) {
    function Grid(data) {
        if (!(this instanceof Grid)) {
            return new Grid(data);
        }

        this._gridElement = document.querySelector('.grid');
        this.makeVerticalScrollable();
    }

    var Prototype = {
        constructor: Grid
    };

    Grid.prototype = Prototype;
    externalParent.Grid = Grid;
}(Yonder.components));
