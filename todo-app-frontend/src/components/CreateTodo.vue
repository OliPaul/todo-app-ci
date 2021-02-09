<template>
  <div class="col align-self-center">
    <h3 class="pb-5 text-left underline">Créer une tâche</h3>
    <form class="sign-in" @submit.prevent>
      <div class="form-group todo__row">
        <input
          type="text"
          class="form-control"
          @keypress="typing = true"
          placeholder="Que voulez vous faire ?"
          v-model="name"
        />
        <input
          type="text"
          class="form-control"
          @keypress="typing = true"
          placeholder="Où ?"
          v-model="where"
        />
        <input
          type="date"
          class="form-control"
          @keypress="typing = true"
          placeholder="Quand ?"
          v-model="when"
        />
        <button type="submit" v-on:click="addTodo">Valider</button>
        <span id="audio"></span>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import bus from "./../bus.js";
import * as fs from "fs";

export default {
  data() {
    return {
      name: "",
      where: "",
      when: "",
      typing: false,
    };
  },
  methods: {
    addTodo(event) {
      if (event) event.preventDefault();
      let todo = {
        name: this.name,
        where: this.where,
        when: this.when,
        done: false, //false by default
      };
      console.log(todo);
      this.$http
        .post("/", todo)
        .then((response) => {
          this.playResponse(response.data.messageBuffer);
          this.clearTodo();
          this.refreshTodo();
          this.typing = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    clearTodo() {
      this.name = "";
      this.where = "";
      this.when = "";
    },

    refreshTodo() {
      bus.$emit("refreshTodo");
    },

    playResponse(buffer) {
      document.getElementById("audio").innerHTML = `<audio autoplay><source src="data:audio/wav;base64,${buffer}"></audio>`;
    },
  },
};
</script>
<style lang="scss" scoped>
.underline {
  text-decoration: underline;
}

.form-control {
  margin-bottom: 20px;
}
</style>
