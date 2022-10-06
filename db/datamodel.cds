namespace com.flexso.htf2022;

using {managed} from '@sap/cds/common';

entity FlowStream : managed {
    key ID       : UUID @(Core.Computed : true);
        flow     : String;
        datetime : String;
        descr    : String;
}

entity FlowHint : managed {
    key ID      : UUID @(Core.Computed : true);
        state   : String;
        message : String;
}

entity GandalfQuote : managed {
    key ID      : Integer;
        type   : String;
        message : String;
}

