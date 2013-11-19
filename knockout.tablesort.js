// Knockout.Tablesort

( function ( ko ) {

    // Extender that takes an observableArray of data,
    // and an observable containing the sort options.
    ko.extenders.tablesort = function ( target, options ) {

        // Throw an error if "target" can't be an observable array.
        if ( Object.prototype.toString.call( target() ) !== '[object Array]' )
            throw new TypeError( 'Parameter "target" is not an observable array.' );
        // Throw an error if "options" can't be an observable.
        if ( typeof options !== 'function' )
            throw new TypeError( 'Parameter "options" is not an observable.' );

        return ko.computed( {

            // Sorting happens here in the getter.
            read: function () {
                var optionsObject = options();

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
