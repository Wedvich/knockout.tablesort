// Knockout.Tablesort plugin
// (c) Martin Wedvich
// License: MIT (http://www.opensource.org/licenses/mit-license)

( function ( undefined ) {
    
    // Array.prototype.map polyfill from Mozilla Developer Network.
    // Full version with comments:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Compatibility
    if ( !Array.prototype.map ) {
        Array.prototype.map = function ( callback, thisArg ) {
            var T, A, k;
            var O = Object( this );
            var len = O.length >>> 0;
            if ( typeof callback !== "function" ) {
                throw new TypeError( callback + " is not a function" );
            }
            if ( thisArg ) {
                T = thisArg;
            }
            A = new Array( len );
            k = 0;
            while ( k < len ) {
                var kValue, mappedValue;
                if ( k in O ) {
                    kValue = O[k];
                    mappedValue = callback.call( T, kValue, k, O );
                    A[k] = mappedValue;
                }
                k++;
            }
            return A;
        };
    }
    
    // String.prototype.trim polyfill from Mozilla Developer Network.
    // Full version with comments:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Compatibility
    if ( !String.prototype.trim ) {
        String.prototype.trim = function () {
            return this.replace( /^\s+|\s+$/gm, '' );
        };
    }
    
    // Element.prototype.closest polifill for browsers that don't support closest.
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    if (window.Element && !window.Element.prototype.closest) {
        window.Element.prototype.closest = function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i,
                el = this;
            do {
                i = matches.length;
                while (--i >= 0 && matches.item(i) !== el) {};
            } while ((i < 0) && (el = el.parentElement));
            return el;
        };
    }
    
    // Header click handler function.
    function clickHandler( targetElement, sortOptions ) {

        // Get the header element and check if it should be sortable.
        var thElement = targetElement.closest( 'th' );
        if ( !thElement.getAttribute( 'data-sort-property' ) )
            return;

        // Remove sorting classes.
        var trElement = thElement.closest( 'tr' );
        for ( var i = 0; i < trElement.children.length; ++i ) {
            trElement.children[i].className = trElement.children[i].className.replace( /sorting-(asc|desc)/g, '' );
        }

        var currentSortOptions = sortOptions();
        var tableElement = trElement.closest('table' );
        ko.utils.triggerEvent( tableElement, 'beforetablesort' );
        
        // Set the options object to one of three states,
        // depending on the previous sort column/direction:
        // - null, or different column: set it to ascending on the current column
        // - ascending: set it to descending
        // - descending: set it to null
        if ( !currentSortOptions || currentSortOptions.columnIndex !== thElement.cellIndex ) {
            sortOptions( {
                direction: 'asc',
                columnIndex: thElement.cellIndex,
                propertyName: thElement.getAttribute( 'data-sort-property' )
            } );
        } else {
            currentSortOptions.direction = currentSortOptions.direction === 'asc' ? 'desc' : 'asc';
            sortOptions.valueHasMutated();
        }

        // Get the updated options and add CSS class to the related
        // header element if sorting is active.
        var newSortOptions = sortOptions();
        if ( !!newSortOptions ) {
            var classes = thElement.className.split( ' ' );
            classes.push( 'sorting-' + newSortOptions.direction );
            thElement.className = classes.join( ' ' ).trim();
        }
        
        ko.utils.triggerEvent( tableElement, 'aftertablesort' );
    }

    ko.bindingHandlers.tablesortForeach = {

        init: function ( tbodyElement, valueAccessor, allBindings, viewModel, bindingContext ) {

            // Make sure we have a tbody element...
            if ( tbodyElement.nodeName.toLowerCase() !== 'tbody' )
                throw new TypeError( 'The Knockout.Tablesort binding can only be used on <tbody> elements.' );

            // ... Make sure the tbody element has a parent table element...
            var tableElement = tbodyElement.closest( 'table' );
            if ( !tableElement )
                throw new Error( 'Malformed table markup: no parent <table> element found for this <tbody> element.' );

            // ... And make sure that parent table element has a thead element.
            var theadElement = null;
            for ( var i = 0; i < tableElement.children.length; ++i ) {
                if ( tableElement.children[ i ].nodeName.toLowerCase() === 'thead' ) {
                    theadElement = tableElement.children[ i ];
                    break;
                }
            }
            if ( !theadElement || theadElement.children.length === 0 )
                throw new Error( 'Malformed table markup: no non-empty <thead> element found in this <table> element.' );
            
            // Finally, get the first row in the thead element, which is where
            // the click handler will be attached.
            var trElement = theadElement.children[0];
            if ( trElement.nodeName.toLowerCase() !== 'tr' )
                throw new Error( 'Malformed table markup: no first <tr> element found in the <thead> element of this table.' );

            // Attach a sorted observable to the observable array.
            valueAccessor.sorted = ko.computed( {
                
                read: function () {
                    
                    var unsortedArray = ko.unwrap( valueAccessor() );
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
                        var av = typeof a.value === "function" ? a.value() : a.value;
                        var bv = typeof a.value === "function" ? b.value() : b.value;

                        return (av > bv ? 1 : -1) * direction;
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

            var clickWrapper = function ( mouseEvent ) {
                return clickHandler( !!mouseEvent.target ? mouseEvent.target : mouseEvent.srcElement, valueAccessor.sorted.options );
            };

            // Attach the click handler.
            if ( trElement.addEventListener ) {
                trElement.addEventListener( 'click', clickWrapper, false );
            } else {
                trElement.attachEvent( 'onclick', clickWrapper );
            }
            
            return ko.bindingHandlers.foreach.init( tbodyElement, valueAccessor.sorted, allBindings, viewModel, bindingContext );
        },
        

        update: function ( tbodyElement, valueAccessor, allBindings, viewModel, bindingContext ) {
            
            ko.bindingHandlers.foreach.update( tbodyElement, valueAccessor.sorted, allBindings, viewModel, bindingContext );
            var tableElement = tbodyElement.closest( 'table' );
            ko.utils.triggerEvent( tableElement, 'aftertablesort' );
            return { controlDescendantBindings: true };
        }
    };

} )();
