<template>
  <nav v-if="
    !['Login', 'Register', 'Home', 'Computer', 'Buy', 'Tablet', 'D&C', 'Audio', 'Mobile', 'TV-HomeCinema'].includes(
      $route.name
      )
    ">
    <router-link to="/">Home</router-link>
  </nav>
  <router-view />
</template>