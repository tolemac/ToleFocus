export declare type OrderedItem<TItem> = {
    object: TItem;
    order?: number;
};
export declare class OrderedList<TItem> {
    private items;
    orderedItems: OrderedItem<TItem>[];
    add(object: TItem, order?: number): void;
    private reorder();
    remove(object: TItem): void;
}
