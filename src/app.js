const express = require('express');
const expressGraphQL = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');
const app = express();
const port = 3000;
const authors = [
  { id: 1, name: 'J. R. R. Tolkien' }
];
const books = [
  { id: 1, name: 'The Fellowship of the Ring', authorId: 1 },
  { id: 2, name: 'The Two Towers', authorId: 1 },
  { id: 3, name: 'The Return of the King', authorId: 1 },
];
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represent an author',
  fields () {
    return {
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      books: {
        type: GraphQLList(BookType),
        resolve(author) {
          return books.filter((book) => book.authorId === author.id);
        }
      }
    };
  }
});
const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields() {
    return {
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      authorId: { type: GraphQLNonNull(GraphQLInt) },
      author: {
        type: AuthorType,
        resolve(book) {
          return authors.find((author) => author.id === book.authorId);
        }
      }
    };
  }
});
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields() {
    return {
      book: {
        type: BookType,
        description: 'A Single Book',
        args: {
          id: { type: GraphQLInt }
        },
        resolve(parent, args) {
          return books.find((book) => book.id === args.id);
        }
      },
      books: {
        type: GraphQLList(BookType),
        description: 'List of All Books',
        resolve() {
          return books;
        }
      },
      author: {
        type: AuthorType,
        description: 'Single Author',
        args: {
          id: { type: GraphQLInt }
        },
        resolve(parent, args) {
          return authors.find((author) => author.id === args.id);
        }
      },
      authors: {
        type: GraphQLList(AuthorType),
        description: 'List of All Authors',
        resolve() {
          return authors;
        }
      }
    };
  }
});
const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields() {
    return {
      addBook: {
        type: BookType,
        description: 'Add a book',
        args: {
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
          authorId: {
            type: GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(parent, args) {
          const book = { id: books.length + 1, name: args.name, authorId: args.authorId };
          books.push(book);
          return book;
        }
      },
      addAuthor: {
        type: AuthorType,
        description: 'Add an author',
        args: {
          name: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve(parent, args) {
          const author = { id: authors.length + 1, name: args.name };
          authors.push(author);
          return author;
        }
      }
    };
  }
});
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

app.get('/', (req, res) => res.send('ok'));
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(port, () => console.log(`GraphQl API listening on port ${port}!`));
