import {EntityPropertyUpdateQueueManager} from "../entity-property-update-queue-manager";
import {EntityPropertyUpdate} from "../entity-property-update";
import {Node} from "../../node";

jest.mock('../entity-property-update');

describe("update manager", () => {
    let myNodeUpdateManager:EntityPropertyUpdateQueueManager;
    let update1:EntityPropertyUpdate;
    let update2:EntityPropertyUpdate;
    let update3:EntityPropertyUpdate;

    beforeEach(() => {
        myNodeUpdateManager = new EntityPropertyUpdateQueueManager();

        update1 =  new EntityPropertyUpdate(new Node('localhost'), 'a', 'true');
        update1.toString = jest.fn(()=> 'a');

        update2 = new EntityPropertyUpdate(new Node('localhost'), 'b', 'true');
        update2.toString = jest.fn(()=> 'b');

        update3 = new EntityPropertyUpdate(new Node('localhost'), 'c', 'true');
        update3.toString = jest.fn(()=> 'c');
    });

    test('add', () => {
        myNodeUpdateManager.execute(update1);
        myNodeUpdateManager.execute(update2);
        myNodeUpdateManager.execute(update3);
        expect(update1.execute).toHaveBeenCalled();
        expect(update2.execute).toHaveBeenCalled();
        expect(update3.execute).toHaveBeenCalled();
    });

    test('redo should do nothing', () => {
        myNodeUpdateManager.redo();
        myNodeUpdateManager.execute(update1);
        myNodeUpdateManager.redo();
        expect(update1.execute).toHaveBeenCalledTimes(1)
    });

    test('undo', () => {
        myNodeUpdateManager.execute(update1);
        myNodeUpdateManager.undo();
        expect(update1.execute).toHaveBeenCalledTimes(1);
        expect(update1.revert).toHaveBeenCalledTimes(1);
    });

    test('undo once, redo once', () => {
        myNodeUpdateManager.execute(update1);
        myNodeUpdateManager.undo();
        myNodeUpdateManager.redo();
        expect(update1.execute).toHaveBeenCalledTimes(2);
        expect(update1.revert).toHaveBeenCalledTimes(1);
    });

    test('undo twice, redo once', () => {
        myNodeUpdateManager.execute(update1);
        myNodeUpdateManager.execute(update2);
        myNodeUpdateManager.undo();
        myNodeUpdateManager.undo();
        myNodeUpdateManager.redo();
        expect(update1.execute).toHaveBeenCalledTimes(2);
        expect(update2.execute).toHaveBeenCalledTimes(1);
        expect(update1.revert).toHaveBeenCalledTimes(1);
        expect(update2.revert).toHaveBeenCalledTimes(1);
    });

    test('splice queue', () => {
        myNodeUpdateManager.execute(update1);
        myNodeUpdateManager.execute(update2);
        myNodeUpdateManager.undo();
        myNodeUpdateManager.execute(update3);
        myNodeUpdateManager.redo(); //should trigger nothing
        myNodeUpdateManager.undo();
        myNodeUpdateManager.undo();
        myNodeUpdateManager.undo();
        myNodeUpdateManager.undo();

        expect(update1.execute).toHaveBeenCalledTimes(1);
        expect(update2.execute).toHaveBeenCalledTimes(1);
        expect(update3.execute).toHaveBeenCalledTimes(1);
        expect(update1.revert).toHaveBeenCalledTimes(1);
        expect(update2.revert).toHaveBeenCalledTimes(1);
        expect(update3.revert).toHaveBeenCalledTimes(1);
    });

    test('undoQueueToString', () => {
        myNodeUpdateManager.execute(update1);
        myNodeUpdateManager.execute(update2);
        expect(myNodeUpdateManager.undoQueueToString()).toEqual(['b', 'a']);
    });

    test('redoQueueToString', () => {
        myNodeUpdateManager.execute(update1);
        myNodeUpdateManager.execute(update2);
        myNodeUpdateManager.execute(update3);
        myNodeUpdateManager.undo();
        myNodeUpdateManager.undo();
        myNodeUpdateManager.undo();
        expect(myNodeUpdateManager.redoQueueToString()).toEqual(['a', 'b', 'c']);
    });

    test('reset', () => {
        myNodeUpdateManager.execute(update1);
        myNodeUpdateManager.execute(update2);
        myNodeUpdateManager.execute(update3);
        myNodeUpdateManager.reset();

        expect(update1.revert).toHaveBeenCalledTimes(1);
        expect(update2.revert).toHaveBeenCalledTimes(1);
        expect(update3.revert).toHaveBeenCalledTimes(1);

    });
});