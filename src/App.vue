  <template>
    <nav v-if="
      !['Login', 'Register', 'Home', 'Computer', 'Buy', 'Tablet', 'D&C', 'Audio', 'Mobile', 'TV-HomeCinema', 'register.success'].includes(
        $route.name
        )
      ">
      <router-link to="/">Home</router-link>
    </nav>
    <router-view />
  </template>