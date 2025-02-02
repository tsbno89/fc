import { EvalOption } from '../interface/component/fc-eval';
import { HttpTypeOption, PayloadOption } from '../interface/component/fc-common';


export default class FcEval {
  private readonly httpTypeOpts?: HttpTypeOption;
  private readonly evalOpts?: EvalOption;
  private readonly payloadOpts?: PayloadOption;
  private readonly region: string;
  private readonly access: string;

  constructor(access: string, region: string, evalOpts?: EvalOption, httpTypeOpts?: HttpTypeOption, payloadOpts?: PayloadOption) {
    this.access = access;
    this.region = region;
    this.evalOpts = evalOpts;
    this.payloadOpts = payloadOpts;
    this.httpTypeOpts = httpTypeOpts;
  }

  makeStartArgs(): string {
    let args = `--region ${this.region} --access ${this.access} --function-type ${this.evalOpts?.functionType} --eval-type ${this.evalOpts?.evalType}`;
    if (this.evalOpts.evalType === 'memory') {
      if (this.evalOpts?.memorySizeList) {
        args += ` --memory-size ${this.evalOpts?.memorySizeList}`;
      }
      if (this.evalOpts?.runCount) {
        args += ` --run-count ${this.evalOpts?.runCount}`;
      }
    } else {
      if (this.evalOpts?.concurrencyArgs) {
        args += ` --concurrency-args ${this.evalOpts?.concurrencyArgs}`;
      }
      if (this.evalOpts?.memory) {
        args += ` --memory ${this.evalOpts?.memory}`;
      }
      if (this.evalOpts?.rt) {
        args += ` --rt ${this.evalOpts?.rt}`;
      }
    }

    if (this.evalOpts?.qualifier) {
      args += ` --qualifier ${this.evalOpts?.qualifier}`;
    }

    args += ` --service-name ${this.evalOpts?.serviceName} --function-name ${this.evalOpts?.functionName}`;
    if (this.isHttpFunctionType()) {
      args += ` --method ${this.httpTypeOpts?.method} --path ${this.httpTypeOpts?.path} --query ${this.httpTypeOpts?.query}`;
    }

    if (this.payloadOpts?.payload) {
      args += ` --payload ${JSON.stringify(this.payloadOpts?.payload)}`;
    }
    if (this.payloadOpts?.payloadFile) {
      args += ` --payload-file ${this.payloadOpts?.payloadFile}`;
    }
    return args;
  }

  private isHttpFunctionType() {
    return this.evalOpts?.functionType === 'http';
  }
}
