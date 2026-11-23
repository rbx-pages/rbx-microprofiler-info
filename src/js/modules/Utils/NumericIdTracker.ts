export default class NumericIdTracker {
    private nextId = 0;
    private availableIds: number[] = [];

    public createId() {
        const id = this.availableIds.pop();

        if (id !== undefined)
            return id;

        let idToReturn = this.nextId
        this.nextId = this.nextId + 1 // increment
        return idToReturn
    }

    public releaseId(id: number) {
        this.availableIds.push(id)
    }

    public createIdAsString() {
        let id = this.createId()
        return String(id)
    }

    public releaseIdFromString(idStr: string) {
        let id = Number(idStr)
        this.releaseId(id)
    }
}