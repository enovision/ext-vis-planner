/**
 * Created by jvandemerwe on 4-8-2017.
 */
Ext.define('VisPlanner.store.Groups', {
    extend: 'Ext.data.Store',

    requires: [
        'VisPlanner.model.Groups'
    ],

    model: 'VisPlanner.model.Groups'
});