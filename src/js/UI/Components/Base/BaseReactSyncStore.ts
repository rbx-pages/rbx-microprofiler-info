import { useSyncExternalStore } from "react";

export default class BaseReactSyncStore<T> {
    public storeData: T

    public listeners_Set = new Set<Function>();
    
    /**
     *
     */
    constructor(storeData: T) {
        this.storeData = storeData
    }

    /**
     * Retrieve data from the store.
     */
    public getStore() {
        return this.storeData
    }

    public subscribeToStore(listener: Function) {
        //console.log(listener)

        this.listeners_Set.add(listener)

        let _this = this
        let removalFunction = function() {
            _this.listeners_Set.delete(listener)
        }

        return removalFunction
    }

    /**
     * A function that alerts listeners.
     */
    protected dispatchToListeners() {
        this.listeners_Set.forEach(listener => listener())
    }


    public useHookSyncStore() {
        let makeFuncSubscribeToStore = (listener_onStoreChange: Function) => this.subscribeToStore(listener_onStoreChange);
        let makeFuncGetStore = () => this.getStore();
        
        return useSyncExternalStore(
            makeFuncSubscribeToStore,
            makeFuncGetStore
        )
    }
}