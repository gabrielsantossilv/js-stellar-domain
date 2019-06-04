import {Node} from "../../node";
import {NodeStatistics} from "../../node-statistics";

export class ActiveIndex {
    static get(node:Node):number {
        return node.statistics.active7DaysPercentage/100;
    }
}