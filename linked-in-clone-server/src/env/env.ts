import * as dotenv from 'dotenv';
export class Environment {
  setConfig(): void {
    dotenv.config({ path: this.getEnvFilePath() });
  }

  getEnvFilePath(): string {
    // relative path w.r.t app.module.ts
    let envFilePath = './src/env/dev.env';
    if (process.env.NODE_ENV === 'dev') {
      envFilePath = './src/env/test.env';
    } else if (process.env.NODE_ENV === 'prod') {
      envFilePath = './src/env/prod.env';
    }

    return envFilePath;
  }
}
