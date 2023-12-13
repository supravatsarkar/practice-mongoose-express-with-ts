import { FilterQuery, Query } from "mongoose";

export class QueryBuilder<T> {
  public modelQuery: Query<T[] | T, T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[] | T, T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  search(searchableFields: string[]) {
    console.log({ searchableFields });
    const searchTerm = this.query.searchTerm;
    console.log({ searchTerm });
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })) as FilterQuery<T>[],
      });
    }
    return this;
  }
  filter() {
    const excludeFieldFromQuery = [
      "searchTerm",
      "limit",
      "page",
      "sort",
      "fields",
    ];
    const queryObj = { ...this.query };
    excludeFieldFromQuery.forEach(field => delete queryObj[field]); // delete unwanted property from query

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    const sortQuery = this?.query?.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortQuery as string);
    return this;
  }
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 1;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  fields() {
    const selectFields =
      (this.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(selectFields);
    return this;
  }
}
