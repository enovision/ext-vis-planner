/**
 * Created by j.vd.merwe on 8/15/17.
 */
Ext.define('VisPlanner.view.panel.timeline.TimeLineController', {
    extend: 'VisPlanner.base.controller.TimeLineBaseController',
    alias: 'controller.VisTimeLineController',

    isMasked: false,

    /**
     *
     * @param argsGroups {null|object}
     * @param argsItems  {null|object}
     * @param callback  {null|function}
     *
     */
    onLoadStoreData: function (argsGroups, argsItems, callback) {
        var me = this;
        var view = this.getView();

        me.onMaskMe(view);

        argsGroups = argsGroups || {};
        argsItems = argsItems || {};

        var argsI = Ext.apply(argsItems, {
            callback: function (records) {
                me.initStoreData(view);
                me.initTimeLine(view);
                me.onUnMaskMe(view);
                if (typeof callback !== 'undefined') {
                    callback();
                }
            }
        });

        var argsG = Ext.apply(argsGroups, {
            callback: function (records) {
                me.storeItems.load(argsI)
            }
        });

        me.storeGroups.load(argsG);

    },

    onLoadData: function(view, groups, items, callback) {
        var me = this;

        me.onMaskMe(view);

        view.groupStore.removeAll();
        view.itemStore.removeAll();

        view.groupStore.add(groups);
        view.itemStore.add(items);

        me.initStoreData(view);
        me.initTimeLine(view);
        me.onUnMaskMe(view);

        if (typeof callback !== 'undefined') {
           callback();
        }
    },

    onMaskMe: function (panel) {
        var me = this;

        if (panel.isHidden() === false && this.isMasked === false) {
            panel.body.mask(panel.loadDataText);
            me.isMasked = true;
        }
    },

    onUnMaskMe: function (panel) {
        var me = this;

        if (panel.isHidden() === false) {
            panel.body.unmask();
            me.isMasked = false;
        }
    },

    /*
     * TimeLine Event bindings
     */

    onFinishedRedraw: function () {
        var me = this;
        // console.log('finishedredraw');
        me.fireViewEvent('timelinefinishedredraw', me.timeLine);
    },

    onRangeChange: function (range) {
        var me = this;

        var view = this.getView();
        view.updateLayout();

        // console.log('rangechange', range);
        me.fireViewEvent('timelinerangechange', me.timeLine, range);
    },

    onRangeChanged: function (range) {
        var me = this;
        var view = me.getView();

        if (!view.hideTimeLineTbar && !me.timeLineIsSet) {
            me.timeLineTbar.setMinMaxValue(range.start, range.end);
            me.timeLineTbar.setFocusDate(new Date());
            me.timeLineIsSet = true;
        }

        // console.log('timelinerangechanged', me.timeLine, range);
        me.fireViewEvent('timelinerangechanged', me.timeLine, range);
    },

    onSelect: function (items) {
        var me = this;

        var dataSetRecords = me.getDatasetRecords(items);
        var storeRecords = me.getStoreRecords(items);

        // console.log('timelineselect', me.timeLine, storeRecords, dataSetRecords, items);
        me.fireViewEvent('timelineselect', me.timeLine, storeRecords, dataSetRecords, items);
    },

    onTimeChange: function (time) {
        var me = this;
        // console.log('timelinetimechange', me.timeLine, time);
        me.fireViewEvent('timelinetimechange', me.timeLine, time);
    },

    onTimeChanged: function (time) {
        var me = this;
        // console.log('timelinetimechanged', me.timeLine, time);
        me.fireViewEvent('timelinetimechanged', me.timeLine, time);
    },

    onItemOver: function (props) {
        var me = this;
        var view = this.getView();

        var datasetRecord = me.getDatasetItemRecordFromProps(props);
        var storeRecord = me.getStoreItemRecordFromProps(props);

        if (datasetRecord !== null) {
            // console.log('timelineitemoveritem', storeRecord, datasetRecord, props);

            if (datasetRecord.hasOwnProperty('title') && view.timeLineItemTooltip) {
                if (me.tooltip === null) {
                    me.tooltip = Ext.create('Ext.tip.ToolTip', {
                        target: view.el,
                        anchor: 'left',
                        delegate: '.vis-item',
                        html: datasetRecord.title
                    });
                } else {

                    me.tooltip.update(datasetRecord.title);

                }

            }

            me.fireViewEvent('timelineitemoveritem', storeRecord, datasetRecord, props);
        }
    },

    onItemOut: function (props) {
        this.tooltip.hide();
    },

    onDoubleClick: function (props) {
        var me = this;
        // console.log('timelinedoubleclick', props);

        var datasetRecord = me.getDatasetItemRecordFromProps(props);
        var storeRecord = me.getStoreItemRecordFromProps(props);

        if (datasetRecord !== null) {
            // console.log('timelinedoubleclick', storeRecord, datasetRecord, props);
            me.fireViewEvent('timelinedoubleclick', storeRecord, datasetRecord, props);
        }

    },

    onContextMenu: function (props) {
        var me = this;
        props.event.preventDefault();

        var datasetRecord = me.getDatasetItemRecordFromProps(props);
        var storeRecord = me.getStoreItemRecordFromProps(props);

        // console.log('timelinecontextmenu', storeRecord, datasetRecord, props);
        me.fireViewEvent('timelinecontextmenu', storeRecord, datasetRecord, props);
    },

    /**
     * Groups / Items
     */
    onItemsChange: function (event, properties, senderId) {
        var me = this;
        // console.log('timelineitemschange', event, properties, senderId);
        me.fireViewEvent('timelineitemschange', event, properties, senderId);
    },

    onGroupsChange: function (event, properties, senderId) {
        var me = this;
        // console.log('timelinegroupschange', event, properties, senderId);
        me.fireViewEvent('timelinegroupschange', event, properties, senderId);
    },

    /**
     * Items individual
     */

    onItemMove: function (item, callback) {
        var me = this;
        // console.log('timelineitemmove', item);

        // Update the Dataset
        item = me.updateItemTitle(item, true);
        me.timeLineItems.update(item);

        me.fireViewEvent('timelineitemmove', item);
        callback(item);
    },
    onItemMoving: function (item, callback) {
        var me = this;
        // console.log('timelineitemmoving', item);
        me.fireViewEvent('timelineitemmoving', item);
        callback(item);
    },
    onItemRemove: function (item, callback) {
        var me = this;
        // console.log('timelineitemremove', item);
        me.fireViewEvent('timelineitemremove', item);
        callback(item);
    },
    onItemAdd: function (item, callback) {
        var me = this;
        // console.log('timelineitemadd', item);
        me.fireViewEvent('timelineitemadd', item);
        callback(item);
    },
    onItemUpdate: function (item, callback) {
        var me = this;
        // console.log('timelineitemupdate', item);
        me.fireViewEvent('timelineitemadd', item);
        callback(item);
    },

    /**
     * Toolbar events
     */

    onFocusdatechanged: function (tbar, date) {
        var me = this;
        me.timeLine.moveTo(date);
    },

    onFromdatechanged: function (tbar, fromDate, toDate) {
        fromDate.setHours(0, 0, 0);
        toDate.setHours(23, 59, 59);
        this.timeLine.setWindow(fromDate, toDate);
    },

    onTodatechanged: function (tbar, fromDate, toDate) {
        fromDate.setHours(0, 0, 0);
        toDate.setHours(23, 59, 59); // end of the day
        this.onFromdatechanged(tbar, fromDate, toDate);
    },

    onFastBackwardClicked: function (tbar, btn, e) {
        var me = this;
        me.timeLine.moveTo(me.timeLineMinDate);
    },

    onBackwardClicked: function (tbar, btn, e) {
        var me = this;
        var window = me.timeLine.getWindow();
        var newStart = Ext.Date.subtract(window['start'], Ext.Date.DAY, me.timeLineSkip);
        me.timeLine.moveTo(newStart);

    },

    onFastForwardClicked: function (tbar, btn, e) {
        var me = this;
        me.timeLine.moveTo(me.timeLineMaxDate);

    },

    onForwardClicked: function (tbar, btn, e) {
        var me = this;
        var window = me.timeLine.getWindow();
        var newStart = Ext.Date.subtract(window['end'], Ext.Date.DAY, me.timeLineSkip * -1);
        me.timeLine.moveTo(newStart);
    },

    onZoomInClicked: function (tbar, btn, e) {
        var me = this;
        me.timeLine.zoomIn(0.2);
    },

    onZoomOutClicked: function (tbar, btn, e) {
        var me = this;
        me.timeLine.zoomOut(0.2);
    },

    onDatesReset: function (tbar, focus, from, to) {
        var me = this;
        me.onFocusdatechanged(tbar, focus);
        me.onFromdatechanged(tbar, from, to);
    }
});