import {Node, Network, QuorumSet, Organization} from '../src';

let node1 = new Node('a');
node1.active = true;
node1.isValidating = true;
node1.quorumSet.threshold = 1;
let node2 = new Node('b');
node1.quorumSet.validators.push(node2);

node2.quorumSet.threshold = 1;
node2.quorumSet.validators.push(node1);
node2.active = true;
node2.isValidating = true;
let node3 = new Node('c');
let node4 = new Node('d');

node3.quorumSet.validators.push(node1);
node2.quorumSet.innerQuorumSets.push(new QuorumSet('failingqset', 5, [node3]));

node4.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, [node1]));

let organization = new Organization('id', 'org');
organization.validators = [node1, node2, node3, node4];
let network:Network;

beforeEach(() => {
    network = new Network([node1, node2, node3, node4], [organization]);
} )
test('getTrustingNodes', () => {
    expect(network.getTrustingNodes(node1)).toEqual([node2, node3, node4]);
});

test('isQuorumSetFailing', () => {
    expect(network.isQuorumSetFailing(node2)).toBeFalsy();
    expect(network.isQuorumSetFailing(node2, node2.quorumSet.innerQuorumSets[0])).toBeTruthy();
    expect(network.isQuorumSetFailing(node3)).toBeTruthy();
});

test('isNodeFailing', () => {
    expect(network.isNodeFailing(node1)).toBeFalsy();
    expect(network.isNodeFailing(node2)).toBeFalsy();
    expect(network.isNodeFailing(node3)).toBeTruthy();
    expect(network.isNodeFailing(node4)).toBeTruthy();
    expect(network.isNodeFailing(new Node('unknown'))).toBeTruthy();
});

test ('isOrganizationFailing', () => {
    expect(network.isOrganizationFailing(organization)).toBeFalsy();
    node1.isValidating = false;
    network.updateNetwork();
    expect(network.isOrganizationFailing(organization)).toBeTruthy();

})