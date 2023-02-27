// import express
const express = require("express");
const app = express();

// define port
const HTTP_PORT = process.env.PORT || 8080;

// import path library
const path = require("path");

// configure server to receive data sent by a <form> element
app.use(express.urlencoded({ extended: true }));

// handlebars library
const exphbs = require("express-handlebars");
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      json: (context) => {
        return JSON.stringify(context);
      },
    },
  })
);
app.set("view engine", ".hbs");

// books array
const booksLibraryArray = [
  {
    bookTitle: "The Alchemist",
    bookAuthor: "Paulo Coelho",
    available: false,
    checkedByUser: false,
  },
  {
    bookTitle: "Atomic Habbits",
    bookAuthor: "James Clear",
    available: true,
    checkedByUser: false,
  },
  {
    bookTitle: "The Monk who sold his Ferrari",
    bookAuthor: "Robin Sharma",
    available: false,
    checkedByUser: true,
  },
  {
    bookTitle: "Brave New World",
    bookAuthor: "Aldous Huxley",
    available: true,
    checkedByUser: false,
  },
  {
    bookTitle: "Rich Dad Poor Dad",
    bookAuthor: "Robert T Kiyosaki",
    available: false,
    checkedByUser: false,
  },
  {
    bookTitle: "The Mountain is You",
    bookAuthor: "Brianna Wiest",
    available: true,
    checkedByUser: false,
  },
  {
    bookTitle: "Can’t Hurt Me: Master Your Mind and Defy the Odds",
    bookAuthor: "David Goggins",
    available: true,
    checkedByUser: false,
  },
  {
    bookTitle: "Gunfire!",
    bookAuthor: "Stig H. Moberg",
    available: false,
    checkedByUser: true,
  },
];
let booksLibraryArrayFiltered = booksLibraryArray;

//--endpoints------

app.get("/", (req, res) => {
  res.render("home", { layout: "skeleton" });
});

app.get("/books", (req, res) => {
    booksLibraryArrayFiltered = booksLibraryArray;
  res.render("books", {
    layout: "skeleton",
    booksLibrary: booksLibraryArrayFiltered,
  });
});

app.post("/books", (req, res) => {
    console.log("========================")
  console.log(req.body);
//   console.log(req.body.filterbooks + typeof req.body.filterbooks);

if(req.body.hasOwnProperty('filterbooks')){
  if (req.body.filterbooks == "available") {
    booksLibraryArrayFiltered = [];
    for (x of booksLibraryArray) {
      if (x.available === true) {
        booksLibraryArrayFiltered.push(x);
      }
    }
  } else if (req.body.filterbooks == "mybooks") {
    booksLibraryArrayFiltered = [];
    for (x of booksLibraryArray) {
      if (x.checkedByUser === true) {
        booksLibraryArrayFiltered.push(x);
      }
    }
  } else {
    booksLibraryArrayFiltered = booksLibraryArray;
  }
}
else if (req.body.hasOwnProperty('searchtext')){
    const searchTextValue = req.body.searchtext;
    if(searchTextValue === ""){
        booksLibraryArrayFiltered = booksLibraryArray;
        res.redirect('/error');
        return;
    }else{
    booksLibraryArrayFiltered = [];
    for(x of booksLibraryArray){
        if(x.bookTitle.toLowerCase().includes(searchTextValue) || x.bookAuthor.toLowerCase().includes(searchTextValue)){
            booksLibraryArrayFiltered.push(x);
        }
    }
    }
}
else if(req.body.hasOwnProperty('borrow')){
        console.log(req.body.borrow);
        for(x of booksLibraryArrayFiltered){
            if(x.bookTitle === req.body.borrow){
                x.available = false;
                x.checkedByUser = true;
            }
        }
}

if(booksLibraryArrayFiltered.length === 0){
    errorMessage = "No valid search result found!"
    res.redirect("/error?errorMessage="+errorMessage);
    return;
}
  res.render("books", {
    layout: "skeleton",
    booksLibrary: booksLibraryArrayFiltered
});
});

app.get("/error", (req, res) => {
  res.render("error", { layout: "skeleton" });
});

//--start-server-------

const onHttpStart = () => {
  console.log(`Web server started on  ${HTTP_PORT}, press CTRL + C to exit`);
};

app.listen(HTTP_PORT, onHttpStart);
