(function() {
    // Test data
    var getData = function() {
        var data = [];
        var length = 15;

        for (var i = 0; i < length; i++) {
            data.push({
                name: i + 1 + '. Anna Trujillo',
                contactName: 'Anna Trujillo',
                contactTitle: 'Owner',
                companyName: 'Anna Trujillo Emparedados y helados',
                country: 'Mexico'
            });
        }

        return data;
    };
    var Grid = Yonder.components.Grid;
    var grid = new Grid(getData());
}());
