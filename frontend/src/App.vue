<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title>User Management</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <UserTable />
    </v-main>
  </v-app>
</template>

<script setup>
import UserTable from './components/UserTable.vue';
</script>