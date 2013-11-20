## Knockout.Tablesort

This is a Knockout extender with utilities meant for sorting tables that are
bound to Knockout observable arrays.

Example
-------

Knockout model:

    var CompanyModel = function () {
        this.companies = ko.observableArray( [
            {
                company: 'Megacorp',
                signatureColor: 'red'
            },
            {
                company: 'Acme Corporation',
                signatureColor: 'yellow'
            },
            {
                company: 'Initech',
                signatureColor: 'blue'
            },
            {
                company: 'Beta Industries',
                signatureColor: 'green'
            },
            {
                company: 'Gravy Software Inc.',
                signatureColor: 'white'
            },
            {
                company: 'Rowden Industries',
                signatureColor: 'black'
            },
            {
                company: 'Microhard',
                signatureColor: 'orange'
            }
        ] ).extend( { tablesort: document.getElementById( 'company-table' ) } );
    };

    ko.applyBindings( new CompanyModel() );

HTML:

    <table id="company-table">
        <thead>
            <tr>
                <th><span>Company</span></th>
                <th><span>Signature color</span></th>
            </tr>
        </thead>
        <tbody data-bind="foreach: companies">
            <tr>
                <td data-bind="text: company"></td>
                <td data-bind="text: signatureColor"></td>
            </tr>
        </tbody>
    </table>
