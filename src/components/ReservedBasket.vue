<template>
  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <title>Reserved Cart</title>
  </head>

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand"><i class="fa fa-book"></i> The Library</a>
      <div class="d-grid gap-2 d-md-flex" >
        <button type="button" @click="home" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          <i class="fa fa-home"></i> Return to Home</button>
        <button type="button" @click="logout">Log out</button>
      </div>
    </div>
  </nav>

  <body>
    <div class="container mt-5" style="padding-top: 28px">
      <div class="in-between" >
        <h3 style="float:left" class="my-4">Welcome, {{this.username}}</h3>
        <button style="float:right" @click="removeAllBooks" v-if="myBasket.length > 0">Empty Basket</button>
      </div>
      <table class="table table-striped table-bordered">
        <thead>
        <tr>
          <th class="py-3">#</th>
          <th class="py-3">Cover</th>
          <th class="py-3">Title</th>
          <th class="py-3">Author</th>
          <th class="py-3">ISBN</th>
          <th class="py-3">Rented</th>
          <th class="py-3">Return</th>
          <th class="py-3">Status</th>
          <th class="py-3">Remove</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="book in myBasket" :key="book.bookISBN">
          <td class="py-3" v-if="myBasket.indexOf(book) >= 0">{{ this.myBasket.indexOf(book)+1 }}</td>
          <td class="py-3">
            <img id="cover-display" :src="require(`../assets/${book.bookPic}.jpeg`)" alt="">
          </td>
          <td class="py-3">{{book.bookTitle}}</td>
          <td class="py-3">{{book.bookAuthor}}</td>
          <td class="py-3">{{book.bookISBN}}</td>
          <td class="py-3">{{book.bookFrom}}</td>
          <td class="py-3">{{book.bookTo}}</td>
          <td class="py-3">Pick up from library</td>
          <td class="align-middle">
            <button class="btn btn-danger btn-sm" type="button" @click="removeBook(this.myBasket.indexOf(book))">
              <i class="fa fa-trash"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </body>
</template>

<script>
import {app} from "@/main";
import AxiosService from "../services/AxiosService";

  export default {
    inject: ["availableBooks"],
    mounted() {
      this.getMyBasket();
    },
    data() {
      return {
        username: app.config.globalProperties.$displayName,
        myBasket: [],
        myFrbIds: [],
      }
    },
    methods: {
      getMyBasket() {
        AxiosService.getLibraryBooks()
        .then((response) => {
          const data = response.data;
          const bookArr = [];
          for (const frbId in data) { // filter data
            const book = {};
            book.frbId = frbId;
            book.username = data[frbId].username;
            book.bookISBN = data[frbId].bookISBN;
            book.bookFrom = data[frbId].bookFrom;
            book.bookTo = data[frbId].bookTo;
            if (book.username === this.username) { // only take the current user's items
              bookArr.push(book);
            }
          }
          this.getBooks(bookArr);
        })
        .catch((error) => {
          console.log(error);
        })
      },
      getBooks(bookArr) { // match book's info with ISBN
        const yourBooks = [];
        const yourFrbIds = [];
        let count = 0;
        for (let i = 0; i < bookArr.length; i++) {
          for (let j = 0; j < this.availableBooks.length; j++) {
            if (this.availableBooks[j].bookISBN === bookArr[i].bookISBN) {
              yourFrbIds[count] = bookArr[i].frbId;
              yourBooks[count] = this.availableBooks[j];
              yourBooks[count].bookFrom = bookArr[i].bookFrom;
              yourBooks[count].bookTo = bookArr[i].bookTo;
              count++;
            }
          }
        }
        this.myBasket = yourBooks;
        this.myFrbIds = yourFrbIds;
      },
      getFrbId(locIndex) { // get firebase id of what you wanna erase from database
        return this.myFrbIds[locIndex];
      },
      removeBook(locIndex) { // remove from firebase's basket using unique firebaseID
        if (locIndex >=0) {
          const frbid = this.getFrbId(locIndex);
          AxiosService.deleteLibraryBooks(frbid)
          .then((response) => response.json)
          .catch((error) => console.log(error));
          this.myBasket.splice(locIndex, 1);
          this.myFrbIds.splice(locIndex, 1);
        }
      },
      removeAllBooks() {
        if (confirm("Confirm delete all book(s) in basket?")) {
          for (let i = 0; i < this.myFrbIds.length; i++) {
            AxiosService.deleteLibraryBooks(this.myFrbIds[i])
                .then((response) => response)
                .catch((error) => console.log(error));
          }
          this.home();
        }
      },
      home() {
        this.$router.push("/home");
      },
      logout() {
        if (confirm("Log out confirm?")) {
          app.config.globalProperties.$displayName = "";
          app.config.globalProperties.$idToken = "";
          app.config.globalProperties.$expiresIn = "";
          app.config.globalProperties.$authenticated = false;
          this.isAuth = false;
          this.$router.replace("/");
        }
      },
    }
  }
</script>

<style>
  #cover-display {
    max-width: 100px;
    max-height: 140px;
  }
  td {
    text-align: center;
  }
</style>