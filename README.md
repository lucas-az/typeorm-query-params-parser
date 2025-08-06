# TypeORM Query Params Parser

A simple and flexible query parameter parser for TypeORM's QueryBuilder.

## Features

- **Select** specific fields and relations
- **Join** relations easily
- **Sort**, **limit**, and **paginate** results
- **Cache** queries with custom options
- **Soft delete** support (`withDeleted`)
- **Advanced filtering** with logical and comparison operators

## Installation

```bash
npm install typeorm-query-params-parser
# or
yarn add typeorm-query-params-parser
```

## Quick Start

```typescript
import { TypeORMQueryParser } from "typeorm-query-params-parser";

const query = request.query;
const queryBuilder = createQueryBuilder(Entity, "entity");
const queryParser = new TypeORMQueryParser(queryBuilder);

queryParser.parse(query);

// Continue using `queryBuilder` as needed
const results = await queryBuilder.getMany();
```

## Documentation

### Supported Query Parameters

- [select](#select)
- [relations](#relations)
- [sort](#sort)
- [limit](#limit)
- [page](#page)
- [paginate](#paginate)
- [cache](#cache)
- [withDeleted](#withdeleted)
- [filter](#filter)

---

### `select`

Specify which fields to return. Use dot notation for nested fields.

**Examples:**

Select `id`, `name`, and `profile.id`:

```json
{ "select": ["id", "name", "profile.id"] }
```

Select all fields of `profile`:

```json
{ "select": ["id", "name", "profile.*"] }
```

---

### `relations`

Left join relations. Use dot notation for nested relations.

**Example:**

Join `profile` and its `photo`:

```json
{ "relations": ["profile", "profile.photo"] }
```

---

### `sort`

Sort by one or more fields. Prefix with `-` for descending order.

**Example:**

Sort by `id` ascending and `name` descending:

```json
{ "sort": ["id", "-name"] }
```

---

### `limit`

Set the maximum number of items returned (default: `20`).

**Example:**

```json
{ "limit": 100 }
```

---

### `page`

Specify the page number for pagination (default: `1`).

**Example:**

```json
{ "page": 2 }
```

---

### `paginate`

Enable or disable pagination (default: `true`).

**Example:**

```json
{ "paginate": false }
```

---

### `cache`

Enable/disable cache, set cache duration (ms), or provide cache ID.

**Examples:**

Enable cache:

```json
{ "cache": true }
```

Set cache duration:

```json
{ "cache": 1000 }
```

Set cache ID and duration:

```json
{ "cache": ["my-cache-id", 1000] }
```

---

### `withDeleted`

Include soft-deleted entities.

**Example:**

```json
{ "withDeleted": true }
```

---

### `filter`

Advanced filtering using comparison and logical operators.

#### Syntax

```json
{
  "filter": {
    "<field>": { "<operator>": "<value>" }
  }
}
```

#### Supported Operators

| Operator       | Description                              |
| -------------- | ---------------------------------------- |
| `_eq`          | Equal to                                 |
| `_neq`         | Not equal to                             |
| `_lt`          | Less than                                |
| `_lte`         | Less than or equal to                    |
| `_gt`          | Greater than                             |
| `_gte`         | Greater than or equal to                 |
| `_in`          | Value is in array                        |
| `_null`        | Is null (`true`) or not null (`false`)   |
| `_contains`    | Contains substring                       |
| `_starts_with` | Starts with substring                    |
| `_ends_with`   | Ends with substring                      |
| `_between`     | Value is between two values              |
| `_empty`       | Is empty (`true`) or not empty (`false`) |

#### Examples

Filter by name:

```json
{
  "filter": {
    "name": { "_eq": "Erick" }
  }
}
```

Filter by categories:

```json
{
  "filter": {
    "categories": { "_in": ["vegetables", "fruit"] }
  }
}
```

#### Logical Operators

Combine multiple conditions with `_and` or `_or`:

```json
{
  "filter": {
    "_and": [
      {
        "title": { "_eq": "Readme" }
      },
      {
        "status": { "_eq": "published" }
      }
    ],
    "_or": [
      {
        "title": { "_eq": "Readme" }
      },
      {
        "status": { "_eq": "published" }
      }
    ]
  }
}
```

---

## Tips

- Use the [qs](https://github.com/ljharb/qs) package to parse nested objects into query strings.
