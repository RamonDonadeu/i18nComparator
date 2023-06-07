<template>
  <v-main class="bg-grey-lighten-2">
    <v-container>
      <v-card>
        <v-card-title>Select languages</v-card-title>
        <v-container class="languages-container">
          <v-list>
            <v-list-item v-for="language in languagesFiles" :key="language.key">
              <div class="d-flex flex-row justify-start align-center">
                <v-btn
                  icon="close"
                  variant="plain"
                  @click="remove(language.key)"
                ></v-btn>
                <p>
                  {{ language.title }}
                </p>
              </div>
            </v-list-item>
            <v-list-item>
              <div class="d-flex flex-row justify-between align-center">
                <v-btn
                  variant="plain"
                  class=""
                  @click="newLanguagePopup = !newLanguagePopup"
                >
                  Add New Language
                </v-btn>
                <div class="ml-8">OR</div>
                <v-file-input
                  class="mx-8"
                  label="Import File ( JSON or JSObject )"
                  small-chips
                  variant="plain"
                  density="compact"
                ></v-file-input>
              </div>
            </v-list-item>
          </v-list>
        </v-container>
        <v-btn>Compare</v-btn>
      </v-card></v-container
    >
    <v-dialog v-model="newLanguagePopup" width="300px">
      <v-card>
        <VCardTitle>Add new language</VCardTitle>
        <v-container>
          <v-form @submit.prevent>
            <v-text-field
              v-model="formFields.title"
              label="Language"
            ></v-text-field>
            <v-text-field
              :rules="keyRules"
              v-model="formFields.key"
              label="Language Key"
            ></v-text-field>
            <v-btn type="submit" @click="createLanguage()">Create</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup>
const languagesFiles = ref([
  { key: "es", title: "Español" },
  { key: "en", title: "English" },
  { key: "de", title: "Deustch" },
  { key: "fr", title: "French" },
]);

const newLanguagePopup = ref(false);

const remove = (key) => {
  const index = languagesFiles.value.findIndex(
    (element) => element.key === key
  );
  languagesFiles.value.splice(index, 1);
};

const formFields = ref({ title: "", key: "" });

const createLanguage = () => {
  const index = languagesFiles.value.findIndex(
    (element) => element.key === formFields.value.key
  );
  if (index !== -1) {
    console.log("Error");
    return;
  }
  languagesFiles.value.push(formFields.value);
  newLanguagePopup.value = !newLanguagePopup.value;
  formFields.value = { title: "", key: "" }
};
const keyRules = [value => checkKeyExists(value)]
const checkKeyExists = (value) => {
  console.log(value)
  const index = languagesFiles.value.findIndex(
    (element) => element.key === value
  );
  if (index !== -1) {
    return 'Key already exists';
  }
  return true;
};
</script>

<style scoped></style>
