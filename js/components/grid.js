(function(externalParent) {
    var GridHelper = {
        moveThumb: function(position, scrollThumb, scrollHeight) {
            var thumbHeight;
            thumbHeight = scrollThumb.offsetHeight;

            if (position <= 0) {
                scrollThumb.style.top = 0;

            } else if(position + thumbHeight >= scrollHeight) {
                scrollThumb.style.top = scrollHeight - thumbHeight + 'px';

            } else {
                scrollThumb.style.top = position + 'px';
            }
        }
    };
    var EventHelper = {
        preventDefaultBehavior: function(event) {
            event.preventDefault();
        },
        handleFocusY: function(scrollY, scrollHeight, scrollThumb) {
            var keyDownHandler = function(event) {
                event.preventDefault();

                var position = scrollThumb.offsetTop;
                var key = event.which;

                if (key === 38) {
                    GridHelper.moveThumb(--position, scrollThumb, scrollHeight);

                } else if (key === 40) {
                    GridHelper.moveThumb(++position, scrollThumb, scrollHeight);
                }
            };
            scrollThumb.addEventListener('keydown', keyDownHandler);
            scrollThumb.addEventListener('blur', function blurHandler() {
                this.removeEventListener('blur', blurHandler);
                this.removeEventListener('keydown', keyDownHandler);
            });
        },
        handleMouseDownY: function (scrollY, scrollHeight, scrollThumb, event) {
            event.preventDefault();

            if (event.target === scrollThumb) {
                var gridElement = this._gridElement;
                var scrollThumbY = scrollThumb.getBoundingClientRect().top + pageYOffset;
                var scrollThumbOffset = event.pageY - scrollThumbY;
                scrollThumb.style.top = event.pageY - scrollY - scrollThumbOffset + 'px';

                var mouseMoveHandler = function(event) {
                    var position = event.pageY - scrollY - scrollThumbOffset;
                    GridHelper.moveThumb(position, scrollThumb, scrollHeight);
                };

                gridElement.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', function mouseUpHandler() {
                    this.removeEventListener('mouseup', mouseUpHandler);
                    gridElement.removeEventListener('mousemove', mouseMoveHandler);
                });

               scrollThumb.focus();

            } else if (event.target === scrollThumb.parentNode) {
                var position = event.pageY - scrollY - scrollThumb.offsetHeight/2;
                GridHelper.moveThumb(position, scrollThumb, scrollHeight);
            }
        }
    };

    function Grid(data) {
        if (!(this instanceof Grid)) {
            return new Grid(data);
        }

        this._gridElement = document.querySelector('.grid');
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

            var preventDefaultBehavior = EventHelper.preventDefaultBehavior;
            var mouseDownHandler = EventHelper.handleMouseDownY;
            var focusHandler = EventHelper.handleFocusY;

            document.ondragstart = preventDefaultBehavior;
            vScroll.addEventListener('mousedown', mouseDownHandler.bind(this, vScrollY, vScrollHeight, vScrollThumb));
            vScrollThumb.addEventListener('focus', focusHandler.bind(null, vScrollY, vScrollHeight, vScrollThumb));
        }
    };

    Grid.prototype = Prototype;
    externalParent.Grid = Grid;
}(Yonder.components));
