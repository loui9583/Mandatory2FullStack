<script>
  import { Router, Route, Link } from "svelte-navigator";
  import Login from "./Login.svelte";
  import SignUp from "./SignUp.svelte";
  import PrivateRoute from "./PrivateRoute.svelte";
  import { user } from "./stores";
  import { onMount } from "svelte";
  import ResetPassword from "./ResetPassword.svelte";
  import ForgotPasswordForm from "./ForgotPasswordForm.svelte";
  import { api } from "./stores.js";

  // Set your API link here
  $api = "http://localhost:3000";
  onMount(() => {
    localStorage.removeItem("token");
  });

  function handleLogout() {
    $user = null;
    localStorage.removeItem("token");
    window.location.href = "/profile";
  }
</script>

<Router primary={false}>
  <header>
    <h1>Note App</h1>
  </header>

  <main>
    <Route path="login">
      <nav>
        <Link to="/login">Sign in</Link>
        <Link to="/signup">Sign Up</Link>

        <Login />
        <Link to="/forgotpasswordform">Forgot password?</Link>
      </nav>
    </Route>

    <Route path="signup">
      <nav>
        <Link to="/login">Sign in</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <SignUp></SignUp>
    </Route>

    <Route path="/">
      <nav>
        <Link to="/login">Sign in</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
    </Route>

    <Route path="/resetpassword">
      <nav>
        <Link to="/login">Sign in</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <ResetPassword></ResetPassword>
    </Route>

    <Route path="/forgotpasswordform">
      <nav>
        <Link to="/login">Sign in</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <ForgotPasswordForm></ForgotPasswordForm>
    </Route>

    <PrivateRoute path="profile" let:location>
      <h3>Welcome {$user.username}</h3>
      <button on:click={handleLogout}>Logout</button>
    </PrivateRoute>
  </main>
</Router>

<style>
</style>
