<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { user } from "./stores";
  
    const navigate = useNavigate();
    const location = useLocation();
  
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (!token) {
      // Accessing location properties using subscribe
      let from = "/";
      location.subscribe(({ pathname, state }) => {
        from = (state && state.from) || pathname || "/";
      });
  
      navigate("/login", {
        state: { from },
        replace: true,
      });
    }
  </script>
  
  {#if $user}
    <slot />
  {/if}
  