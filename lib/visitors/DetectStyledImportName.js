'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = DetectStyledImportName

/* eslint-disable no-param-reassign */

/**
 * This Visitor checks if import of `@linaria/react` was renamed and stores that information in state
 */
function DetectStyledImportName({ types: t }, path, state) {
  if (
    !t.isLiteral(path.node.source, {
      value: '@pancakeswap/mp-styled-2',
    })
  ) {
    return
  }

  path.node.specifiers.forEach((specifier) => {
    if (!t.isImportSpecifier(specifier)) {
      return
    }

    const importedName = t.isStringLiteral(specifier.imported) ? specifier.imported.value : specifier.imported.name

    if (specifier.local.name !== importedName) {
      state.file.metadata.localName = specifier.local.name
    }
  })
}
//# sourceMappingURL=DetectStyledImportName.js.map
