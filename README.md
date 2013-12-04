## Knockout.Tablesort

This is a custom [Knockout.js](http://knockoutjs.com/ "Knockout") foreach binding handler
that allows tables using this handler to be sorted. Add `data-sort-property` attribute to
the `<th>` elements of the columns you want to be sortable, and provide the name of the
property that's bound in the `<td>` element of that column. And, voilà - sorting!

There are three sorting states that are toggled through - none, ascending and descending.
If the sorting state is set to ascending or descending, the `<th>` element of that column
will have a `sorting-asc` or `sorting-desc` class respectively, so you can use CSS to adorn
the header with directional arrows or whatever else you'd like.

The `beforetablesort` and `aftertablesort` will be triggered on the `<table>` element before
and after sorting has been performed, respectively.

### Example

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
    
### Compatibility
- Knockout 2.3 or 3.0
together with
- Modern browsers, as well as IE 8+

### License
**License:** MIT (http://www.opensource.org/licenses/mit-license)
