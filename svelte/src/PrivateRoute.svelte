<script>
  import { onMount } from "svelte";
  import { Route } from "svelte-navigator";
  import PrivateRouteGuard from "./PrivateRouteGuard.svelte";
  import toastr from "toastr";
  import "toastr/build/toastr.css";
  import { api } from "./stores";
  const API = $api;

  
  $: token = localStorage.getItem("token");
  let notes = [];
  let username = "";
  let value = "";

  async function getNotes() {
    let token = localStorage.getItem("token");

    // Wait until token is available
    while (!token) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100 milliseconds
      token = localStorage.getItem("token");
    }

    try {
      const response = await fetch(`${API}/users/getnotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        // Handle forbidden error
        console.error(
          "Forbidden: You are not authorized to access this resource",
        );
        return;
      }

      if (!response.ok) {
        // Handle other error cases
        console.error("Failed to fetch notes:", response.statusText);
        return;
      }

      const data = await response.json();
      notes = data.notes;
      username = data.username;
    } catch (error) {
      // Handle unexpected errors
      console.error("An error occurred:", error.message);
    }
  }

  async function deleteNote(note) {
    await fetch(`${API}/users/deletenote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ note: note }), 
    });
    getNotes();
    toastr.warning('Note deleted')
  }

  async function addNote() {
    console.log(token);
    console.log(value);
    await fetch(`${API}/users/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ note: value }), // Moved this outside the headers
    });
    getNotes();
    toastr.info('note addded')
  }

  $: getNotes();
  $: token;
  $: notes;

  export let path;
</script>

<head>
  <link href="toastr.css" rel="stylesheet"/>
</head>

<Route {path} let:params let:location let:navigate>
  <PrivateRouteGuard>
    <slot {params} {location} {navigate} />
    {#if notes.length > 0}
      <h2>Notes:</h2>
      <ul>
        {#each notes as note, index}
          <li style="color: blue; margin: 10px; display: flex; justify-content: space-between; border: 1px solid darkgrey; border-radius: 10px" key={index}>
            <p style="margin: 10px">{note}</p>
            <button style="width: 150px; height: 50px; border-radius: 10px; text-align: center; background: darkred" on:click={() => deleteNote(note)}>Delete</button>
          </li>
        {/each}
      </ul>
    {:else}{/if}

    <div style="display: flex; align-items: center">
      <textarea style="margin: 20px" bind:value={value}></textarea>
      <button on:click={() => addNote()}>Add Note</button>
    </div>
  </PrivateRouteGuard>
</Route>

<style>
  textarea {
    flex: 1;;
    resize: none;
  }
  button {
    aspect-ratio: 1;
    border-radius: 50%;
    background: green;
    color: white;
  }
</style>
