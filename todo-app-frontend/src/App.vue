<template>
  <div class="container">
    <div class="row vertical-centre justify-content-center mt-50">
      <div class="col-md-6 mx-auto left">
        <CreateTodo></CreateTodo>
      </div>
      <div class="col-md-6 mx-auto">
        <ListTodo></ListTodo>
      </div>
    </div>
  </div>
</template>

<script>
import CreateTodo from "./components/CreateTodo.vue";
import ListTodo from "./components/ListTodo.vue";

export default {
  name: "app",
  components: { CreateTodo, ListTodo }
};
</script>

<style>
.vertical-centre {
  min-height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
.todo__row {
  width: 400px;
}

.left {
  border-right: 1px solid rgb(173, 173, 173);
}
</style>
