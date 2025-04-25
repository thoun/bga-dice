export type SortFunction<T> = (a: T, b: T) => number;

export function sort<T>(...sortedFields: string[]): SortFunction<T> {
    return (a, b) => {
        for (let i = 0; i < sortedFields.length; i++) {
            let direction = 1;
            let field = sortedFields[i];
            if (field[0] == '-') {
                direction = -1;
                field = field.substring(1);
            } else if (field[0] == '+') {
                field = field.substring(1);
            }
            const type = typeof a[field];
            if (type === 'string') {
                const compare = a[field].localeCompare(b[field]);
                if (compare !== 0) {
                    return compare * direction;
                }
            } else if (type === 'number') {
                const compare = (a[field] - b[field]);
                if (compare !== 0) {
                    return compare * direction;
                }
            }
        }

        return 0;
    };
}