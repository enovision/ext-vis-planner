/**
 * @copyright   Enovision GmbH
 * @author      Johan van de Merwe
 * @licence     MIT-Styled License
 * @date        31 July 2017
 * @class       VideoPlayer.singleton.Config
 *
 */

Ext.define('VisPlanner.singleton.Util', {
    singleton: true,
    alternateClassName: ['VisPlannerUtil', 'visUtil'],

    config: {
        second: 1000,
        minute: 1000 * 60,
        hour: 1000 * 3600,
        day: 1000 * 3600 * 24,
        week: 1000 * 3600 * 24 * 7,
        month: 1000 * 3600 * 24 * 31,
        year: 1000 * 3600 * 24 * 365
    },

    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent();
    },

    /**
     * extend 2 objects into a third one
     * @param obj
     * @param src
     * @returns {*}
     */
    mergeObjects: function (obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    },

    /**
     * @param newDate {date}
     * @param oldDate {date}
     * @param operator ('min'|'max'}
     * @param fullTime {boolean} [fullTime=false]
     * @returns {*}
     */
    compareDate: function (newDate, oldDate, operator, fullTime) {
        var date = new Date(oldDate); // copy
        fullTime = typeof fullTime === 'undefined' ? false: fullTime;

        if (oldDate === null || (newDate < oldDate && operator === 'min') || (newDate > oldDate && operator === 'max')) {
            date = new Date(newDate); // copy
        }

        if (operator === 'max' && fullTime) {
            date.setHours(23,59,59,999);
        }

        return date;
    },

    /**
     * Time formatting function
     * Thanks to the Flowplayer jQuery plugin
     * @private
     * @param {Number} sec Time in seconds to be formatted
     * @return {String} Edited Time in seconds ('hh:mm:ss')
     */
    formatTime: function (sec) {

        function zeropad (val) {
            val = parseInt(val, 10);
            return val >= 10 ? val : "0" + val;
        }

        sec = sec || 0;

        var h = Math.floor(sec / 3600),
            min = Math.floor(sec / 60);

        sec = sec - (min * 60);

        if (h >= 1) {
            min -= h * 60;
            return h + ":" + zeropad(min) + ":" + zeropad(sec);
        }

        return zeropad(min) + ":" + zeropad(sec);
    }
});