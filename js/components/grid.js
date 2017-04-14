(function(externalParent) {
    var GridHelper = {
        initialize: function(data) {
            var gridElement = this._gridElement;
            var dataContainer = gridElement.querySelector('.tbl-data');

            var itemsCountSelector = gridElement.querySelector('.items-per-page > select');
            var itemsCount = +itemsCountSelector.options[itemsCountSelector.selectedIndex].value;

            var mainTemplate = document.getElementById('grid-main-template').innerHTML;
            var partialTemplate = document.getElementById('grid-partial-template').innerHTML;

            var viewTemplate = function(itemsCount) {
                var html = Mustache.render(mainTemplate, {
                    visible: data.slice(0, itemsCount),
                    hidden: data.slice(itemsCount, itemsCount * 2)
                }, {partialTemplate: partialTemplate});

                dataContainer.innerHTML = html;
                var dataInContainer = gridElement.querySelector('.tbl-data-in');
                var hiddenContainer = gridElement.querySelector('.tbl-data-in.hidden');

                dataContainer.style.height = dataInContainer.offsetHeight + 'px';
                hiddenContainer.style.top = dataInContainer.offsetTop + dataInContainer.offsetHeight + 'px';
            };

            viewTemplate(itemsCount);
        },
        moveThumb: function(position, scrollThumb, scrollHeight, renderGrid) {
            var thumbHeight = scrollThumb.offsetHeight;
            var top;

            if (position <= 0) {
                top = 0;

            } else if (position + thumbHeight >= scrollHeight) {
                top = scrollHeight - thumbHeight;

            } else {
                top = position;
            }

            scrollThumb.style.top = top + 'px';
            renderGrid();
        },
        getRenderGrid: function() {
            var gridElement = this._gridElement;
            var dataContainer = gridElement.querySelector('.tbl-data');
            var dataInContainer = gridElement.querySelector('.tbl-data-in');
            var hiddenContainer = gridElement.querySelector('.tbl-data-in.hidden');

            return function() {

            };
        }
    };

    var EventHelper = {
        preventDefaultBehavior: function(event) {
            event.preventDefault();
        },
        handleFocusY: function(scrollY, scrollHeight, scrollThumb) {
            var renderGrid = GridHelper.getRenderGrid.call(this);
            var keyDownHandler = function(event) {
                event.preventDefault();

                var position = scrollThumb.offsetTop;
                var key = event.which;

                if (key === 38) {
                    GridHelper.moveThumb(--position, scrollThumb, scrollHeight, renderGrid);

                } else if (key === 40) {
                    GridHelper.moveThumb(++position, scrollThumb, scrollHeight, renderGrid);
                }
            };
            scrollThumb.addEventListener('keydown', keyDownHandler);
            scrollThumb.addEventListener('blur', function blurHandler() {
                this.removeEventListener('blur', blurHandler);
                this.removeEventListener('keydown', keyDownHandler);
            });
        },
        handleMouseDownY: function (scrollY, scrollHeight, scrollThumb, event) {
            var renderGrid = GridHelper.getRenderGrid.call(this);
            event.preventDefault();

            if (event.target === scrollThumb) {
                var gridElement = this._gridElement;
                var scrollThumbY = scrollThumb.getBoundingClientRect().top + pageYOffset;
                var scrollThumbOffset = event.pageY - scrollThumbY;
                scrollThumb.style.top = event.pageY - scrollY - scrollThumbOffset + 'px';

                var mouseMoveHandler = function(event) {
                    var position = event.pageY - scrollY - scrollThumbOffset;
                    GridHelper.moveThumb(position, scrollThumb, scrollHeight, renderGrid);
                };

                gridElement.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', function mouseUpHandler() {
                    this.removeEventListener('mouseup', mouseUpHandler);
                    gridElement.removeEventListener('mousemove', mouseMoveHandler);
                });

               scrollThumb.focus();

            } else if (event.target === scrollThumb.parentNode) {
                var position = event.pageY - scrollY - scrollThumb.offsetHeight/2;
                GridHelper.moveThumb(position, scrollThumb, scrollHeight, renderGrid);
            }
        }
    };

    function Grid(data) {
        if (!(this instanceof Grid)) {
            return new Grid(data);
        }

        this._gridElement = document.querySelector('.grid');

        GridHelper.initialize.call(this, data);
        this.makeVerticalScrollable();
    }

    var Prototype = {
        constructor: Grid,
        makeVerticalScrollable: function() {
            this._gridElement.classList.add('v-scrollable');

            var vScroll = this._gridElement.querySelector('.vertical-scroll');
            var vScrollY = vScroll.getBoundingClientRect().top + pageYOffset;
            var vScrollHeight = vScroll.offsetHeight;
            var vScrollThumb = vScroll.querySelector('.scroll-thumb');

            var preventDefaultBehavior = EventHelper.preventDefaultBehavior;
            var mouseDownHandler = EventHelper.handleMouseDownY;
            var focusHandler = EventHelper.handleFocusY;

            document.ondragstart = preventDefaultBehavior;
            vScroll.addEventListener('mousedown', mouseDownHandler.bind(this, vScrollY, vScrollHeight, vScrollThumb));
            vScrollThumb.addEventListener('focus', focusHandler.bind(this, vScrollY, vScrollHeight, vScrollThumb));
        },
        disableVerticalScroll: function() {
            this._gridElement.classList.remove('v-scrollable');
        }
    };

    Grid.prototype = Prototype;
    externalParent.Grid = Grid;
}(Yonder.components));
