export interface DropdownData<T, U> {
    key: T;
    value: U;
}


export interface TagData {
    key: string | number ;
    name: string;
    onFilter: <T, U>() => DropdownData<T, U>[] | undefined;
}