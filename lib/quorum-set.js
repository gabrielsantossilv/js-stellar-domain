// 
const _ = require('lodash');

class QuorumSet {


    constructor(hashKey = undefined,
                threshold = Number.MAX_SAFE_INTEGER,
                validators = [],
                innerQuorumSets = []
    ) {
        this._hashKey = hashKey;
        this._threshold = threshold;
        this.validators = validators;
        this.innerQuorumSets = innerQuorumSets;
    }

    hasValidators() {
        return this.validators.length > 0 || this.innerQuorumSets.length > 0;
    }

    get hashKey() {
        return this._hashKey;
    }

    set hashKey(value) {
        this._hashKey = value;
    }

    get threshold() {
        return this._threshold;
    }

    set threshold(value) {
        this._threshold = value;
    }

    get validators() {
        return this._validators;
    }

    set validators(value) {
        this._validators = value;
    }

    get innerQuorumSets() {
        return this._innerQuorumSets;
    }

    set innerQuorumSets(value) {
        this._innerQuorumSets = value;
    }

    static getAllValidators(qs) {
        return qs.innerQuorumSets.reduce(
            (allValidators, innerQS) => allValidators.concat(QuorumSet.getAllValidators(innerQS)),
            qs.validators
        );
    }

    toJSON() {
        return {
            hashKey: this.hashKey,
            threshold: this.threshold,
            validators: Array.from(this.validators),
            innerQuorumSets: Array.from(this.innerQuorumSets)
        };
    }


    static fromJSON(quorumSet) {
        if(!quorumSet){
            return new QuorumSet();
        }

        let innerQuorumSets = quorumSet.innerQuorumSets.map(
            innerQuorumSet => this.fromJSON(innerQuorumSet)
        );

        return new QuorumSet(
            quorumSet.hashKey,
            quorumSet.threshold,
            quorumSet.validators,
            innerQuorumSets
        );
    };
}

module.exports = QuorumSet;
