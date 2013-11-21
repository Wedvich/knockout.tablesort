##Knockout.Tablesort

This is a custom [Knockout.js](http://knockoutjs.com/ "Knockout") foreach binding handler
that allows tables using this handler to be sorted. Add `data-sort-property` attribute to
the `<th>` elements of the columns you want to be sortable, and provide the name of the
property that's bound in the `<td>` element of that column. And, voilà - sorting!

There are three sorting states that are toggled through - none, ascending and descending.
If the sorting state is set to ascending or descending, the `<th>` element of that column
will have a `sorting-asc` or `sorting-desc` class respectively, so you can use CSS to adorn
the header with directional arrows or whatever else you'd like.

Example
-------

HTML:

    <table>
        <thead>
            <tr>
                <th data-sort-property="company"><span>Company</span></th>
                <th data-sort-property="signatureColor"><span>Signature color</span></th>
                <th><span>Leasing provider</span></th>
            </tr>
        </thead>
        <tbody data-bind="tablesortForeach: companies">
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
        ] );
    };

    ko.applyBindings( new CompanyModel() );
    
Compatibility
-------
It's still early, but this has been tested with the following browsers so far
(all on Windows 8.1 x64):
- Chrome 31
- Firefox 24
- Internet Explorer 8+
- Opera 19
