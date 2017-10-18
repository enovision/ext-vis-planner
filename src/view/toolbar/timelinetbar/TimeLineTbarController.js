/**
 * Created by j.vd.merwe on 8/15/17.
 */
Ext.define('VisPlanner.view.toolbar.timelinetbar.TimeLineTbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.VisTimeLineTbarController',

    fromDate: null,
    toDate: null,

    initFocusDate: null,
    initFromDate: null,
    initToDate: null,

    control: {
        '#': {
            setminmaxvalue: 'onSetMinMaxValue',
            setfocusdate: 'onSetFocusDate'
        }
    },

    init: function (view) {
        var me = this;
        me.fromDate = me.lookupReference('fromDate');
        me.toDate = me.lookupReference('toDate');
        me.focusDate = me.lookupReference('focusDate');
    },

    onFocusDateSelect: function (field, date) {
        // console.log('focusdatechanged', date);
        this.fireViewEvent('focusdatechanged', date);
    },

    onFromDateSelect: function (field, date) {
        var me = this;
        // console.log('fromdatechanged', date, me.toDate.getValue());
        me.fireViewEvent('fromdatechanged', date, me.toDate.getValue());
    },

    onToDateSelect: function (field, date) {
        var me = this;
        // console.log('todatechanged', me.fromDate.getValue(), date);
        me.fireViewEvent('todatechanged', me.fromDate.getValue(), date);
    },

    /**
     * scrolling button events
     */
    onFastBackward: function (btn, event) {
        // console.log('fastbackwardclicked', btn, event);
        this.fireViewEvent('fastbackwardclicked', btn, event);
    },
    onBackward: function (btn, event) {
        // console.log('backwardclicked', btn, event);
        this.fireViewEvent('backwardclicked', btn, event);
    },
    onFastForward: function (btn, event) {
        // console.log('fastforwardclicked', btn, event);
        this.fireViewEvent('fastforwardclicked', btn, event);
    },
    onForward: function (btn, event) {
        // console.log('forwardclicked', btn, event);
        this.fireViewEvent('forwardclicked', btn, event);
    },

    onZoomIn: function (btn, event) {
        this.fireViewEvent('zoominclicked', btn, event);
    },
    onZoomOut: function (btn, event) {
        this.fireViewEvent('zoomoutclicked', btn, event);
    },

    onResetClicked: function(btn, event) {
        var me = this;
        me.focusDate.setValue(me.initFocusDate);
        me.fromDate.setValue(me.initFromDate);
        me.toDate.setValue(me.initToDate);

        this.fireViewEvent('datesreset', me.initFocusDate, me.initFromDate, me.initToDate);
    },

    /**
     * Events
     */

    onSetMinMaxValue: function (fromDate, toDate) {
        var me = this;
        // with just .setValue(date), the time will be set to 00:00:00 !!!
        me.fromDate.setValue(fromDate);
        me.toDate.setValue(toDate);

        me.initFromDate = fromDate;
        me.initToDate = toDate;
    },

    onSetFocusDate: function (date) {
        var me = this;

        me.initFocusDate = date;
        me.focusDate.clearInvalid();
        me.focusDate.setValue(date);

    }

});