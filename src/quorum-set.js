// @flow
const R = require('ramda');

class QuorumSet {

    _hashKey: string;
    _threshold: number;
    _validators: Array<string>;
    _innerQuorumSets: Array<QuorumSet>;
    _dateDiscovered: Date;
    _dateLastSeen: Date;

    constructor(hashKey: string,
                threshold: number = Number.MAX_SAFE_INTEGER,
                validators: Array<string> = [],
                innerQuorumSets: Array<QuorumSet> = [],
                dateDiscovered: Date = new Date(),
                dateLastSeen: Date = new Date(),) {
        this._hashKey = hashKey;
        this._threshold = threshold;
        this.validators = validators;
        this.innerQuorumSets = innerQuorumSets;
        this._dateDiscovered = dateDiscovered;
        this._dateLastSeen = dateLastSeen;
    }

    hasValidators() {
        return this.validators.length > 0 || this.innerQuorumSets.length > 0;
    }

    get hashKey(): string {
        return this._hashKey;
    }

    set hashKey(value: string): void {
        this._hashKey = value;
    }

    get threshold(): number {
        return this._threshold;
    }

    set threshold(value: number): void {
        this._threshold = value;
    }

    get validators(): Array<string> {
        return this._validators;
    }

    set validators(value: Array<string>) {
        this._validators = value;
    }

    get innerQuorumSets(): Array<QuorumSet> {
        return this._innerQuorumSets;
    }

    set innerQuorumSets(value: Array<QuorumSet>): void {
        this._innerQuorumSets = value;
    }

    get dateDiscovered(): Date {
        return this._dateDiscovered;
    }

    set dateDiscovered(value: Date): void {
        this._dateDiscovered = value;
    }

    get dateLastSeen(): Date {
        return this._dateLastSeen;
    }

    set dateLastSeen(value: Date): void {
        this._dateLastSeen = value
    }

    static getAllValidators(qs:QuorumSet): Array<string> {
        return R.reduce(
            (validators, innerQS) => R.concat(validators, QuorumSet.getAllValidators(innerQS)),
            qs.validators,
            qs.innerQuorumSets
        );
    }

    toJSON(): Object {
        return {
            hashKey: this.hashKey,
            threshold: this.threshold,
            validators: Array.from(this.validators),
            innerQuorumSets: Array.from(this.innerQuorumSets),
            dateDiscovered: this.dateDiscovered,
            dateLastSeen: this.dateLastSeen,
        };
    }


    static fromJSON(quorumSet: ?Object): ?QuorumSet {
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
            innerQuorumSets,
            quorumSet.dateDiscovered,
            quorumSet.dateLastSeen
        );
    };
}

module.exports = QuorumSet;
