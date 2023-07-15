<template>
  <q-card class="container">
    <div class="languageComparator">
      <div
        class="languageComparator__keys"
        ref="keysScroll"
        @scroll="handleScroll"
      >
        <div
          class="languageComparator__row"
          v-for="property in nestedProperties"
        >
          {{ property }}
        </div>
      </div>
      <div
        class="languageComparator__languages"
        ref="languageScroll"
        @scroll="handleScroll"
      >
        <q-form>
          <div
            class="languageComparator__row"
            v-for="property in nestedProperties"
          >
            <div
              v-for="language in languagesStore.languages"
              class="languageComparator__inputContainer"
            >
              <q-input
                :key="property + '_' + language"
                class="languageComparator_languageColumn"
                :placeholder="
                  property.split('.')[property.split('.').length - 1]
                "
                v-model="flatLanguages[language.key][property]"
                @update:model-value="
                  updatePropertyValue(
                    flatLanguages[language.key][property],
                    property,
                    language.key
                  )
                "
              >
              </q-input>
              <q-icon
                v-if="
                  flatLanguages[language.key][property] === '' ||
                  flatLanguages[language.key][property] === undefined
                "
                name="warning"
                color="red"
                size="2rem"
                ref=""
              ></q-icon>
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <q-btn label="Download"></q-btn>
  </q-card>
</template>

<script setup>
const languagesStore = useStore();
let masterJson = ref({});
let nestedProperties = ref([]);
let flatLanguages = ref({});

const combineJSONs = (jsonList) => {
  let combinedJSONs = {};

  function traverseJSON(json, target) {
    for (let key in json) {
      if (json.hasOwnProperty(key)) {
        if (typeof json[key] === "object" && json[key] !== null) {
          if (!target.hasOwnProperty(key)) {
            target[key] = {};
          }
          traverseJSON(json[key], target[key]); // Recursively traverse nested objects
        } else {
          target[key] = {};
        }
      }
    }
  }

  jsonList.forEach((json) => {
    traverseJSON(json, combinedJSONs);
  });

  return combinedJSONs;
};

const getNestedProperties = (obj, path = "", result = []) => {
  for (let key in obj) {
    const newPath = path === "" ? key : `${path}.${key}`;

    if (typeof obj[key] === "object" && Object.keys(obj[key]).length > 0) {
      // Check if property has nested properties
      getNestedProperties(obj[key], newPath, result);
    } else {
      result.push(newPath); // Add path to result array
    }
  }
  return result;
};

const flattenLanguages = (obj, parentKey = "", separator = ".") => {
  let flattenedObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let newKey = parentKey ? parentKey + separator + key : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        let nestedObj = flattenLanguages(obj[key], newKey, separator);
        flattenedObj = { ...flattenedObj, ...nestedObj };
      } else {
        flattenedObj[newKey] = obj[key];
      }
    }
  }
  return flattenedObj;
};

onMounted(() => {
  const jsonList = [];
  for (let index = 0; index < languagesStore.languages.length; index++) {
    const language = languagesStore.languages[index].content;
    jsonList.push(language);
  }
  masterJson.value = combineJSONs(jsonList);
  console.log(masterJson.value);
  nestedProperties.value = getNestedProperties(masterJson.value);
  nestedProperties.value.sort();
  console.log(nestedProperties.value);

  for (let index = 0; index < languagesStore.languages.length; index++) {
    const language = languagesStore.languages[index];
    flatLanguages.value[language.key] = flattenLanguages(language.content);
  }
  console.log(flatLanguages.value);
});

const getPropertyValue = (property, language) => {
  try {
    let key = language.key;
    let value;
    for (let index = 0; index < languagesStore.languages.length; index++) {
      language = languagesStore.languages[index];
      if (language.key === key) {
        value = language.content;
        break;
      }
    }
    const keys = property.split(".");
    for (let key of keys) {
      value = value[key];
    }
    return value;
  } catch (error) {
    return "";
  }
};

const updatePropertyValue = (value, property, key) => {
  let language;
  for (let index = 0; index < languagesStore.languages.length; index++) {
    language = languagesStore.languages[index];
    if (language.key === key) break;
  }
  if (language) {
    const path = property.split(".");
    let content = language.content;

    for (let i = 0; i < path.length - 1; i++) {
      const propName = path[i];

      if (content.hasOwnProperty(propName)) {
        content = content[propName];
      } else {
        // Property path doesn't exist, return or handle error
        return;
      }
    }

    const propName = path[path.length - 1];

    if (content.hasOwnProperty(propName)) {
      content[propName] = value;
    } else {
      // Property doesn't exist, create a new entry
      content[propName] = value;
    }
  }
};

const checkIfItsEmpty = (property, language) => {
  try {
    let key = language.key;
    let value;
    for (let index = 0; index < languagesStore.languages.length; index++) {
      language = languagesStore.languages[index];
      if (language.key === key) {
        value = language.content;
        break;
      }
    }
    const keys = property.split(".");
    for (let key of keys) {
      value = value[key];
    }
    if (value !== "" && value !== null && value !== undefined) return value;
  } catch (error) {
    return "";
  }
};

const keysScroll = ref(null);
const languageScroll = ref(null);

// Scroll event handler
const handleScroll = (event) => {
  const target = event.target;
  const scrollTop = target.scrollTop;

  // Synchronize scroll positions
  if (target === keysScroll.value) {
    languageScroll.value.scrollTop = scrollTop;
  } else if (target === languageScroll.value) {
    keysScroll.value.scrollTop = scrollTop;
  }
};
</script>

<style scoped>
.container {
  align-items: center;
  display: flex;
  height: 90%;
  margin: auto;
  max-width: 1200px;
  padding-block: 4rem;
  display: flex;
  flex-direction: column;
}

.languageComparator {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.languageComparator__inputContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 20rem;
  margin-right: 2rem;
}
.languageComparator__inputContainer .q-icon {
  margin: 0rem 0 0 1rem;
}
.languageComparator__keys {
  height: 100%;
  overflow: auto;
  width: 20%;
  scrollbar-width: none;
}

.languageComparator__languages {
  width: 80%;
  overflow-x: auto;
  margin-right: 2rem;
  box-sizing: border-box;
}
.languageComparator_languageColumn {
  width: 20rem;
}
.languageComparator__row {
  height: 4rem;
  display: flex;
  align-items: center;
  overflow-x: auto;
  width: fit-content;
  padding: 0 1rem;
}
</style>
