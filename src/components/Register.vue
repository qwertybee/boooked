<template>
  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <title>Login</title>
  </head>
  <div class="container">
    <div class="row justify-content-md-center h-100">
      <div class="col-sm-12 col-md-6 col-lg-4 my-auto">
        <h2>Create New User</h2>
        <form @submit.prevent="registerNewUser">
          <div class="input-group mb-4 input-group-md">
              <span class="input-group-text" id="username" style="width: 40px">
                <i class="fa fa-user"></i>
              </span>
            <input type="text" class="form-control" name="username" placeholder="Username"
                   aria-label="Username" aria-describedby="username" v-model="username">
          </div>
          <div class="input-group mb-4 input-group-md">
              <span class="input-group-text" id="email" style="width: 40px">
                <i class="fa fa-envelope"></i>
              </span>
            <input type="text" class="form-control" name="email" placeholder="Email address"
                   aria-label="address" aria-describedby="address" v-model="email">
          </div>
          <div class="input-group mb-4 input-group-md">
              <span class="input-group-text" id="password" style="width: 40px">
                <i class="fa fa-key"></i>
              </span>
            <input type="password" class="form-control" name="password" placeholder="Password"
                   aria-label="Password" aria-describedby="password" v-model="password">
          </div>
          <div class="input-group mb-4 input-group-md">
              <span class="input-group-text" id="comfirmpwd" style="width: 40px">
                <i class="fa fa-key"></i>
              </span>
            <input type="password" class="form-control" name="confirmpwd" placeholder="Confirm Password"
                   aria-label="Password" aria-describedby="password" v-model="confirmpwd">
          </div>
          <div class="d-grid gap-2">
            <button class="btn btn-success" type="submit">
              <i class="fa fa-plus"></i>
              Confirm New User
            </button>
            <button class="btn btn-primary" type="button" @click="login">
              <i class="fa fa-sign-in"></i>
              Return to Sign-in
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
</template>

<script>
import AxiosService from "../services/AxiosService";

export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      confirmpwd: "",
    }
  },
  methods: {
    registerNewUser() {
      if (this.password === this.confirmpwd) {
        AxiosService.postRegister({ // send in object
          displayName: this.username,
          email: this.email,
          password: this.password,
          returnSecureToken: true,
          }
        )
        .then((response) => {
          // console.log(response.status); // 200 means OK
          if (response.status === 200) {
            alert("Registration successful, redirecting to login page!");
            this.$router.replace("/login");
          }
        })
        .catch((error) => {
          console.log("Error: signUp");
          console.log(error);
          alert(error.message);
        });
      }
      else {
        alert("Passwords do not match!")
      }
    },
    login() { // go to /login page
      this.$router.push("/login");
    },
    home() {
      this.$router.push("/home")
    },
  }
}
</script>