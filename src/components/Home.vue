<template>
  <head>
    <title>Book Reservations</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand"><i class="fa fa-book"></i> The Library</a>
      <div class="d-grid gap-2 d-md-flex" v-if="isAuth">
        <button type="button" @click="about"><i class="fa fa-info-circle"></i> About</button>
        <button type="button" @click="shoppingBasket" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            <i class="fa fa-shopping-basket"></i> Your Basket</button>
          <button type="button" @click="logout">Log out</button>
      </div>
      <div class="d-grid gap-2 d-md-flex" v-if="!isAuth">
        <button type="button" @click="about"><i class="fa fa-info-circle"></i> About</button>
        <button type="button" @click="login">Log in</button>
      </div>
    </div>
  </nav>
  <div>
    <div class="carousel-inner">
      <img src="../assets/Landscape-Color.jpeg" class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h3>Welcome {{ this.username }}!</h3>
        <p style="font-size: 19px">An adventure awaits you in The Library!</p>
      </div>
    </div>
  </div>

  <nav class="navbar navbar-light">
    <div class="container-fluid">
      <div class="d-grid gap-2 d-md-flex">
        <a class="navbar-brand">Sort by</a>
        <button type="button" class="btn btn-light" @click="sortByTitle">Title</button>
        <button type="button" class="btn btn-light" @click="sortByAuthor">Author</button>
        <button type="button" class="btn btn-light" @click="sortByPublishNewest">Newest</button>
        <button type="button" class="btn btn-light" @click="sortByPublishOldest">Oldest</button>
        <button type="button" class="btn btn-light" @click="sortByISBN">ISBN</button>
      </div>
        <div class="d-flex">
          <input class="form-control me-2" style="width: 310px" placeholder="Search title / author / ISBN / keyword" v-model="searchBook">
        </div>
      </div>
  </nav>

  <div class="picture-grid">
    <div class="grid-box" v-for="book in searchedInput" :key="book.bookISBN">
      <div class="d-grid gap-1">
        <img :src="require(`../assets/${book.bookPic}.jpeg`)" alt="">
          <button class="button-size" @click="reserveBook(book.bookTitle)">{{book.bookTitle}}</button>
      </div>
    </div>
  </div>

</template>

<script>
import { app } from "../main.js";

export default {
  inject: ["availableBooks"],
  data() {
    return {
      isAuth: app.config.globalProperties.$authenticated,
      username: app.config.globalProperties.$displayName,
      searchBook: "",
      sortedBooks: this.availableBooks,
    }
  },
  mounted() {
    this.sortByTitle();
  },
  computed: {
    searchedInput() {
      let search = new RegExp(this.searchBook, 'i');
      return this.sortedBooks.filter(a => (a.bookTitle.match(search) || a.bookAuthor.match(search) || a.bookISBN.match(search)));
    },
  },
  methods: {
    sortByTitle() {
      return this.sortedBooks.sort((a,b) => a['bookTitle'] < b['bookTitle'] ? -1 : 1);
    },
    sortByAuthor() { // sort author's last name
      return this.sortedBooks.sort((a,b) => a['bookAuthor'].split(" ").pop() < b['bookAuthor'].split(" ").pop() ? -1 : 1);
    },
    sortByISBN() {
      return this.sortedBooks.sort((a,b) => a['bookISBN'] < b['bookISBN'] ? -1 : 1);
    },
    sortByPublishOldest() {
      this.sortedBooks.sort( (a,b) => {
        const aa = a['bookPublish'].split('-').reverse().join(),
            bb = b['bookPublish'].split('-').reverse().join();
        return aa < bb ? -1 : (aa > bb ? 1 : 0);
          }
      )
    },
    sortByPublishNewest() {
      this.sortedBooks.sort( (a,b) => {
            const aa = a['bookPublish'].split('-').reverse().join(),
                bb = b['bookPublish'].split('-').reverse().join();
            return bb < aa ? -1 : (bb > aa ? 1 : 0);
          }
      )
    },
    reserveBook(title) { // take param ISBN
      this.$router.push("/" + title);
    },
    shoppingBasket() {
      this.$router.push("/basket");
    },
    about() {
      this.$router.push("/about");
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
.picture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  justify-items: center;
  grid-gap: 10px;
  grid-row-gap: 10px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.grid-box img {
  display: flex;
  max-width:180px;
  max-height:550px;
}

.button-size {
  width: 181px
}

</style>