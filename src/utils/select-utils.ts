import { EntityMetadata, EntityPropertyNotFoundError, SelectQueryBuilder } from 'typeorm';

import { ALIAS_SEPARATOR } from '../constants';

export class SelectUtils<Entity> {
  constructor(public readonly selectQueryBuilder: SelectQueryBuilder<Entity>) {}

  isFieldWithAlias(field: string) {
    return field.includes(ALIAS_SEPARATOR);
  }

  getFieldWithAlias(alias: string, field: string) {
    return `${alias}${ALIAS_SEPARATOR}${field}`;
  }

  getAlias(field: string): string {
    if (!this.isFieldWithAlias(field)) {
      return this.selectQueryBuilder.alias;
    }

    const alias = field
      .split(ALIAS_SEPARATOR)
      .reverse()
      .slice(1)
      .find((part) => this.selectQueryBuilder.expressionMap.aliases.some(({ name }) => name === part));

    return alias || this.selectQueryBuilder.alias;
  }

  getEntityMetadata(alias: string) {
    const { target } = this.selectQueryBuilder.expressionMap.aliases.find(({ name }) => name === alias);
    const metadata = this.selectQueryBuilder.connection.getMetadata(target);

    return metadata;
  }

  getColumnMetadata(alias: string, field: string) {
    const metadata = this.getEntityMetadata(alias);
    const column = metadata.columns.find(
      ({ propertyPath, propertyName }) => field === propertyPath || field === propertyName,
    );

    if (!column) {
      throw new EntityPropertyNotFoundError(field, metadata);
    }

    return column;
  }

  getEmbeddedMetadata(field: string, entityMetadata: EntityMetadata) {
    const embeddedField = field.split(ALIAS_SEPARATOR).reverse()[1];
    const metadata = entityMetadata.embeddeds.find(({ propertyName }) => embeddedField === propertyName);

    return metadata;
  }

  getAllProperties(field: string) {
    const alias = this.getAlias(field);
    const entityMetadata = this.getEntityMetadata(alias);
    const embeddedMetadata = this.getEmbeddedMetadata(field, entityMetadata);
    const { columns } = embeddedMetadata || entityMetadata;
    const propertiesPath = columns.map(({ propertyPath }) => this.getFieldWithAlias(alias, propertyPath));

    return propertiesPath;
  }

  getProperty(field: string) {
    const parts = field.split(ALIAS_SEPARATOR);
    const alias = this.getAlias(field);
    const property = parts.slice(parts.indexOf(alias) + 1).join(ALIAS_SEPARATOR);
    const column = this.getColumnMetadata(alias, property);
    const propertyPath = this.getFieldWithAlias(alias, column.propertyPath);

    return propertyPath;
  }
}
