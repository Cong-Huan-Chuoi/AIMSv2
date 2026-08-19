import app from './app.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from './graphql/typeDefs/index.js';
import { resolvers } from './graphql/resolvers/index.js';


//import type
import type { Request, Response} from 'express';

const PORT = process.env.PORT||3000;

async function startServer(){
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req, res}: {req: Request; res: Response}) => {
                const token = req.headers.authorization || '';
                return {token};
            },
        })
    );
    app.listen(PORT,() =>{
        console.log('Hybrid Ser is running at http://localhost:${PORT}');
        console.log('GraphQL Endpoint: http://localhost:${PORT}/graphql');
    });
}

startServer().catch((error) =>{
    console.error("Lỗi khi khởi động server:", error);
});