import { initAppAsync } from './init.mjs';
import { jenkinsJobBuildAsync } from './jenkins.mjs';
import { browserClose } from './pupperteer.mjs';

(async () => {
  try {
    const params = await initAppAsync();
  
    await jenkinsJobBuildAsync(params);
    browserClose();

    delete params.password;
    console.log(params);
    process.exit(0);
  } catch (err) {
    browserClose();
    console.error(err.message);
    process.exit(1);
  }
})();