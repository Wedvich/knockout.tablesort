## Knockout.Tablesort

This is a [Knockout.js](http://knockoutjs.com/ "Knockout") extender with utilities for
sorting tables that are bound to Knockout observable arrays. It works by extending an
observable array with a computed observable that does the sorting, and an observable object
containing the current sort options. It then binds a click handler to the header row.

The setup needed to make this work is:
  - A reference to the table element that's bound to the observable array when
    the extender is applied.
  - A "data-sort-property" attribute on the <th> tags for sortable columns, with the
    path to the property that will be used for sorting. Columns without this property
    will not be sorted.

Example
-------

HTML:

    <table id="company-table">
        <thead>
            <tr>
                <th data-sort-property="company"><span>Company</span></th>
                <th data-sort-property="signatureColor"><span>Signature color</span></th>
                <th><span>Leasing provider</span></th>
            </tr>
        </thead>
        <tbody data-bind="foreach: companies">
            <tr>
                <td data-bind="text: company"></td>
                <td data-bind="text: signatureColor"></td>
                <td data-bind="text: leasingProvider"></td>
            </tr>
        </tbody>
    </table>

Knockout model with some data:

    var CompanyModel = function () {
        this.companies = ko.observableArray( [
            {
                company: 'Megacorp',
                signatureColor: 'red',
                leasingProvider: 'Bentley'
            },
            {
                company: 'Acme Corporation',
                signatureColor: 'yellow',
                leasingProvider: 'Volvo'
            },
            {
                company: 'Initech',
                signatureColor: 'blue',
                leasingProvider: 'BMW'
            },
            {
                company: 'Beta Industries',
                signatureColor: 'green',
                leasingProvider: 'Toyota'
            },
            {
                company: 'Gravy Software Inc.',
                signatureColor: 'white',
                leasingProvider: 'Mercedes'
            }
        ] ).extend( { tablesort: document.getElementById( 'company-table' ) } );
    };

    ko.applyBindings( new CompanyModel() );
