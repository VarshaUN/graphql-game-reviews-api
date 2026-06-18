import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import db from './_db.js';

const resolvers = {
    Query: {
        games() {
            return db.games;
        },
        reviews() {
            return db.reviews;
        },
        authors() {
            return db.authors;
        },
        review(_, args) {
            return db.reviews.find((review) => review.id === args.id);
        },
        game(_, args) {
            return db.games.find((game) => game.id === args.id);
        },
        author(_, args) {
            return db.authors.find((author) => author.id === args.id);
        }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((review) => review.gameId === parent.id);
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((review) => review.authorId === parent.id);
        }
    },
    Review: {
        author(parent) {
            return db.authors.find((author) => author.id === parent.authorId);
        },
        game(parent) {
            return db.games.find((game) => game.id === parent.gameId);
        }
    },
    Mutation: {
        deleteGame(_, args) {
            db.games = db.games.filter((game) => game.id !== args.id);
            return db.games;
        },
        addGame(_, { input }) { 
    const game = {
        ...input,
        id: String(Math.floor(Math.random() * 10000))
    };
    db.games.push(game);
    return game;
},
        updateGame(_, args) {
            db.games = db.games.map((game) => {
                if (game.id === args.id) {
                    return {
                        ...game,
                        ...args.edits
                    }
                }
                return game;
            });
            return db.games.find((game) => game.id === args.id);
        }
    }
};



const server = new ApolloServer({
    typeDefs,
    resolvers

});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
    