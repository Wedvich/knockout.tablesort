// Knockout.Tablesort

( function ( ko ) {

    // Keep an internal table counter and an array of
    // options for each table.
    var tableOptionsIndex = 0,
        tableOptions = [];

    // Helper function to recursively find the closest parent
    // element that matches the target node name, including the
    // element itself.
    function closestParentOrSelf( element, target ) {
        if ( element.nodeName.toLowerCase() === target.toLowerCase() )
            return element;

        element = element.parentElement;
        if ( element === 'undefined' || !element )
            return null;

        if ( element.nodeName.toLowerCase() === target.toLowerCase() )
            return element;

        return closestParentOrSelf( element, target );
    };
    
    // Handler for mouse clicks on headers.
    function headerClickHandler( context, mouseEvent ) {
        var th = closestParentOrSelf( mouseEvent.target, 'th' );
        var tr = closestParentOrSelf( th, 'tr' );
    };
    
    // Export the tablesort namespace.
    ko.tablesort = {
        headerClickHandler: headerClickHandler
    };

    // Extender that takes an observableArray of data,
    // and an observable containing the sort options.
    ko.extenders.tablesort = function ( target ) {

        // Get the next table options index and increment it,
        // then create an observable to hold the table options.
        var optionsIndex = tableOptionsIndex++;
        tableOptions[ optionsIndex ] = ko.observable( null );

        // Throw an error if "target" can't be an observable array.
        if ( Object.prototype.toString.call( target() ) !== '[object Array]' )
            throw new TypeError( 'Parameter "target" is not an observable array.' );

        return ko.computed( {

            // Sorting happens here in the getter.
            read: function () {
                var optionsObject = tableOptions[ optionsIndex ]();

                // If the options object is null, there's no sorting.
                if ( !optionsObject )
                    return target();

                // Validate the options object.
                if ( !optionsObject.hasOwnProperty( 'direction' )
                    || !optionsObject.hasOwnProperty( 'columnIndex' )
                    || !optionsObject.hasOwnProperty( 'propertyName' ) )
                    throw new TypeError( 'The provided options object lacks one of the required properties: direction, columnIndex, propertyName' );

                var unsortedArray = target();

                // If the array is null for some reason or empty,
                // no sorting is performed.
                if ( !unsortedArray || unsortedArray.length === 0 )
                    return unsortedArray;

                // Modifier for the sort direction (ascending/descending).
                var direction = optionsObject.direction === 'asc' ? 1 : -1;

                // Map the property to sort on.
                var sortMap = unsortedArray.map( function ( e, i ) {
                    return { index: i, value: e[ optionsObject.propertyName ] };
                } );

                // Perform the sort on the map.
                sortMap.sort( function ( a, b ) {
                    if ( a.value > b.value )
                        return 1 * direction;
                    if ( a.value < b.value )
                        return -1 * direction;
                    return 0;
                } );

                // Return the sorted array.
                return sortMap.map( function ( e ) {
                    return unsortedArray[ e.index ];
                } );
            },

            // No specific logic for the setter.
            write: function ( newValue ) {
                target( newValue );
            }

        } );

    };

} )( ko );
