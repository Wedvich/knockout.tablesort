// Knockout.Tablesort

( function ( undefined ) {
    
    // Helper function to recursively find the closest parent
    // element that matches the target node name, including the
    // element itself.
    function closestParentOrSelf( element, target ) {
        if ( element.nodeName.toLowerCase() === target.toLowerCase() )
            return element;

        element = element.parentElement;
        if ( element === undefined || !element )
            return null;

        if ( element.nodeName.toLowerCase() === target.toLowerCase() )
            return element;

        return closestParentOrSelf( element, target );
    };    

    ko.bindingHandlers.tablesortForeach = {

        init: function ( tbodyElement, valueAccessor, allBindings, viewModel, bindingContext ) {

            // Make sure we have a tbody element...
            if ( tbodyElement.nodeName.toLowerCase() !== 'tbody' )
                throw new TypeError( 'The Knockout.Tablesort binding can only be used on <tbody> elements.' );

            // ... Make sure the tbody element has a parent table element...
            var tableElement = closestParentOrSelf( tbodyElement, 'table' );
            if ( !tableElement )
                throw new Error( 'Malformed table markup: no parent <table> element found for this <tbody> element.' );

            // ... And make sure that parent table element has a thead element.
            var theadElement;
            for ( var i = 0; i < tableElement.children.length; ++i ) {
                if ( tableElement.children[ i ].nodeName.toLowerCase() === 'thead' ) {
                    theadElement = tableElement.children[ i ];
                    break;
                }
            }
            if ( !theadElement )
                throw new Error( 'Malformed table markup: no <thead> element found in this <table> element.' );

            // Attach a sorted observable to the observable array.
            valueAccessor.sorted = ko.computed( {
                
                read: function () {
                    
                    var unsortedArray = valueAccessor();
                    var sortOptions = valueAccessor.sorted.options();

                    // If the sort options are null or the array is empty,
                    // no sorting is performed.
                    if ( !sortOptions || unsortedArray.length === 0 )
                        return unsortedArray;

                    // Modifier for the sort direction (ascending/descending).
                    var direction = sortOptions.direction === 'asc' ? 1 : -1;

                    // Map the property to sort on.
                    var sortMap = unsortedArray.map( function ( e, i ) {
                        return { index: i, value: e[ sortOptions.propertyName ] };
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
                
                deferEvaluation: true
            } );

            // Initialize the options object for the sort computed.
            valueAccessor.sorted.options = ko.observable( null );

            return ko.bindingHandlers.foreach.init( tbodyElement, valueAccessor.sorted, allBindings, viewModel, bindingContext );
        },
        

        update: function ( tbodyElement, valueAccessor, allBindings, viewModel, bindingContext ) {
            
            ko.bindingHandlers.foreach.update( tbodyElement, valueAccessor.sorted, allBindings, viewModel, bindingContext );
            return { controlDescendantBindings: true };
        },
    };

} )( ko );
