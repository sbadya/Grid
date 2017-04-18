(function(externalParent) {
    var GridHelper = {
        initialize: function(data) {
            var gridElement = this._gridElement;
            var vScroll = gridElement.querySelector('.vertical-scroll');
            var vScrollThumb = gridElement.querySelector('.scroll-thumb');
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

            if (position <= 0) {
                position = 0;

            } else if (position + thumbHeight >= scrollHeight) {
                position = scrollHeight - thumbHeight;
            }

            scrollThumb.style.top = position + 'px';
            renderGrid(position);
        },
        getRenderGrid: function() {
            var gridElement = this._gridElement;
            var dataInContainer = gridElement.querySelector('.tbl-data-in');
            var hiddenContainer = gridElement.querySelector('.tbl-data-in.hidden');
            var prevPosition = 0;

            //Grid's render function
            return function(position) {
                var scrollCount = position - prevPosition;
                dataInContainer.style.top = dataInContainer.offsetTop - scrollCount + 'px';
                hiddenContainer.style.top = hiddenContainer.offsetTop - scrollCount + 'px';
                prevPosition = position;
            };
        }
    };

    var EventHelper = {
        preventDefaultBehavior: function(event) {
            event.preventDefault();
        },
        handleFocusY: function(scrollY, scrollHeight, scrollThumb, renderGrid) {
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
        handleMouseDownY: function (scrollY, scrollHeight, scrollThumb, renderGrid, event) {
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
            var gridElement = this._gridElement;
            gridElement.classList.add('v-scrollable');

            var vScroll = gridElement.querySelector('.vertical-scroll');
            var vScrollY = vScroll.getBoundingClientRect().top + pageYOffset;
            var vScrollHeight = vScroll.offsetHeight;
            var vScrollThumb = vScroll.querySelector('.scroll-thumb');
            var renderGrid = GridHelper.getRenderGrid.call(this);
            var setThumbHeight = function() {
                var hiddenContainer = gridElement.querySelector('.tbl-data-in.hidden');
                var thumbInitHeight = parseInt(getComputedStyle(vScrollThumb).height, 10);
                var heightDiff = vScrollHeight - hiddenContainer.offsetHeight;
                vScrollThumb.style.height = (heightDiff > thumbInitHeight ? heightDiff : thumbInitHeight) + 'px';
            };

            setThumbHeight();
            document.ondragstart = EventHelper.preventDefaultBehavior;
            var mouseDownBinded = EventHelper.handleMouseDownY.bind(this, vScrollY, vScrollHeight, vScrollThumb, renderGrid);
            var focusBinded = EventHelper.handleFocusY.bind(this, vScrollY, vScrollHeight, vScrollThumb, renderGrid);
            vScroll.addEventListener('mousedown', mouseDownBinded);
            vScrollThumb.addEventListener('focus', focusBinded);
        },
        disableVerticalScroll: function() {
            this._gridElement.classList.remove('v-scrollable');
        },
        makeHorizontalScrollable: function() {},
        disableHorizontalScroll: function() {}
    };

    Grid.prototype = Prototype;
    externalParent.Grid = Grid;
}(Yonder.components));
