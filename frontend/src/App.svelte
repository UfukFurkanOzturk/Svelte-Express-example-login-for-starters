<script>
  import { get, writable } from "svelte/store";

  const userCred = writable({
    username: "",
    password: ""
  })

  // some helper function i ripped of from stackoverflow
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // i stole this too
  function deleteCookie(name) {
    document.cookie = name + "=;expires=" + new Date(0).toUTCString()
  }

  async function loginHandler(e) {
    // e is for the word event
    // this line interrupts reload after submit
    e.preventDefault()
    // i declare these for easy json conversion solution
    var username = $userCred.username
    var password = $userCred.password
    // http POST cannot send json as data instead we send string with header application/json
    var data = JSON.stringify({ username, password })
    // in here we choose the method and pass the data we want to send
    // don't worry about cors that topic is painful as hell on later 
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: data
    })
    // we get response body then parse into json
    const resObj = await response.json()
  
    if (resObj.token !== "") {
      const token = resObj.token
      document.cookie = "token=" + token
      // basically this does the page refresh if you still don't get it
      location.reload()
    }
  }
</script>

<main>
  {#if getCookie("token")}
    <div id="success">
    <p>successfully log on</p>
    <button on:click={() => {deleteCookie("token"), location.reload()}}>Clear token</button>
    </div>
  {:else}
  <form id="login-form" on:submit={(e) => {loginHandler(e)}}>
    <label>Username
      <br />
      <input type="text" class="login-form-input" bind:value={$userCred.username}/>
    </label>
    <br />
    <label>Password
      <br />
      <input type="password" class="login-form-input" bind:value={$userCred.password} />
    </label>
    <br />
    <button type="submit" id="login-form-button">Login</button>
  </form>
  {/if}
</main>

<style>
  #login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    align-items: center;
    max-width: 210px;
  }

  #login-form-button {
    margin-top: 10px;
  }

  #success {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    align-items: center;
  }
</style>
