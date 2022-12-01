"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude = void 0;
function exclude(item, ...keys) {
    for (const key of keys) {
        delete item[key];
    }
    return item;
}
exports.exclude = exclude;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9kYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFnQixPQUFPLENBQ3JCLElBQU8sRUFDUCxHQUFHLElBQVc7SUFFZCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUN0QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVJELDBCQVFDIn0=