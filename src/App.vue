<template>
  <header>
    <div class="wrapper">
      <nav>
        <div class="left-links">
          <RouterLink id="link" to="/"> HOME |</RouterLink>
          <RouterLink id="link" to="/login"> LOGIN </RouterLink>
        </div>
        <div class="right-links">
          <RouterLink id="link" to="/register"> REGISTER |</RouterLink>
          <RouterLink id="link" to="/credits"> CREDITS</RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
nav {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
}

#link {
  text-decoration: none;
  color: rgb(179, 179, 179);
  font-family: 'Michroma', sans-serif;
}

#link:hover {
  color: white;
}
</style>
