/**
 * Created by j.vd.merwe on 8/17/17.
 */
Ext.define('VisPlanner.view.container.TimeLine', {
    extend: 'Ext.Container',

    xtype: 'VisTimeLineContainer',
    id: 'timtim',

    autoEl: {
        tag: 'visualisation'
    },

    html: '<timeline></timeline>',

    getTimeLineEl: function() {
        return this.el.dom.getElementsByTagName('timeline')[0];
    }
});

