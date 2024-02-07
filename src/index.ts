import { feathers,Application } from '@feathersjs/feathers';
import { koa, rest, bodyParser, errorHandler, serveStatic, cors } from '@feathersjs/koa';
import type { Params, Id, NullableId } from '@feathersjs/feathers';
import Knex from 'knex';
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { authenticate } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local'


require('dotenv').config();

const knex = Knex({
  client: 'mysql',
  connection: process.env.DATABASE_URL,
});

interface Mahasiswa {
  id?: number;
  alamat: string;
  nama: string;
  usia: number;
  foto: string;
}

class MahasiswaService {
  async find() {
    const data = await knex('mahasiswa');
    return data;
  }

  async create(data: Mahasiswa) {
    try {
      const [newMahasiswa] = await knex('mahasiswa').insert(data);
      console.log(newMahasiswa);
      return {
        status: 'success',
        data: newMahasiswa,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'error',
        message: 'Failed to create Mahasiswa',
      };
    }
  }

  async update(id: NullableId, data: Mahasiswa) {
    try {
      const updatedMahasiswa = await knex('mahasiswa').where('id', id).update(data);
      console.log(updatedMahasiswa);
      return {
        status: 'success',
        data: updatedMahasiswa,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'error',
        message: 'Failed to update Mahasiswa',
      };
    }
  }

  async remove(id: NullableId, params: Params) {
    try {
      await knex('mahasiswa').where('id', id).del();
      return {
        status: 'success',
        message: 'Successfully deleted Mahasiswa',
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'error',
        message: 'Failed to delete Mahasiswa',
      };
    }
  }
}

type ServiceTypes = {
  mahasiswa: MahasiswaService;
};

const app = koa<ServiceTypes>(feathers());

app.use(
  cors({
    origin: '*',
  })
);

app.use(serveStatic('.'));
app.use(errorHandler());
app.use(bodyParser());
app.configure(rest());


app.use('mahasiswa', new MahasiswaService());

app.listen(3030).then(() => console.log('Feathers server listening on localhost:3030'));