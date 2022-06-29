"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTemplateType;

var _hasImport = _interopRequireDefault(require("./hasImport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTemplateTypeByTag(t, path, localName, has) {
  const {
    tag
  } = path.node; // styled(Cmp)``

  if (t.isCallExpression(tag) && t.isIdentifier(tag.callee) && tag.arguments.length === 1 && tag.callee.name === localName && has(localName, ['@linaria/react', '@pancakeswap/mp-styled-2','linaria/react'])) {
    const tagPath = path.get('tag');
    return {
      component: tagPath.get('arguments')[0]
    };
  } // styled.div``


  if (t.isMemberExpression(tag) && t.isIdentifier(tag.object) && t.isIdentifier(tag.property) && tag.object.name === localName && has(localName, ['@linaria/react','@pancakeswap/mp-styled-2', 'linaria/react'])) {
    return {
      component: {
        node: t.stringLiteral(tag.property.name)
      }
    };
  } // css``


  if (has('css', ['@linaria/core', 'linaria']) && t.isIdentifier(tag) && tag.name === 'css') {
    return 'css';
  } // css`` but atomic


  if (has('css', ['@linaria/atomic']) && t.isIdentifier(tag) && tag.name === 'css') {
    return 'atomic-css';
  }

  return null;
}

const cache = new WeakMap();

function getTemplateType({
  types: t
}, path, state, libResolver) {
  var _cache$get;

  if (!cache.has(path)) {
    const localName = state.file.metadata.localName || 'styled';

    const has = (identifier, sources) => (0, _hasImport.default)(t, path.scope, state.file.opts.filename, identifier, sources, libResolver);

    cache.set(path, getTemplateTypeByTag(t, path, localName, has));
  }

  return (_cache$get = cache.get(path)) !== null && _cache$get !== void 0 ? _cache$get : null;
}
//# sourceMappingURL=getTemplateType.js.map
