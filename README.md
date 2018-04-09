# simple-crypto-app
# Project Title

Simple Crypto App.

## Getting Started

Please follow next steps to successfully run the project.

### Prerequisites

You will need PostgreSQL installed on your PC.
Then create new database with the name "cryptodb" and add table using "./simple-crypto-api/server-side/cryptoDB.sql".

To add table from .sql file:
```
psql -f cryptoDB.sql
```
Or just copy paste query from the "./simple-crypto-api/server-side/cryptoDB.sql" file to the PostgreSQL shell.
To open PostgreSQL shell of the previously created DB  "cryptodb" run :

```
psql cryptodb
```


### Installing

To run current project you need to proceed through the next steps:

The first step is to open terminal window and navigate to "./simple-crypto-api/server-side" and run server.
```
npm install
npm start
```

Then open one more terminal window and navigate to "./simple-crypto-api/client-side" and run React App.

```
npm install
npm start
```

Now you can access app by the url "localhost:3000".

## Authors

* **Raman Shapaval** - *Initial work* - [BreakINbaDs](https://github.com/BreakINbaDs)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
