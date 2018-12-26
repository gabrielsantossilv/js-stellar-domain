import {QuorumSet, QuorumSetService, Node} from '../src';

let quorumSetService = new QuorumSetService();

let node0 = new Node('localhost');
node0.publicKey = "0";
node0.active = true;
let node1 = new Node('localhost');
node1.publicKey = "1";
node1.active = true;
let node2 = new Node('localhost');
node2.publicKey = "2";
node2.active = true;

let map = new Map();
map.set("0", node0);
map.set("1", node1);
map.set("2", node2);

describe('canReachThreshold', () => {
    test('basic true', () => {
        let qs = new QuorumSet('a', 2, ["0","1", "2"]);
        expect(quorumSetService.quorumSetCanReachThreshold(qs, [], map)).toBeTruthy();
    });
    test('basic false', () => {
        let qs = new QuorumSet('a', 4, ["0","1", "2"]);
        expect(quorumSetService.quorumSetCanReachThreshold(qs, [], map)).toBeFalsy();
    });
    test('failingNode', () => {
        let qs = new QuorumSet('a', 2, ["0","1", "2"]);
        expect(quorumSetService.quorumSetCanReachThreshold(qs, [node0, node1], map)).toBeFalsy();
    });
    test('innerQS', () => {
        let qs = new QuorumSet('a', 2,[], [
            new QuorumSet('b', 2, ["0", "1", "2"]),
            new QuorumSet('c', 1, ["0"])
        ] );
        expect(quorumSetService.quorumSetCanReachThreshold(qs, [], map)).toBeTruthy();
    });
    test('innerInnerQS', () => {
        let qs = new QuorumSet('a', 2,[], [
            new QuorumSet('b', 2, ["0"],
               [
                   new QuorumSet('c', 1, ["2"])
               ]
            ),
            new QuorumSet('c', 1, ["0"])
        ] );
        expect(quorumSetService.quorumSetCanReachThreshold(qs, [], map)).toBeTruthy();
    });
});
