<script>
    import { useNavigate } from "svelte-navigator";
    import { user } from "./stores";
    import { onMount } from "svelte";
    import { api } from "./stores";
    const API = $api;

    onMount(() => {
        localStorage.removeItem("token");
    });

    const navigate = useNavigate(); // Moved into a function

    let username = "";
    let password = "";

    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        try {
            const response = await fetch(`${API}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); // Store token in local storage
                user.set({ username }); // Set user in the store

                // Redirect to the profile page
                navigate("/profile", { replace: true });
            } else {
                // Handle login error
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    }
</script>

<h3>Login</h3>
<form on:submit={handleSubmit}>
    <input
        bind:value={username}
        type="text"
        name="username"
        placeholder="Username"
    />
    <br />
    <input
        bind:value={password}
        type="password"
        name="password"
        placeholder="Password"
    />
    <br /><br />
    <button style="background: green; color: white" type="submit"
        >Sign in</button
    >
</form>
