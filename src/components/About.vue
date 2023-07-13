<template>
  <head>
    <title>About Book</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand"><i class="fa fa-book"></i> The Library</a>
      <div class="d-grid gap-2 d-md-flex">
        <button type="button" @click="home" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          <i class="fa fa-home"></i> Return to Home</button>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="header-align">
      <h2>About "The Library"</h2>
      <h5>by Rinradee S.</h5>
    </div>
    <div style="text-align: center">
      <img src="../assets/library.jpeg" alt="">
      <p class="content">
        The Library is a book rental system for library. <br/>
        This web development project serves as an online public reservation system for a library to
        conduct its rental service on their available books.<br/>
        Library rental rules include no renting more than one of the same book per user, and returning 2 weeks from booked date. <br/>
        After renting a book through this website, please pick up the book from the library and status will be updated. <br/>
      </p>
      <h5>
        Key features include <br/>
      </h5>
      <p>
        - User registration page<br/>
        - Login/authentication page<br/>
        - Sorting + searching book display <br/>
        - Book information + reservation page<br/>
        - Display user's rented book(s) <br/>
      </p>
    </div>
  </div>

</template>

<script>
export default {
  methods: {
    home() {
      this.$router.push("/home");
    }
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

.content {
  padding-top: 20px;
  text-align: center;
}

</style>