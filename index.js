#!/usr/bin/env node

const color = require('colors/safe')
const utils = require('./src/libs/utils')

const stepDefMapByType = {}

const pd = require('./src/processDefs/Hello File')
const pd2 = require('./src/processDefs/Print files')

Object.assign(stepDefMapByType, require('./src/stepDefs/File'))


const newProcessInstance = async (processDef, inMap) => {
    const pd = processDef
    const pi = Object.assign({}, pd)

    // lookup step impls.... (todo check mappings)
    pi.steps.forEach(s => {
        const stepDef = stepDefMapByType[s.type]
        if (utils.isUndefined(stepDef)) {
            throw new Error(`Cannot find stepDef for type "${s.type}". available=${JSON.stringify(Object.keys(stepDefMapByType))}`)
        }
        if (typeof stepDef.impl !== 'function') {
            throw new Error(`StepDef did not have an 'impl' function. type="${s.type}".`)
        }
        s.def = stepDef
        s.impl = stepDef.impl
    })

    // setup variables (check inMap has all required variables)...
    const piVars = {}
    utils.verifyHasAllKeys(inMap, pd.ins, `Process '${pd.label}' was missing required inputs.`)
    piVars.Start = Object.assign({}, inMap)

    // run through steps synchronously...
    console.log(color.cyan(`Process: ${pi.label}`))
    for (let i = 0; i < pi.steps.length; i++) {
        const s = pi.steps[i]
        const stepVars = Object.assign({}, s.inMap)
        utils.resolveTemplateObjectValues(stepVars, Object.assign({}, piVars, pi.globals))

        // resolve variables...
        for (var x = 0; x < s.def.ins.length; x++) {
            if (typeof stepVars[s.def.ins[x]] === 'undefined') {
                throw new Error(`Input variable was missing. wanted=${JSON.stringify(s.def.ins[x])} found=${JSON.stringify(Object.keys(stepVars))} step='${s.label}' type='${s.type}'`)
            }
        }
        console.log(color.yellow(`inMap: ${JSON.stringify(stepVars, null, 2)}`))
        console.log(color.cyan(`Step: ${s.label}`) + color.grey(` - context=${JSON.stringify(piVars)}`))
        await s.impl(stepVars).then(outMap => piVars[s.label] = outMap)
    }
    console.log(color.yellow(`OutMap: ${JSON.stringify(piVars, null, 2)}`))
}

// newProcessInstance(pd, { file: 'Foobar.txt' })
// newProcessInstance(pd, {})
newProcessInstance(pd2, {})
