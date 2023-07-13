<template>
  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <title>Login</title>
  </head>
  <div class="container">
      <div class="row justify-content-md-center h-100">
        <div class="col-sm-12 col-md-6 col-lg-4">
          <div class="vertical-mid">
            <h2>Library Login</h2>
            <form @submit.prevent="login">
              <div class="input-group mb-4 input-group-md">
                <span class="input-group-text" id="email" style="width: 40px">
                  <i class="fa fa-envelope"></i>
                </span>
                <input type="text" class="form-control" name="email" placeholder="Email"
                       aria-label="Email" aria-describedby="email" v-model="email">
              </div>
              <div class="input-group mb-4 input-group-md">
                <span class="input-group-text" id="password" style="width: 40px">
                  <i class="fa fa-key"></i>
                </span>
                <input type="password" class="form-control" name="password" placeholder="Password"
                       aria-label="Password" aria-describedby="password" v-model="password">
              </div>
              <div class="d-grid gap-2">
                <button class="btn btn-primary" type="submit">
                  <i class="fa fa-sign-in"></i>
                  Sign-in
                </button>
                <button class="btn btn-success" type="button" @click="register">
                  <i class="fa fa-address-book-o"></i>
                  Register
                </button>
                <button class="btn btn-warning" type="button" @click="home">
                  <i class="fa fa-home"></i>
                  Return to Home
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { app } from "../main.js";

  export default {
    data() {
      return {
        email: "",
        password: "",
      }
    },
    methods: {
      login() { // confirm email and password
        fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBuJkaa2VYAsff1obRSEwznNJGNO4JOIfg",
            {
              method: "POST",
              body: JSON.stringify({
                email: this.email,
                password: this.password,
                returnSecureToken: true,
              }),
            }
        ).then((response) =>
        response.json()
        )
        .then((data) => {
          // console.log(data);
          if (data.error != null) {
            console.log("Error: signIn");
            console.log(data.error);
            alert(data.error.message);
          }
          else { // if login successful
            // we get things from Firebase ... (username, token, expireSession, etc)
            // if user is authenticated we will record the following info
            // into global properties. that's how we can access these props
            // we need to append idToken to URL to inform Firebase that
            // 'this is me' ... 'let me access whatever requires auth'
            // recall: in the 'rules' we may have this
            //      '.write' = 'auth != null'
            // .read can be set to auth != null since cart is to only specific user to view
            app.config.globalProperties.$displayName = data.displayName;
            app.config.globalProperties.$idToken = data.idToken;
            app.config.globalProperties.$expiresIn = data.expiresIn;
            app.config.globalProperties.$authenticated = true;
            console.log("Username is " + app.config.globalProperties.$displayName);
            this.$router.push("/home");
          }
        })
        .catch((error) => console.log(error));
      },
      register() { // go to /register page
        this.$router.push("/register");
      },
      home() {
        this.$router.push("/home")
      },
    }
  }
</script>
