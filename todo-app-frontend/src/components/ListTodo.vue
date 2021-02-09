<template>
  <div v-bind:show="todos.length>0" class="col align-self-center">
    <div class="form-row align-items-center" v-bind:key="todo" v-for="todo in todos">
      <div class="col-auto my-1">
        <div class="input-group mb-3 todo__row">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <input
                type="checkbox"
                v-model="todo.doc.done"
                :checked="todo.doc.done"
                :value="todo.doc.done"
                v-on:change="updateTodo(todo.doc)"
                title="Mark as done?"
              />
            </span>
          </div>
          <input
            type="text"
            class="form-control"
            :class="todo.doc.done?'todo__done':''"
            v-model="todo.doc.name"
            @keypress="todo.editing=true"
            @keyup.enter="updateTodo(todo.doc)"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span
                class="input-group-addon addon-left"
                title="Delete todo?"
                v-on:click="deleteTodo(todo.doc)"
              >
                X
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="alert alert-primary todo__row"
      v-show="todos.length==0 && doneLoading"
    >Vous avez travaillé très dur pour ne pas avoir de tâches à faire. Bravo</div>
  </div>
</template>

<script>
import axios from "axios";
import bus from "./../bus.js";

export default {
  data() {
    return {
      todos: [],
      doneLoading: true
    };
  },
  created: function() {
    this.fetchTodo();
    this.listenToEvents();
  },
  watch: {
    $route: function() {
      let self = this;
      self.doneLoading = false;
      self.fetchData().then(function() {
        self.doneLoading = true;
      });
    }
  },
  methods: {
    fetchTodo() {
      this.$http.get("/").then(response => {
        console.log("DATA =========> " + JSON.stringify(response.data));
        this.todos = response.data.rows;
      });
    },

    updateTodo(todo) {
      this.$http
        .put(`/`, todo)
        .then(response => {
          this.playResponse(response.data.messageBuffer);
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },

    deleteTodo(todo) {
      this.$http.delete(`/${todo._id}/${todo._rev}/${todo.name}`).then(response => {
        this.playResponse(response.data.messageBuffer);
        this.fetchTodo();
      });
    },

    listenToEvents() {
      bus.$on("refreshTodo", $event => {
        this.fetchTodo(); //update todo
      });
    },

    playResponse(buffer) {
      document.getElementById("audio").innerHTML = `<audio autoplay><source src="data:audio/wav;base64,${buffer}"></audio>`;
    },
  }
};
</script>

<style scoped>
.todo__done {
  text-decoration: line-through !important;
}

.no_border_left_right {
  border-left: 0px;
  border-right: 0px;
}

.flat_form {
  border-radius: 0px;
}

.mrb-10 {
  margin-bottom: 10px;
}

.addon-left {
  background-color: none !important;
  border-left: 0px !important;
  cursor: pointer !important;
}

.addon-right {
  background-color: none !important;
  border-right: 0px !important;
}
</style>
