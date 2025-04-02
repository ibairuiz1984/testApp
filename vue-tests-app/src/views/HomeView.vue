<template>
    <div>
      <h1>Gestión de Tests</h1>
  
      <!-- CREAR UN NUEVO TEST -->
      <div>
        <h2>Crear un nuevo test</h2>
        <input v-model="title" placeholder="Título del test" />
  
        <h3>Enunciado</h3>
        <textarea v-model="statement" placeholder="Introduce el enunciado"></textarea>
  
        <h3>Respuestas</h3>
        <div v-for="(answer, index) in answers" :key="index">
          <input v-model="answer.text" placeholder="Escribe una respuesta" />
          <input type="radio" :value="index" v-model="correctIndex" /> Correcta
          <button @click="removeAnswer(index)">X</button>
        </div>
  
        <button @click="addAnswer">Añadir Respuesta</button>
        <button @click="saveTest">Guardar Test</button>
      </div>
  
      <hr />
  
      <!-- LISTA DE TESTS -->
      <div>
        <h2>Lista de Tests</h2>
        <ul>
          <li v-for="test in tests" :key="test.id">
            <button @click="selectTest(test)">{{ test.title }}</button>
          </li>
        </ul>
      </div>
  
      <hr />
  
      <!-- RESOLVER TEST -->
      <div v-if="selectedTest">
        <h2>Resuelve el Test</h2>
        <p><strong>{{ selectedTest.statement }}</strong></p>
  
        <div v-for="(answer, index) in selectedTest.answers" :key="index">
          <button @click="checkAnswer(index)">{{ answer.text }}</button>
        </div>
  
        <p v-if="isCorrect !== null">
          {{ isCorrect ? "✅ ¡Respuesta correcta!" : "❌ Respuesta incorrecta" }}
        </p>
  
        <button @click="selectedTest = null">Volver</button>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '../firebase';
  import { collection, getDocs, addDoc } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        tests: [],
        title: "",
        statement: "",
        answers: [],
        correctIndex: null,
        selectedTest: null,
        isCorrect: null
      };
    },
    async created() {
      await this.loadTests();
    },
    methods: {
      async loadTests() {
        const querySnapshot = await getDocs(collection(db, "tests"));
        this.tests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      },
      addAnswer() {
        this.answers.push({ text: "" });
      },
      removeAnswer(index) {
        this.answers.splice(index, 1);
      },
      async saveTest() {
        if (!this.title || !this.statement || this.answers.length < 2 || this.correctIndex === null) {
          alert("Completa todos los campos correctamente");
          return;
        }
  
        const newTest = {
          title: this.title,
          statement: this.statement,
          answers: this.answers,
          correctIndex: this.correctIndex
        };
  
        await addDoc(collection(db, "tests"), newTest);
  
        this.title = "";
        this.statement = "";
        this.answers = [];
        this.correctIndex = null;
        await this.loadTests();
      },
      selectTest(test) {
        this.selectedTest = test;
        this.isCorrect = null;
      },
      checkAnswer(index) {
        this.isCorrect = index === this.selectedTest.correctIndex;
      }
    }
  };
  </script>
  