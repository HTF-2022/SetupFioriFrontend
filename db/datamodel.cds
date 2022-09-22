namespace com.flexso.htf2022;

using {managed} from '@sap/cds/common';

entity FlowStream       @(
    UI.DataPoint #flow     : {
        Value : flow,
        Title : 'flow',
        MinimumValue: 0
    },
    UI.DataPoint #datetime : {
        Value : datetime,
        Title : 'datetime'
    },
    UI.Chart               : {
        $Type             : 'UI.ChartDefinitionType',
        Title             : 'flowMicroChart',
        Description       : 'Line Micro Chart',
        ChartType         : #Line,
        Dimensions        : ['datetime'],
        Measures          : ['flow'],
        MeasureAttributes : [{
            $Type     : 'UI.ChartMeasureAttributeType',
            Measure   : 'flow',
            Role      : #Axis2,
            DataPoint : '@UI.DataPoint#flow'
        }]
    },
    presentationVariant    : [{sortOrder : [{
        by        : 'datetime',
        direction : #DESC
    }]}]
) : managed {
    key ID       : UUID @(Core.Computed : true);
        flow     : String;
        datetime : String;
        descr    : String;
}
