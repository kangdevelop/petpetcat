'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  static boot() {
    super.boot();

    this.addHook("beforeCreate", "UuidHook.uuidv4");

    this.addTrait("@provider:Lucid/Slugify", {
      fields: { category_slug: "category_name" },
      strategy: async (fields, value, modelInstance) => {
        return `${value}-${modelInstance.id.slice(-5)}`;
      },
    });
  }

  static get incrementing() {
    return false;
  }

  services () {
    return this.belongsToMany('App/Models/Service','')
  }

}

module.exports = Category
