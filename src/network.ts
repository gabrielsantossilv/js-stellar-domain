import {QuorumSet, Node, QuorumService, QuorumSetService, generateTomlString} from "./index";
import * as _ from 'lodash';

export class Network {
    protected _nodes: Array<Node>;
    protected _links: Array<{ id: string, source: Node, target: Node, isClusterLink: boolean }>;
    protected _publicKeyToNodesMap: Map<string, Node>;
    protected _failingNodes: Array<Node>;
    protected _reverseNodeDependencyMap: Map<string, Array<Node>>;
    protected _clusters: Array<Set<string>>;
    protected _latestCrawlDate: Date;
    protected _quorumSetService: QuorumSetService;

    constructor(nodes: Array<Node>) {
        this._nodes = nodes;
        this._publicKeyToNodesMap = QuorumService.getPublicKeyToNodeMap(nodes);
        this._quorumSetService = new QuorumSetService();
        this.calculateLatestCrawlDate(); //before we create nodes for unknown validators because they will have higher updated dates
        this.createNodesForUnknownValidators();
        this.initializeReverseNodeDependencyMap();
        this.computeFailingNodes();
        this.detectClusters();
        this.createLinks();
    }

    computeQuorumIntersection() {
        QuorumService.hasQuorumIntersection(
            this._nodes,
            this._clusters,
            this._publicKeyToNodesMap
        )
    }

    updateNetwork(nodes?: Array<Node>) {
        if (nodes) {
            this._nodes = nodes;
            this._publicKeyToNodesMap = QuorumService.getPublicKeyToNodeMap(nodes);
            this.createNodesForUnknownValidators();
        }
        this.initializeReverseNodeDependencyMap();
        this.computeFailingNodes();
        this.createLinks();
    }

    detectClusters() {
        this._clusters = QuorumService.getAllClusters(
            this.nodes.filter(node => node.active && node.quorumSet.hasValidators()),
            this._publicKeyToNodesMap
        );
    }

    calculateLatestCrawlDate(): Date | undefined {
        if (this.nodes.length === 0) {
            return undefined;
        }

        this._latestCrawlDate = this.nodes
            .map(node => node.dateUpdated)
            .sort(function (a: Date, b: Date) {
                return b.valueOf() - a.valueOf();
            })[0];
    }

    get latestCrawlDate(): Date {
        return this._latestCrawlDate;
    }

    get links() {
        return this._links;
    }

    get failingNodes() {
        return this._failingNodes;
    }

    isNodeFailing(node: Node) {
        return this._failingNodes.includes(node);
    }

    isQuorumSetFailing(quorumSet: QuorumSet) {
        return !this._quorumSetService.quorumSetCanReachThreshold(quorumSet, this._failingNodes, this._publicKeyToNodesMap);
    }

    getQuorumSetTomlConfig(quorumSet: QuorumSet): string {
        return generateTomlString(quorumSet, this._publicKeyToNodesMap);
    }

    createLinks() {
        this._links = _.flatten(this._nodes
            .filter(node => node.active && !this._failingNodes.includes(node))
            .map(node => {
                return QuorumSet.getAllValidators(node.quorumSet)
                    .filter(validator => this._publicKeyToNodesMap.get(validator).active && !this._failingNodes.includes(this._publicKeyToNodesMap.get(validator)))
                    .map(validator => {
                        return {
                            'id': node.publicKey + validator,
                            'source': node,
                            'target': this._publicKeyToNodesMap.get(validator),
                            'isClusterLink': this.isClusterLink(node.publicKey, validator)/*,
                    'active': this._publicKeyToNodesMap.get(validator).active
                    && this._publicKeyToNodesMap.get(node.publicKey).active
                    && !this._failingNodes.includes(this._publicKeyToNodesMap.get(validator))
                    && !this._failingNodes.includes(node)*/
                        };
                    })
            }));
    }

    isClusterLink(source, target) {
        return Array.from(this._clusters).filter(cluster => cluster.has(source) && cluster.has(target)).length > 0;
    }

    createNodesForUnknownValidators() {
        this._nodes.forEach(node => {
            QuorumSet.getAllValidators(node.quorumSet).forEach(validator => {
                if (!this._publicKeyToNodesMap.has(validator)) {
                    let missingNode = new Node('unknown');
                    missingNode.publicKey = validator;
                    this.nodes.push(missingNode);
                    this._publicKeyToNodesMap.set(validator, missingNode);
                }
            })
        });
    }

    initializeReverseNodeDependencyMap() {
        this._reverseNodeDependencyMap = new Map();
        this.nodes.forEach(node => {
            QuorumSet.getAllValidators(node.quorumSet).forEach(validator => {
                if (!this._reverseNodeDependencyMap.has(validator)) {
                    this._reverseNodeDependencyMap.set(validator, [])
                }
                this._reverseNodeDependencyMap.get(validator).push(node);
            })
        });
    }

    get nodes(): Array<Node> {
        return this._nodes;
    }

    getNodeByPublicKey(publicKey): Node {
        return this._publicKeyToNodesMap.get(publicKey)
    }

    /*
    * Get nodes that have the given node in their quorumSet
     */
    getTrustingNodes(node: Node): Node[] {
        let trustingNodes = this._reverseNodeDependencyMap.get(node.publicKey);
        if(trustingNodes === undefined)
            return [];

        return trustingNodes;
    }

    computeFailingNodes() {
        let failingNodes = [];
        let nodesToCheck = this._nodes.filter(node => node.active && node.quorumSet.hasValidators()); //check all active nodes
        while (nodesToCheck.length > 0) {
            let nodeToCheck = nodesToCheck.pop();

            if (failingNodes.includes(nodeToCheck)) {
                continue; //already failing
            }

            if (this._quorumSetService.quorumSetCanReachThreshold(nodeToCheck.quorumSet, failingNodes, this._publicKeyToNodesMap)) {
                continue; //working as expected
            }

            //node is failing
            failingNodes.push(nodeToCheck);

            //recheck all nodes that are dependant on it
            if (!this._reverseNodeDependencyMap.has(nodeToCheck.publicKey)) {
                continue //no nodes are dependant on it
            }

            this._reverseNodeDependencyMap.get(nodeToCheck.publicKey).forEach(node => {
                if (node.active && node.quorumSet.hasValidators())
                    nodesToCheck.push(node);
            })
        }

        this._failingNodes = failingNodes;
    }
}