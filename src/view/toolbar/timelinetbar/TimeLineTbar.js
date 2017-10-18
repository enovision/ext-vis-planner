/**
 * Created by j.vd.merwe on 8/15/17.
 */
Ext.define('VisPlanner.view.toolbar.timelinetbar.TimeLineTbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'VisTimeLineTbar',

    alternateClassName: 'VisPlanner.toolbar.TimeLineTbar',

    requires: [
        'VisPlanner.view.toolbar.timelinetbar.TimeLineTbarController'
    ],

    controller: 'VisTimeLineTbarController',

    defaults: {
        xtype: 'datefield',
        format: 'd.m.Y',
        editable: false,
        allowBlank: false,
        labelWidth: 50
    },

    fromText: 'From',
    toText: 'To',
    focusText: 'Focus',


    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [{
                xtype: 'button',
                iconCls: 'fa fa-undo',
                handler: 'onResetClicked'
            }, {
                xtype: 'button',
                iconCls: 'fa fa-fast-backward',
                handler: 'onFastBackward'
            }, {
                xtype: 'button',
                iconCls: 'fa fa-backward',
                handler: 'onBackward'
            }, {
                xtype: 'button',
                iconCls: 'fa fa-forward',
                handler: 'onForward'
            }, {
                xtype: 'button',
                iconCls: 'fa fa-fast-forward',
                handler: 'onFastForward'
            }, '-', {
                xtype: 'button',
                iconCls: 'fa fa-search-plus',
                handler: 'onZoomIn'
            }, {
                xtype: 'button',
                iconCls: 'fa fa-search-minus',
                handler: 'onZoomOut'
            }, '-', {
                fieldLabel: me.focusText,
                reference: 'focusDate',
                listeners: {
                    select: 'onFocusDateSelect'
                }
            }, '-', {
                reference: 'fromDate',
                fieldLabel: me.fromText,
                vfield: 'fromDate',
                endDateField: 'toDate',
                vtype: 'TimelineDateRange',
                listeners: {
                    select: 'onFromDateSelect'
                }
            }, {
                reference: 'toDate',
                fieldLabel: me.toText,
                vfield: 'toDate',
                startDateField: 'fromDate',
                vtype: 'TimelineDateRange',
                listeners: {
                    select: 'onToDateSelect'
                }
            }]
        });

        this.callParent();
    },

    setMinMaxValue: function (fromDate, toDate) {
        this.fireEvent('setminmaxvalue', fromDate, toDate);
    },

    setFocusDate: function (date) {
        this.fireEvent('setfocusdate', date);
    }
});