"use strict"

class SetCloudlogSubscribers {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options
    this.fnName = this.serverless.service.custom.cloudlogFn

    this.provider = this.serverless.getProvider("aws")

    this.hooks = {
      "initialize": this.setCloudlogEvents.bind(this),
    }
  }

  setCloudlogEvents() {
    const functions = Object.keys(this.serverless.service.functions)
    const logFnName = functions.filter(f => f === this.fnName)
    if (logFnName.length) {
      const logFn = this.serverless.service.functions[logFnName]
      const logTheseFunctionNames = functions.filter(f => f !== this.fnName)
      const logTheseFunctions = logTheseFunctionNames.map(name => this.serverless.service.functions[name])
      logTheseFunctions.forEach(fn => {
        logFn.events.push({
          cloudwatchLog: `/aws/lambda/${fn.name}`
        })
      })
      console.log(`added log subscribers to ${logTheseFunctions.length} functions`)
    }
  }
}
module.exports = SetCloudlogSubscribers
