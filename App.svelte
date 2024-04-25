<script>
  let username = '';
  let password = '';
  let errorMessage = '';

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const token = await loginUser(username, password);
      console.log("Logged in successfully. Token:", token);
      // Redirect or perform other actions after successful login
    } catch (error) {
      errorMessage = error.message;
    }
  }

  async function loginUser(username, password) {
    try {
      const response = await fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to log in");
      }

      const data = await response.json();
      const token = data.token;
      
      // Store token in localStorage
      localStorage.setItem("token", token);

      return token;
    } catch (error) {
      console.error("Error logging in:", error.message);
      throw error;
    }
  }
</script>

<main>
  <h2>Sign In</h2>
  <form on:submit|preventDefault={handleLogin}>
    <label>
      Username:
      <input type="text" bind:value={username}>
    </label>
    <label>
      Password:
      <input type="password" bind:value={password}>
    </label>
    {#if errorMessage}
      <p>{errorMessage}</p>
    {/if}
    <button type="submit">Sign In</button>
  </form>
</main>

<style>
  /* Add your styles here */
</style>
