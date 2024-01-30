import { feathers } from '@feathersjs/feathers'
import { koa, rest, bodyParser, errorHandler, serveStatic,cors } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import type { Params, Id, NullableId } from '@feathersjs/feathers'
require('dotenv').config();

const knex = require('knex')({
    client: 'mysql',
    connection: process.env.DATABASE_URL
  });



class UserService {
  async find() {
    let buku = await knex('Users');
    return buku;
  }
}

interface Mahasiswa {
  id?: number
  alamat: string
  nama:string
  usia:number
  foto:string
}


class MahasiswaService {
  mahasiswa: Mahasiswa[] = []
  async find() {
    let data = await knex('mahasiswa');
    return data
  }
  async create(data: Mahasiswa) {
     console.log(data)
    const newMahasiswa = await knex('mahasiswa').insert(data);
    return{ 
      status:"success",
      data:newMahasiswa};
  }
  async remove(id: NullableId, params: Params) {
    console.log(id,params.query)
     await knex('mahasiswa').where('id', id).del()
      return {
        status:"succss delete"
      }
    }
}


type ServiceTypes = {
  mahasiswa: MahasiswaService;
  users: UserService; 
};


const app = koa<ServiceTypes>(feathers())

app.use(cors({
  origin: '*', // Izinkan akses dari semua domain
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // Izinkan metode permintaan yang diizinkan
  allowHeaders: ['Content-Type', 'Authorization'], // Izinkan header yang diizinkan
  exposeHeaders: ['Content-Range', 'X-Content-Range'], // Izinkan header yang dapat diakses oleh klien
  credentials: true, // Izinkan pengiriman kredensial seperti cookies atau header otentikasi
}));


app.use(serveStatic('.'))
app.use(errorHandler())
app.use(bodyParser())
app.configure(rest())

  
// Register our messages service
app.use('mahasiswa', new MahasiswaService())
app.use('users', new UserService()); 


app.listen(3030)
  .then(() => console.log('Feathers server listening on localhost:3030'))



// app.service('messages').on('created', (message: Message) => {
//   console.log('New message received:', message);
// });

