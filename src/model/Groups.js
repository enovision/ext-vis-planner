/**
 * Created by j.vd.merwe on 8/15/17.
 */
Ext.define('VisPlanner.model.Groups', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'content', type: 'string'},
        {name: 'className', type: 'string'},
        {name: 'content', type: 'string'},
        {name: 'style', type: 'string'},
        {name: 'subgroupOrder', type: 'string'},
        {name: 'title', type: 'string'}
    ]
});