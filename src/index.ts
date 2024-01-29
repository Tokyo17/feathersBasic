import { feathers } from '@feathersjs/feathers'
import { koa, rest, bodyParser, errorHandler, serveStatic,cors } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
require('dotenv').config();

const knex = require('knex')({
    client: 'mysql',
    connection: process.env.DATABASE_URL
  });


interface User {
  id?: number;
  name: string;
}


class UserService {
  users: User[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane' },
  ];

  async find() {
    let buku = await knex('Users');

    app.service('messages').create({
      text: 'Success get users',
      name:""
    })
    return buku;
  }
}

interface Message {
  id?: number
  text: string
  name:string
}


class MessageService {
  messages: Message[] = []

  async find() {
  
    return this.messages
  }

  async create(data: Pick<Message, 'text' | 'name'>) {
    console.log(data,this.messages)
    const message: Message = {
      id: this.messages.length,
      text: data.text,
      name:data.name
    }


    this.messages.push(message)

    return message
  }
}


type ServiceTypes = {
  messages: MessageService;
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
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  await next();
});


app.use(serveStatic('.'))
app.use(errorHandler())
app.use(bodyParser())
app.configure(rest())

app.configure(
  socketio({
    cors: {
      origin: "*",
      allowedHeaders:"*",
      methods:"*", 
    }
  }))
  
// Register our messages service
app.use('messages', new MessageService())
app.use('users', new UserService()); 

app.on('connection', (connection) =>{ 
app.channel('everybody').join(connection)})
app.publish((_data) => app.channel('everybody'))



app.listen(3030)
  .then(() => console.log('Feathers server listening on localhost:3030'))

app.service('messages').create({
  text: 'Hello world from the server',
  name:""
})

app.service('messages').on('created', (message: Message) => {
  console.log('New message received:', message);
});

