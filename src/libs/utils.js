
const safeEval = require('safe-eval')

const isUndefined = o => typeof o === 'undefined'

const nvl = (o, valueIfUndefined) => isUndefined(o) ? valueIfUndefined : o

// gets a deep value from an object, given a 'path'.
const getDeepValue = (obj, path) =>
  path
    .replace(/\[|\]\.?/g, '.')
    .split('.')
    .filter(s => s)
    .reduce((acc, val) => acc && acc[val], obj)

// given a string, resolves all template variables.
const resolveTemplate = function(str, variables) {
  return str.replace(/\$\{([^\}]+)\}/g, (m, g1) => safeEval(g1, variables))
}

const resolveTemplateObjectValues = (object, context) => {
  Object.keys(object).forEach(k => {
    const v = object[k]
    if (typeof v === 'string') {
      object[k] = resolveTemplate(v, context)
    }
  })
}

const verifyHasAllKeys = (obj, keys, errorMessage) => {
  if (keys.some(k => typeof obj[k] === 'undefined')){
    throw new Error(`${errorMessage} - wanted='${JSON.stringify(keys)}' found='${JSON.stringify(Object.keys(obj))}'`)
  }
}

module.exports = { 
  isUndefined, 
  nvl, 
  getDeepValue, 
  resolveTemplate, 
  resolveTemplateObjectValues, 
  verifyHasAllKeys 
} 
