/**
 * Created by j.vd.merwe on 8/15/17.
 */
Ext.define('VisPlanner.model.Items', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'id', type: 'string'},
        {
            name: 'start',
            convert: function (val) {
                if (Ext.isString(val)) {
                    return new Date(val)
                } else {
                    return val;
                }
            }
        },
        {
            name: 'end',
            convert: function (val) {
                if (Ext.isString(val)) {
                    return new Date(val)
                } else {
                    return val;
                }
            }
        },
        {name: 'content', type: 'string'},
        {name: 'group'},
        {name: 'className', type: 'string'},
        {name: 'style', type: 'string'},
        {name: 'subgroup', type: 'string'},
        {name: 'title', type: 'string'},
        {name: 'type', type: 'string'}
    ]
});