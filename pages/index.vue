<template>
  <div class="container">
    <q-card class="languageManager">
      <div class="languageManager__list">
        <q-list>
          <q-item v-for="language in languageFiles" :key="language.key">
            <q-item-section>{{ language.title }}</q-item-section>
            <q-btn
              flat
              round
              color="black"
              icon="delete"
              @click="remove(language.key)"
            />
          </q-item>
        </q-list>
        <div class="languageManager__controllers">
          <q-btn
            label="Add Language"
            @click="newLanguagePopup = !newLanguagePopup"
          ></q-btn>
          <div>OR</div>
          <q-file
            label="Pick one file"
            borderless
            v-model="file"
            @update:model-value="checkFile()"
            accept=".json,.js"
          ></q-file>
        </div>
      </div>
      <div class="languageManager__buttons">
        <q-btn label="Compare" @click="compare"></q-btn>
      </div>
    </q-card>
    <q-dialog v-model="newLanguagePopup" class="newLanguagePopup">
      <q-card>
        <q-card-section>
          <q-form
            class="newLanguagePopup__popup"
            @submit.prevent.stop="createLanguage"
          >
            <q-input
              label="Language"
              :rules="languageRules"
              v-model="formFields.title"
            ></q-input>
            <q-input
              label="Language key"
              :rules="keyRules"
              v-model="formFields.key"
            ></q-input>
            <q-btn
              type="submit"
              label="Create"
              class="newLanguagePopup__form__submit"
              outline
              square
            ></q-btn> </q-form
        ></q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
const languageFiles = ref([]);

const newLanguagePopup = ref(false);

const remove = (key) => {
  const index = languageFiles.value.findIndex((element) => element.key === key);
  languageFiles.value.splice(index, 1);
};

const formFields = ref({ title: "", key: "", content: "" });
const languages = useStore();
const createLanguage = () => {
  const index = languageFiles.value.findIndex(
    (element) => element.key === formFields.value.key
  );
  if (index !== -1) {
    console.log("Error");
    return;
  }
  languageFiles.value.push(formFields.value);
  newLanguagePopup.value = !newLanguagePopup.value;
  formFields.value = { title: "", key: "" };
  languages.setLanguages(languageFiles.value);
};
const languageRules = [(val) => val !== "" || "Input is empty"];
const keyRules = [(value) => checkKeyExists(value)];
const checkKeyExists = (value) => {
  const index = languageFiles.value.findIndex(
    (element) => element.key === value
  );
  if (index !== -1) {
    return "Key already exists";
  }
  if (value === "") {
    return "Key is emtpy";
  }
  return true;
};

const file = ref(null);
const checkFile = () => {
  const fileName = file.value.name;
  const fileType = fileName
    .substring(fileName.lastIndexOf(".") + 1)
    .toLowerCase();
  const reader = new FileReader();
  let content;
  if (fileType === "js") {
    reader.onload = (event) => {
      content = event.target.result;

      try {
        // Find the JavaScript object using regular expressions
        const regex = /=\s+([^;]+)\s+export/;
        const matches = content.match(regex);

        if (matches[1] !== undefined) {
          const objectString = matches[1];
          const parseObject = new Function(`return ${objectString}`);
          const jsObject = parseObject();
          const jsonData = JSON.stringify(jsObject, null, 2);
          formFields.value.title = fileName.split(".js")[0];
          formFields.value.content = JSON.parse(jsonData);
          newLanguagePopup.value = true;
          file.value = null;
        } else {
          console.error("No JavaScript object found in the Blob.");
        }
      } catch (e) {
        console.error("Error transforming JavaScript object to JSON:", e);
      }
    };
  }
  if (fileType === "json") {
    reader.onload = (event) => {
      content = event.target.result;

      try {
        // Parse the JSON data
        const jsonData = JSON.parse(content);
        console.log("JSON data:", jsonData);
      } catch (e) {
        console.error("Error parsing JSON file:", e);
      }
    };
  }

  // Start reading the file
  reader.readAsText(file.value);
};
const compare = () => {
  return navigateTo('/compare')
};
</script>

<style scoped>
@import url("../css/global.css");
.container {
  align-items: center;
  display: flex;
  height: 100%;
  margin: auto;
  max-width: 1200px;
  padding-block: 4rem;
}

.languageManager {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}
.languageManager__controllers {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  gap: 1rem;
  padding-inline: 1rem;
}
.languageManager__list button {
  padding-right: 1rem;
}

.newLanguagePopup__popup {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 20rem;
}
.q-file {
  flex: 1;
}
</style>
