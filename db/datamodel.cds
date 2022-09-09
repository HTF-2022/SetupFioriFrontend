namespace com.flexso.htf2022;

using {managed} from '@sap/cds/common';

entity FlowStream : managed {
    key ID       : UUID @(Core.Computed : true);
        flow     : String;
        datetime : String;
        descr    : String;
}
