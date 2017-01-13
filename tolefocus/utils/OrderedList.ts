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
        const result = [] as OrderedItem<TItem>[];
        const withOrderItems = this.items.filter(item => !!item.order);
        const withoutOrderItems = this.items.filter(item => !item.order);
        withOrderItems.forEach(item => {
            result[item.order - 1] = item;
        });
        let i2 = 0;
        for (let i = 0, j = this.items.length; i < j; i++) {
            if (result[i] === undefined && i2 < withoutOrderItems.length) {
                result[i] = withoutOrderItems[i2++];
            }
        }

        this.orderedItems = [];
        result.forEach(item => {
            if (item !== undefined) {
                this.orderedItems.push(item);
            }
        });
    }

    remove(object: TItem) {
        let index = this.items.findIndex((current) => current.object === object);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
        this.reorder();
    }
}
