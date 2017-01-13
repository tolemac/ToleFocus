export type OrderedItem<TItem> = {
    object: TItem;
    order?: number;
}

export class OrderedList<TItem> {
    private items: OrderedItem<TItem>[] = [];
    orderedItems: OrderedItem<TItem>[] = [];

    add(object: TItem, order?: number) {
        let index = this.items.findIndex((current) => current.object === object);
        if (index >= 0) {
            // If exists update order if it's passed.
            if (order >= 0) {
                this.items[index].order = order;
                this.reorder();
            }
        } else {
            // If not exists add it
            this.items.push({ object, order });
            this.reorder();
        }
    }

    private reorder() {
        this.orderedItems = [... this.items];
    }

    remove(object: TItem) {
        let index = this.items.findIndex((current) => current.object === object);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
        this.reorder();
    }
}
