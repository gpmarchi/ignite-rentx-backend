import { Connection, createConnection, getConnectionOptions } from 'typeorm';

async function connection(): Promise<Connection> {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test'
          ? 'ignite-rentx-test'
          : defaultOptions.database,
    }),
  );
}

export default connection();

export { connection as createConnection };

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
