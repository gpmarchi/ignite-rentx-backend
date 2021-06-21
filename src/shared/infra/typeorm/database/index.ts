import { createConnection } from 'typeorm';

createConnection();

// interface IOptions {
//   host: string;
// }

// getConnectionOptions().then(options => {
//   const newOptions = options as IOptions;
//   newOptions.host = 'rentx-database';
//   createConnection({
//     ...options,
//   });
// });
