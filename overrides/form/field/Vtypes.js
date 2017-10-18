/**
 * Created by j.vd.merwe on 8/15/17.
 */
Ext.define('VisPlanner.overrides.form.field.Vtypes', {
    override: 'Ext.form.field.VTypes',

    TimelineDateRange: function (val, field) {
        var date = field.parseDate(val);

        if (field.startDateField &&
            (!field.dateRangeMax || date === null || (date.getTime() != field.dateRangeMax.getTime()) )) {
            var start = field.up(field.ownerCt.xtype).down('datefield[vfield=fromDate]');
            start.setMaxValue(date);
            start.validate();
            field.dateRangeMax = date;
        }
        else if (field.endDateField &&
            (!field.dateRangeMin || date === null || (date.getTime() != field.dateRangeMin.getTime()) )) {
            var end = field.up(field.ownerCt.xtype).down('datefield[vfield=toDate]');
            end.setMinValue(date);
            end.validate();
            field.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },
    TimelineDateRangeText: 'From date must be greater than To date'
});