<template>
  <head>
    <title>About Book</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand"><i class="fa fa-book"></i> The Library</a>
      <div class="d-grid gap-2 d-md-flex" v-if="isAuth">
        <button type="button" @click="home" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          <i class="fa fa-home"></i> Return to Home</button>
        <button type="button" @click="shoppingBasket" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          <i class="fa fa-shopping-basket"></i> Your Basket</button>
        <button type="button" @click="logout">Log out</button>
      </div>
      <div class="d-grid gap-2 d-md-flex" v-if="!isAuth">
        <button type="button" @click="home" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          <i class="fa fa-home"></i> Return to Home</button>
        <button type="button" @click="login">Log in</button>
      </div>
    </div>
  </nav>

  <div class="container">
    <div v-if="this.bookStatus">
      <div class="header-align">
        <h2>{{this.bookTitle}}</h2>
        <h5>by {{this.bookObj.bookAuthor}}</h5>
      </div>
      <p class="quote">
        "{{this.bookObj.bookQuote}}"
      </p>
      <div style="text-align: center">
        <img class="pic-display" :src="require(`../assets/${this.bookObj.bookPic}.jpeg`)" alt="">
        <p class="brief">ISBN: {{this.bookObj.bookISBN}} || ★ {{this.bookObj.bookRate}}/5 on GoodReads</p>
        <p class="descrip">
          {{this.bookObj.bookDescrip}}
        </p>
        <button @click="reserveBook">RENT {{this.bookTitle}}</button>
      </div>
    </div>

    <div class="header-align" v-if="!this.bookStatus">
      <h2>Book doesn't exist in database.</h2>
    </div>
  </div>

</template>

<script>
import { app } from "../main.js";
import AxiosService from "../services/AxiosService.js";

export default {
  inject: ["availableBooks"],
  mounted() {
    this.bookTitle = this.$route.params.bookTitle;
    this.bookStatus = this.checkBookExists(this.bookTitle);
    this.bookObj = this.getBookObjTitle(this.bookTitle);
    this.checkIfReservedBefore();

  },
  data() {
    return {
      isAuth: app.config.globalProperties.$authenticated,
      username: app.config.globalProperties.$displayName,
      bookTitle: "",
      bookStatus: false,
      bookObj: {},
      beenReserved: "",
    }
  },
  methods: {
    checkIfReservedBefore() {
      AxiosService.getLibraryBooks()
          .then((response) => {
            const data = response.data;
            for (const frbId in data) {
              const frbObj = {};
              let currBook = "";
              frbObj.username = data[frbId].username;
              frbObj.bookISBN = data[frbId].bookISBN;
              if (frbObj.username === this.username) {
                currBook = this.getBookObjTitle(this.bookTitle);
                if (frbObj.bookISBN === currBook.bookISBN) {
                  this.beenReserved = true;
                }
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    reserveBook() {
      this.checkIfReservedBefore();
      if (!this.beenReserved) {
        AxiosService.postLibraryBooks({ // pass object to server
          username: app.config.globalProperties.$displayName,
          bookISBN: this.bookObj.bookISBN,
          bookFrom: this.getRentedDate(),
          bookTo: this.getReturnDate(),
        })
          .then((response) => {
            console.log(response.status);
          })
          .catch((error) => {
            console.log(error);
          });
        // delay timing to basket url cos sometimes updating communication between computer and firebase
        // isn't fast enough before the computer renders content its content
        setTimeout( () => this.$router.push({ path: '/basket'}), 140);
      }
      else {
        alert("User already rented this book!");
      }
    },
    getRentedDate() {
      let today = new Date();
      today = this.patchDate(today);
      return today;
    },
    getReturnDate() { // +2 weeks from rented date
      let weeks = 2;
      let due = new Date();

      due.setDate(new Date().getDate() + weeks * 7);
      due = this.patchDate(due);
      return due;
    },
    patchDate(date) {
      let dd = String(date.getDate()).padStart(2, '0');
      let mm = String(date.getMonth() + 1).padStart(2, '0');
      let yyyy = date.getFullYear();

      date = dd + '-' + mm + '-' + yyyy;
      return date;
    },
    getBookObjTitle(search) {
      for (let i = 0; i < this.availableBooks.length; i++) {
        if (this.availableBooks[i].bookTitle === search) {
          return this.availableBooks[i];
        }
      }
    },
    getBookObjIsbn(search) {
      for (let i = 0; i < this.availableBooks.length; i++) {
        if (this.availableBooks[i].bookISBN === search) {
          return this.availableBooks[i];
        }
      }
    },
    checkBookExists(title) { // match book's info with ISBN
      for (let i = 0; i < this.availableBooks.length; i++) {
        if (this.availableBooks[i].bookTitle === title) {
          return true;
        }
      }
    },
    shoppingBasket() {
      this.$router.push("/basket");
    },
    home() {
      this.$router.push("/home");
    },
    login() {
      this.$router.push("/login");
    },
    logout() {
      if (confirm("Are you sure you want to log out?")) {
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
.container {
  padding: 25px 50px;
}

.header-align {
  padding-top: 30px;
  padding-bottom: 20px;
  text-align: center;
}

.pic-display {
  text-align: center;
  padding-top: 6px;
  padding-bottom: 5px;
  max-width:300px;
  max-height:900px;
}

.brief {
  padding-top: 15px;
  text-align: center;
  font-size: 16px;
}

.descrip {
  padding-bottom: 20px;
  text-align: center;
}

.quote {
  font-style: italic;
  font-size: 18px;
  text-align: center;
}

</style>