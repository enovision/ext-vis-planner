/**
 * Created by j.vd.merwe on 8/18/17.
 */
Ext.define('VisPlanner.base.controller.TimeLineBaseController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'VisPlanner.singleton.Util'
    ],

    timeLine: null,
    timeLineContainer: null,
    timeLineGroups: null,
    timeLineItems: null,
    timeLineEl: null,
    timeLineOptions: null,
    timeLineHasItems: false,

    timeLineSkip: 3,
    timeLineDayMargin: 0,

    timeLineIsLoaded: false,
    timeLineIsRendered: false,
    timeLineIsSet: false,

    timeLineMinDate: null,
    timeLineMaxDate: null,

    timeLineTbar: null,

    /**
     * Iniatate the timeLine only once !!!
     */
    timeLineInitiated: false,

    storeGroups: null,
    storeItems: null,

    hasBeenReset: true,

    control: {
        '#': {
            render: 'onRender',
            resize: 'onResize',
            show: 'onShow',
            afterlayout: 'onAfterlayout',
            afterrender: 'onAfterrender',
            destroy: 'onDestroy',
            loadStoreData: 'onLoadStoreData',
            clearTimeline: 'onClearTimeline',
            maskme: 'onMaskMe',
            unmaskme: 'onUnMaskMe',
            loaddata: 'onLoadData'
        },
        'VisTimeLineTbar': {
            focusdatechanged: 'onFocusdatechanged',
            fromdatechanged: 'onFromdatechanged',
            todatechanged: 'onTodatechanged',
            fastbackwardclicked: 'onFastBackwardClicked',
            backwardclicked: 'onBackwardClicked',
            fastforwardclicked: 'onFastForwardClicked',
            forwardclicked: 'onForwardClicked',
            zoominclicked: 'onZoomInClicked',
            zoomoutclicked: 'onZoomOutClicked',
            datesreset: 'onDatesReset'
        }
    },

    init: function (view) {
        var me = this;
        me.timeLineTbar = view.down('VisTimeLineTbar');
        me.timeLineContainer = view.down('VisTimeContainer');

        if (view.itemStore === null && view.groupStore === null) {
            alert('Make sure you have at least defined an `itemStore` in your panel');
        }

        if (!view.hideTimeLineTbar) {
            var tBar = me.timeLineTbar;
            me.focusDate = tBar.lookupReference('focusDate');
            me.fromDate = tBar.lookupReference('fromDate');
            me.toDate = tBar.lookupReference('toDate');
        }

        me.storeGroups = view.groupStore;
        me.storeItems = view.itemStore;

        me.timeLineSkip = view.timeLineSkip;
        me.timeLineDayMargin = view.timeLineDayMargin;

        Ext.apply(view.timeLineInitOptions, {
            onMove: me.onItemMove.bind(me),
            onMoving: me.onItemMoving.bind(me),
            onRemove: me.onItemRemove.bind(me),
            onAdd: me.onItemAdd.bind(me),
            onUpdate: me.onItemUpdate.bind(me)
        });
    },

    onResize: function (view) {
        this.timeLine.redraw();
    },

    onRender: function (view) {
        var me = this;

        me.timeLineGroups = new vis.DataSet({});
        me.timeLineGroups.on('*', me.onGroupsChange.bind(me));

        me.timeLineItems = new vis.DataSet({});
        me.timeLineItems.on('*', me.onItemsChange.bind(me));

        if (view.autoLoad) {
            me.initStoreData(view);
        }

        me.initTimeLine(view);

    },

    onAfterrender: function (view) {
        var me = this;

        me.timeLineIsRendered = true;
        // console.log('afterrender');
    },

    onAfterlayout: function (view) {
        var me = this;

        /**
         * Set focus date to fromDate if current focus date
         * is out of the range of fromDate - toDate
         */
        if (!view.hideTimeLineTbar && me.hasBeenReset) {
            var today = new Date();

            if ((today >= me.timeLineMinDate && today <= me.timeLineMaxDate) === false) {
                me.onFocusdatechanged(me.timeLineTbar, me.timeLineMaxDate);
            }

        }

        me.hasBeenReset = false;

        // console.log('afterlayout');
    },

    onShow: function (view) {
        var me = this;
        // console.log('show');
    },

    onDestroy: function (view) {
        this.timeLine.destroy();
    },

    /**
     * Events emitted by calling from other components
     */

    onClearTimeline: function (args) {
        var me = this;

        var clearItems = typeof args === 'undefined' || !args.hasOwnProperty('items') ? true : args['items'];
        var clearOptions = typeof args === 'undefined' || !args.hasOwnProperty('options') ? true : args['options'];
        var clearGroups = typeof args === 'undefined' || !args.hasOwnProperty('groups') ? true : args['groups'];

        var clearThis = {
            options: clearOptions,
            items: clearItems,
            groups: clearGroups
        };

        me.timeLine.clear(clearThis);

        me.fireViewEvent('timelinecleared', me.timeLine, clearThis);
    },

    /**
     * Private functions
     */

    privates: {
        tooltip: null,

        clonedOptions: function () {
            return Object.assign({}, this.timeLineOptions);
        },

        /**
         * Panel Initialization
         */
        initStoreData: function (view, loadGroups) {
            var me = this;

            loadGroups = typeof loadGroups === 'undefined' ? true : loadGroups;

            me.loadItems(view);

            if (loadGroups) {
                me.loadGroups(view);
            }

            if (me.timeLineHasItems) {
                var minDate = new Date(me.timeLineMinDate);
                var maxDate = new Date(me.timeLineMaxDate);

                view.timeLineInitOptions['min'] = minDate;
                view.timeLineInitOptions['max'] = maxDate;

                if (!view.hideTimeLineTbar) { //TODO, can this go ???
                   me.focusDate.setMinValue(new Date(minDate));
                   me.focusDate.setMaxValue(new Date(maxDate));
                }
            }
        },

        /**
         * Timeline Initialization
         */
        initTimeLine: function (view) {
            var me = this;

            me.hasBeenReset = true;

            if (me.timeLineInitiated === false) {
                me.timeLineEl = view.getTimeLineEl();
                me.timeLine = new vis.Timeline(me.timeLineEl);
                me.bindTimeLineEvents(view);
                me.timeLineInitiated = true;
            }

            me.timeLineOptions = Object.assign(view.timeLineInitOptions, view.timeLineOptions, {
                autoResize: false, // forced !!!
                verticalScroll: true, // forced !!!
                height: '100%', // forced !!!
                showTooltips: false // forced !!!
            });

            me.timeLine.setOptions(me.clonedOptions());

            if (me.timeLineGroups !== null) {
                me.timeLine.setGroups(me.timeLineGroups);
            }

            me.timeLine.setItems(me.timeLineItems);

        },

        bindTimeLineEvents: function (view) {
            var me = this;
            var tl = me.timeLine;

            tl.on('finishedredraw', me.onFinishedRedraw.bind(me));
            tl.on('rangechange', me.onRangeChange.bind(me));
            tl.on('rangechanged', me.onRangeChanged.bind(me));
            tl.on('select', me.onSelect.bind(me));
            tl.on('timechange', me.onTimeChange.bind(me));
            tl.on('timechanged', me.onTimeChanged.bind(me));
            tl.on('doubleClick', me.onDoubleClick.bind(me));
            tl.on('itemover', me.onItemOver.bind(me));
            tl.on('itemout', me.onItemOut.bind(me));

            if (view.enableContextMenuEvent) {
                tl.on('contextmenu', me.onContextMenu.bind(me));
            }
        },

        /*
         * Group and Items Data Loading
         */

        loadGroups: function (view) {
            var me = this;
            var gStore = me.storeGroups;
            var tlGroups = me.timeLineGroups;

            var records = gStore.getRange();
            tlGroups.clear(); // first clear the Dataset

            records.map(function (record) {
                tlGroups.add(record.getData());
            });

        },

        loadItems: function (view) {
            var me = this;
            var iStore = me.storeItems;
            var tlItems = me.timeLineItems;
            var data;
            var tbar = me.timeLineTbar;

            var records = iStore.getRange();

            tlItems.clear(); // first clear the Dataset

            var tlData = [];

            me.timeLineMinDate = me.timeLineMaxDate = null;

            records.map(function (record) {
                data = record.getData();
                data = me.updateItemTitle(data);

                tlData.push(data);

                me.timeLineHasItems = true;
                me.timeLineMinDate = visUtil.compareDate(record.get('start'), me.timeLineMinDate, 'min');
                me.timeLineMaxDate = visUtil.compareDate(record.get('end'), me.timeLineMaxDate, 'max', true);
            });

            if (tbar !== null) {
                tbar.setMinMaxValue(me.timeLineMinDate, me.timeLineMaxDate);
            }

            /**
             * Day margin to prevent that event blocks are not shown broken
             */
            if (me.timeLineHasItems) {
                tlItems.add(tlData);
                //me.timeLineMinDate = Ext.Date.subtract(me.timeLineMinDate, Ext.Date.DAY, me.timeLineDayMargin);
                //me.timeLineMaxDate = Ext.Date.subtract(me.timeLineMaxDate, Ext.Date.DAY, me.timeLineDayMargin * -1);
            }
        },

        updateItemTitle: function (data, force) {
            var view = this.getView();

            if ((!data.hasOwnProperty('title') || data['title'] === '' || force) && view.timeLineItemTooltip) {
                data['title'] = view.timeLineItemTooltip.apply(data);
            }

            return data;
        },

        /**
         * finds the selected record id's in the
         * vis.Dataset
         *
         * @param args
         * @returns {Array}
         */
        getDatasetRecords: function (args) {
            var me = this;
            var records = [];
            var record;

            if (args.hasOwnProperty('items')) {

                args.items.map(function (item) {
                    record = me.timeLineItems.get(item);
                    records.push(record);
                });
            }

            return records;
        },

        /**
         * get the record from the vis Dataset
         * @param props
         * @returns {*}
         */
        getDatasetItemRecordFromProps: function (props) {
            var me = this;
            var record = null;

            if (props.item !== null) {
                record = me.timeLineItems.get(props.item);
            }

            return record;
        },

        /**
         * get the record from the ExtJS store
         * @param props
         * @returns {*}
         */
        getStoreItemRecordFromProps: function (props) {
            var me = this;
            var record = null;
            var store = me.storeItems;

            if (props.item !== null) {
                record = store.findRecord('id', props.item);
            }

            return record;
        },

        /**
         *
         * @param args
         */
        getStoreRecords: function (args) {
            var me = this;
            var records = [];
            var record;
            var store = me.storeItems;

            if (args.hasOwnProperty('items')) {

                args.items.map(function (item) {
                    record = store.findRecord('id', item);
                    records.push(record);
                });
            }

            return records;
        },

        /**
         * Clear dataset
         */

        clearDatasetItems: function () {
            this.timeLineItems.clear();
        },

        clearDatasetGroups: function () {
            this.timeLineGroups.clear();
        },

        clearDatasetAll: function () {
            this.clearDatasetItems();
            this.clearDatasetGroups();
        }
    }

});