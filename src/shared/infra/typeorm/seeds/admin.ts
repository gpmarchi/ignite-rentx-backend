import { hash } from 'bcrypt';
import { createConnection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import '../index';

async function create() {
  const connection = await createConnection();

  const id = uuid();
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
			VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXX')
		`,
  );

  await connection.close();
}

create().then(() => console.log('Admin user created.'));
