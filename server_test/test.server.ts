import { SpecReporter, DisplayProcessor } from 'jasmine-spec-reporter';
const Jasmine = require('jasmine');
import SuiteInfo = jasmine.SuiteInfo;

import { config } from './test.server.conf';


class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
        return `TypeScript ${log}`;
    }
}

const runner = new Jasmine();
runner.loadConfig(config);
runner.addReporter(new SpecReporter({
    customProcessors: [CustomProcessor],
}));
runner.onComplete(function(passed){
  if ( passed ) {
    console.log('Success');
  } else {
    console.error('Failed');
  }
});

runner.execute();
