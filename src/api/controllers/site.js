// src/api/site/controllers/site.js
const { createCoreController } = require('@strapi/strapi').factories;

const populateAttribute = ({ components }) => {
  if (components) {
    const populate = components.reduce((acc, comp) => {
      const [dir, name] = comp.split('.');
      const compSchema = require(`../../../components/${dir}/${name}.json`);
      const compAttrs = Object.entries(compSchema.attributes || {}).filter(([, v]) => v.type === 'component');
      const attrPopulates = compAttrs.reduce((a, [k]) => ({ ...a, [k]: { populate: '*' } }), {});
      return { ...acc, [comp.split('.').pop()]: { populate: '*' }, ...attrPopulates };
    }, {});
    return { populate };
  }
  return { populate: '*' };
};

const getPopulateFromSchema = (schema) =>
  Object.keys(schema.attributes || {}).reduce((acc, key) => {
    const attribute = schema.attributes[key];
    if (!attribute) return acc;
    if (!['dynamiczone', 'component'].includes(attribute.type)) return acc;
    return { ...acc, [key]: populateAttribute(attribute) };
  }, {});

function createPopulatedController(uid, schema) {
  return createCoreController(uid, () => {
    return {
      async find(ctx) {
        ctx.query = { ...ctx.query, populate: getPopulateFromSchema(schema) };
        return await super.find(ctx);
      },
      async findOne(ctx) {
        ctx.query = { ...ctx.query, populate: getPopulateFromSchema(schema) };
        return await super.findOne(ctx);
      },
    };
  });
}

module.exports = createPopulatedController('api::site.site', strapi.contentTypes['api::site.site'].schema);