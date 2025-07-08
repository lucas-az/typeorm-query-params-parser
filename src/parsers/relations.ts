import { ALIAS_SEPARATOR } from '../constants';
import { QueryParams } from '../query-params';
import { QueryParser } from '../query-parser';

interface Relation {
  property: string;
  alias: string;
}

export class RelationsParser<Entity> extends QueryParser<Entity, QueryParams> {
  parser(query: QueryParams = {}): void {
    if (!query.relations?.length) {
      return;
    }

    const relations = this.getRelations(query);

    relations.forEach(({ property, alias }) => {
      this.selectQueryBuilder.leftJoin(property, alias);
    });
  }

  private getRelations(query: QueryParams) {
    const mainAlias = this.getMainAlias();
    const mainAliasWithSeparator = mainAlias + ALIAS_SEPARATOR;

    return query.relations.reduce<Relation[]>((relations, relation) => {
      const joinField = relation.startsWith(mainAliasWithSeparator)
        ? relation.replace(mainAliasWithSeparator, '')
        : relation;

      joinField.split(ALIAS_SEPARATOR).reduce((lastAlias, field) => {
        const property = this.getRelationProperty(lastAlias, field);
        const alias = field;
        const aliasNotInUse = relations.every((value) => value.alias !== alias);

        if (aliasNotInUse) {
          relations.push({ property, alias });
        }

        return alias;
      }, mainAlias);

      return relations;
    }, []);
  }

  private getMainAlias() {
    return this.selectQueryBuilder.alias;
  }

  private getRelationProperty(alias: string, field: string) {
    return `${alias}${ALIAS_SEPARATOR}${field}`;
  }
}
