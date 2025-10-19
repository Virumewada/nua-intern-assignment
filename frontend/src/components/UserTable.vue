<template>
  <v-container>
    <v-card>
      <v-card-title>
        Users
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search Users (by Name, Email, or City)"
          variant="solo-filled"
          clearable
          single-line
          hide-details
          class="mb-4"
        ></v-text-field>

        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="25"
          :loading="loading"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit User</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.first_name" label="Name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.city" label="City"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Reactive variables
const users = ref([]);
const loading = ref(true);
const search = ref('');

// ## NEW: State for the Edit Dialog ##
const dialog = ref(false);
const editedItem = ref({});

const headers = [
  { title: 'Name', value: 'first_name', sortable: true },
  { title: 'Email', value: 'email', sortable: true },
  { title: 'City', value: 'city', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false },
];

const fetchUsers = async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:3000/api/users');
    users.value = response.data.map(user => ({
      ...user,
      first_name: `${user.first_name} ${user.last_name}`
    }));
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

// ## NEW: Functions for Edit Dialog ##
const editItem = (item) => {
  // We use Object.assign to create a copy, so we don't edit the original item directly
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
};

const close = () => {
  dialog.value = false;
};

const save = async () => {
  try {
    const { uuid, first_name, last_name, email, city } = editedItem.value;
    // Note: The 'name' field from the form needs to be split back into first_name and last_name if you want to save them separately. For simplicity, we'll save the full name to first_name.
    
    await axios.put(`http://localhost:3000/api/users/${uuid}`, {
      first_name: first_name,
      last_name: last_name || '', // Assuming last_name might be part of the full name
      email: email,
      city: city,
    });

    // Find the index of the item in our local 'users' array and update it
    const index = users.value.findIndex(item => item.uuid === uuid);
    if (index !== -1) {
      Object.assign(users.value[index], editedItem.value);
    }

  } catch (error) {
    console.error('Failed to update user:', error);
  } finally {
    close();
  }
};
</script>