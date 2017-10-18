Ext.define('VisPlanner.store.Items', {
    extend: 'Ext.data.Store',
    model: 'VisPlanner.model.Items',
    requires: [
        'VisPlanner.model.Items'
    ],
    buffered: true,
    leadingBufferZone: 300,
    pageSize: 50
});