import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { User } from './db.js';
import { readFile } from 'fs/promises';
import { resolvers } from './resolvers.js';

const PORT = 8000;
const JWT_SECRET = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(
	cors(),
	express.json(),
	expressjwt({
		algorithms: ['HS256'],
		credentialsRequired: false,
		secret: JWT_SECRET,
	})
);

app.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne((user) => user.email === email);
	if (user && user.password === password) {
		const token = jwt.sign({ sub: user.id }, JWT_SECRET);
		res.json({ token });
	} else {
		res.sendStatus(401);
	}
});

const typeDefs = await readFile('./schema.graphql', 'utf8');
// * Use context to pass any additional request needed that is not part of the standard graphql request
// const context = ({ req }) => ({ auth: req.auth });
const context = async ({ req }) => {
	if (req.auth) {
		const user = await User.findById(req.auth.sub);
		return { user };
	}
	return {};
};

// * Initialize apollo server
const apolloServer = new ApolloServer({ typeDefs, resolvers, context });

// * Start apollo server
await apolloServer.start();

// * Plug apollo server into our express application
apolloServer.applyMiddleware({ app, path: '/graphql' }); // pass express app path specify where we want to receive graphql requests

app.listen({ port: PORT }, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Graphql Endpoint: http://localhost:${PORT}/graphql`);
});
