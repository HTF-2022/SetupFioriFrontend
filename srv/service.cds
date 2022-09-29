using {com.flexso.htf2022 as db} from '../db/datamodel';

@(requires : 'authenticated-user')
@path : 'service/htf2022'
service FlowStreamService {
    entity FlowStream @(
        restrict  : [{
            grant : ['READ'],
            to    : ['HTF2022_Viewer']
        }]
    ) as projection on db.FlowStream;

    entity FlowHint @(
        restrict  : [{
            grant : ['READ'],
            to    : ['HTF2022_Viewer']
        }]
    ) as projection on db.FlowHint;
}
