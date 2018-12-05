import { QuorumSet } from "./quorum-set";
import { Node } from './node';
export declare class Network {
    protected _nodes: Array<Node>;
    protected _links: Array<Object>;
    protected _publicKeyToNodesMap: Map<string, Node>;
    protected _failingNodes: Array<Node>;
    protected _reverseNodeDependencyMap: Map<string, Array<Node>>;
    protected _clusters: Array<Set<string>>;
    protected _latestCrawlDate: Date;
    constructor(nodes: Array<Node>);
    computeQuorumIntersection(): void;
    updateNetwork(nodes: Array<Node>): void;
    detectClusters(): void;
    calculateLatestCrawlDate(): any;
    readonly latestCrawlDate: Date;
    readonly links: Object[];
    readonly failingNodes: Node[];
    isNodeFailing(node: Node): boolean;
    isQuorumSetFailing(quorumSet: QuorumSet): boolean;
    createLinks(): void;
    isClusterLink(source: any, target: any): boolean;
    createNodesForUnknownValidators(): void;
    initializeReverseNodeDependencyMap(): void;
    readonly nodes: Array<Node>;
    getNodeByPublicKey(publicKey: any): Node;
    computeFailingNodes(): void;
    quorumSetCanReachThreshold(quorumSet: any, failingNodes: any): boolean;
}
