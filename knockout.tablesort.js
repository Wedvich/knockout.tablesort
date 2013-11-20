// Knockout.Tablesort

( function ( ko ) {
    
    // Keep an internal table counter and an array of
    // options for each table, plus the table elements in DOM.
    var tableOptionsIndex = 0,
        tableOptions = [],
        tableElements = [];

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

    // Header click handler function.
    function clickHandler( targetElement, tableElement, options ) {
        
        // Get the clicked th element and store its class.
        var thisHeader = closestParentOrSelf( targetElement, 'th' );
        var thisHeaderRow = closestParentOrSelf( thisHeader, 'tr' );
        
        // Remove sorting classes.
        for ( var i = 0; i < thisHeaderRow.children.length; ++i ) {
            thisHeaderRow.children[ i ].className = thisHeaderRow.children[ i ].className.replace( /sorting-(asc|desc)/g, '' );
        }

        // Get the options object and set it to one of three states,
        // depending on the current sort column/cell:
        // - null, or different column: set it to ascending on the current column
        // - ascending: set it to descending
        // - descending: set it to null
        var currentOptions = options();
        if ( !currentOptions || currentOptions.columnIndex !== thisHeader.cellIndex ) {
            options( {
                direction: 'asc',
                columnIndex: thisHeader.cellIndex,
                propertyName: thisHeader.getAttribute( 'data-sort-property' )
            } );
        } else if ( currentOptions.direction === 'asc' ) {
            currentOptions.direction = 'desc';
            options.valueHasMutated();
        } else {
            options( null );
        }
        
        // Get the updated options and add CSS class to the related
        // header element if sorting is active.
        var newOptions = options();
        if ( !!newOptions ) {
            var classes = thisHeader.className.split( ' ' );
            classes.push( 'sorting-' + newOptions.direction );
            thisHeader.className = classes.join( ' ' ).trim();
        }
    }

    // Extender that takes an observableArray of data,
    // and an observable containing the sort options.
    ko.extenders.tablesort = function ( target, tableElement ) {

        // Throw an error if "tableElement" isn't set.
        if ( typeof tableElement === 'undefined' || !tableElement )
            throw new TypeError( 'Parameter "tableElement" must be set.' );

        // Get the next table options index and increment it,
        // then create an observable to hold the table options.
        var optionsIndex = tableOptionsIndex++;
        tableOptions[ optionsIndex ] = ko.observable( null );
        tableElements[ optionsIndex ] = tableElement;
        
        // Capture a reference to this options object.
        var options = tableOptions[ optionsIndex ];

        // Get the first header row.
        var tableHeader = tableElement.getElementsByTagName( 'thead' )[0];
        if ( !tableHeader )
            throw new Error( 'Malformed table markup: could not find any "thead" element.' );
        var tableHeaderRow = tableHeader.getElementsByTagName( 'tr' )[0];
        if ( !tableHeaderRow )
            throw new Error( 'Malformed table markup: could not find any "tr" element in table header.' );

        // Hook up the click event handler.
        tableHeaderRow.onclick = function ( mouseEvent ) {
            clickHandler( mouseEvent.target, tableElement, options );
        };

        return ko.computed( {

            // Sorting happens here in the getter.
            read: function () {
                var optionsObject = options();

                // If the options object is null, there's no sorting.
                if ( !optionsObject )
                    return target();

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
