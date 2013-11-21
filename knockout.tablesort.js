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
                    if ( !valueAccessor.sorted.options )
                        return valueAccessor();

                    return [];
                },
                deferEvaluation: true
            } );

            // Initialize the options object for the sort computed.
            valueAccessor.sorted.options = null;

            return ko.bindingHandlers.foreach.init( tbodyElement, valueAccessor.sorted, allBindings, viewModel, bindingContext );
        },
        

        update: function ( tbodyElement, valueAccessor, allBindings, viewModel, bindingContext ) {
            ko.bindingHandlers.foreach.update( tbodyElement, valueAccessor.sorted, allBindings, viewModel, bindingContext );
            return { controlDescendantBindings: true };
        },
    };

} )( ko );
