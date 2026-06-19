# GraphQL Game Reviews API

Small GraphQL API I built while learning GraphQL + Apollo Server. It's a games/reviews/authors setup — basically a mini version of something like Metacritic, just enough to actually feel schema design, resolvers, and nested relationships instead of just reading about them.

No database, no auth, no frontend. In-memory data on purpose, so the focus stays on the GraphQL side of things.

## Why I built this

I'd read about GraphQL before but never written one from scratch. Reading docs only gets you so far — you don't actually understand resolver chaining until you hit a query that returns `null` for no obvious reason and have to go figure out why. (Spoiler: I did hit exactly that, see below.)

My Blog to Follow along : https://varshaun.hashnode.dev/my-first-graphql-api-building-a-game-reviews-backend-from-scratch-and-the-stupid-bug-that-cost-me-an-hour

## Stack

- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) (standalone, v4)
- Plain JS
- Node's built-in ES modules

## Running it

```bash
npm install
npm run dev
```

Server comes up at `http://localhost:4000`. Apollo gives you a sandbox UI at that URL, open it in the browser and you can run queries straight away — no Postman/curl needed.

## What's in the schema

Three types: `Game`, `Author`, `Review`. A review belongs to one game and one author, and games/authors each have a list of their reviews. Nothing exotic, just enough relationships to make the resolver logic interesting.

```graphql
type Game {
  id: ID!
  title: String!
  platform: [String!]!
  reviews: [Review!]
}

type Review {
  id: ID!
  rating: Int!
  content: String!
  game: Game!
  author: Author!
}

type Author {
  id: ID!
  name: String!
  verified: Boolean!
  reviews: [Review!]
}
```

Full schema is in `schema.js`, queries/mutations and all.

### Try it

Get a game and its reviews in one go (this is the whole point of GraphQL one request, exactly the shape you asked for):

```graphql
query {
  game(id: "3") {
    title
    platform
    reviews {
      rating
      content
    }
  }
}
```

Add a game:

```graphql
mutation {
  addGame(input: { title: "Elden Ring", platform: ["PS5", "PC"] }) {
    id
    title
  }
}
```

## The bug that ate an hour of my life

Worth writing down because I'll definitely make this mistake again otherwise.

I had a `game(id: "3")` query just... returning `null`. No error, nothing in the console, schema looked fine, resolver looked fine. Spent way longer than I'd like to admit staring at the resolver before I checked the actual data.

```js
// _db.js
let games = [
  { id: 1, title: "The Last of Us", ... } // id is a number
]

// resolver
game(_, args) {
  return db.games.find((game) => game.id === args.id)
}
```

`args.id` coming in from a GraphQL `ID!` argument is always a **string**, even if you pass `id: "3"` or even if a number-looking value came through some other client. My seed data had `id: 1` as a number. `1 === "3"` and also `1 === "1"` are both `false` in JS, so `.find()` was always coming back empty, and Apollo just serializes a resolver returning `undefined` as `null` — no error thrown, which is exactly what made it hard to spot.

Fixed it by just making every id in `_db.js` a string from the start (`id: "1"` etc.) so it lines up with `ID!` in the schema, instead of sprinkling `String()` coercion through every resolver. Same bug existed in `updateGame`/`deleteGame` too — anywhere comparing a stored id against something that came through GraphQL args.

Small bug, but it's the kind of thing that's obvious in hindsight and invisible while you're in it. `ID!` in GraphQL is always serialized as a string on the wire, regardless of what type you used in your JS — good thing to just know going in rather than learn the hard way.

## What I'd add if this were a real project

- Real database instead of the in-memory arrays (this resets every time the server restarts, which is fine for learning, not fine for anything else)
- Auth on the mutations — right now anyone can delete any game
- Pagination on the list queries
- Input validation (rating should probably be 1-5, not just "any Int")

Didn't add these because they're not really about GraphQL itself, and I wanted this repo to stay focused on the thing I was actually trying to learn.

## Notes to self

- `startStandaloneServer` is fine for learning/small projects, real apps usually wire Apollo into Express directly for middleware/auth control
- Resolvers for relational fields (`Game.reviews`, `Review.author`, etc.) only run when that field is actually requested in the query — this is the "lazy" part of GraphQL that makes it efficient, you're not always joining everything
- The `parent` arg in a field resolver is the object returned by the parent resolver, not the whole query — took me a minute to get this since it's not obvious from the name alone
