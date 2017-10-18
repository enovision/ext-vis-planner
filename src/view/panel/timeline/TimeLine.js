/**
 * Created by j.vd.merwe on 8/15/17.
 */
Ext.define('VisPlanner.view.panel.timeline.TimeLine', {
    extend: 'Ext.panel.Panel',
    alternateClassName: 'VisPlanner.panel.TimeLine',
    xtype: 'VisTimeLinePanel',

    requires: [
        'VisPlanner.view.panel.timeline.TimeLineController',
        'VisPlanner.view.toolbar.timelinetbar.TimeLineTbar'
    ],

    controller: 'VisTimeLineController',

    layout: 'fit',

    /**
     * Show the toolbar to control the timeline
     * default: false
     */
    hideTimeLineTbar: false,

    bodyPadding: 0,

    timeLineOptions: {},

    timeLineSkip: 3,

    timeLineDayMargin: 0,

    timeLineItemTooltip: null,

    timeLineItemTpl: new Ext.XTemplate(
        '<p>{content}</p>'
    ),

    timeLineGroupTpl: new Ext.XTemplate(
        '<p>{group}</p>'
    ),

    confirmOnItemDelete: true,

    groupStore: null,
    itemStore: null,

    dockedItems: [],

    loadDataText: 'load Data...',

    privates: {
        html: '<visualisation></visualisation>',
        autoScroll: true
    },

    initComponent: function () {
        Ext.apply(this, {
            autoLoad: false, // must always be false !!!
            timeLineInitOptions: {
                editable: false,
                showCurrentTime: true,
                locale: 'en',
                tooltip: {
                    followMouse: false,
                    overflowMethod: 'flip'
                },
                template: function (item) {
                    var me = this;
                    var tpl = me.timeLineItemTpl;
                    return tpl.apply(item);
                }.bind(this),
                groupTemplate: function (item) {
                    var me = this;
                    var tpl = me.timeLineGroupTpl;
                    return tpl.apply(item);
                }.bind(this),
                align: 'auto',
                orientation: 'top',
                margin: {
                    axis: 5,
                    item: {
                        horizontal: 5,
                        vertical: 5
                    }
                }
            }
        });

        this.dockedItems.push({
            dock: 'top',
            xtype: 'VisTimeLineTbar',
            hidden: this.hideTimeLineTbar
        });

        this.callParent();
    },

    getTimeLineEl: function () {
        return this.el.dom.getElementsByTagName('visualisation')[0];
    },

    /**
     * loadStoreData
     * @param argsGroups
     * @param argsItems
     * @param callback
     * @param clearStore
     */
    loadStoreData: function (argsGroups, argsItems, callback) {
        this.fireEvent('loadStoreData', argsGroups, argsItems, callback);
    },

    getGroupStore: function () {
        return this.groupStore;
    },

    getItemStore: function () {
        return this.itemStore;
    },

    getGroupStoreProxy: function () {
        if (this.groupStore === null) return null;
        return this.groupStore.getProxy();
    },

    getItemStoreProxy: function () {
        if (this.itemStore === null) return null;
        return this.itemStore.getProxy();
    },

    maskMe: function() {
        this.fireEvent('maskme', this);
    },

    unMaskMe: function() {
        this.fireEvent('unmaskme', this);
    },

    loadData: function(groups, items, callback) {
        this.fireEvent('loaddata', this, groups, items, callback);
    }
});