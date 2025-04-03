<template>
    <div class="container mt-5">
        <h1 class="mb-4">Crear Test</h1>
        <form @submit.prevent="crearTest">
            <!-- Título del Test -->
            <div class="mb-3">
                <label for="title" class="form-label">Título</label>
                <input v-model="newTest.title" type="text" id="title" class="form-control" required />
            </div>

            <!-- Preguntas -->
            <div v-for="(statement, index) in newTest.statements" :key="index" class="mb-4">
                <div class="mb-3">
                    <label for="statement" class="form-label">Pregunta {{ index + 1 }}</label>
                    <input v-model="statement.text" type="text" id="statement" class="form-control" required />
                </div>

                <!-- Respuestas -->
                <div v-for="(answer, i) in statement.answers" :key="i" class="mb-3">
                    <label for="answer" class="form-label">Respuesta {{ i + 1 }}</label>
                    <input v-model="answer.text" type="text" :id="'answer_' + i" class="form-control" required />

                    <div class="form-check mt-2">
                        <input type="checkbox" v-model="answer.correct" id="correctAnswer" class="form-check-input" />
                        <label for="correctAnswer" class="form-check-label">¿Es correcta?</label>
                    </div>
                </div>

                <div class="d-flex justify-content-between mt-2">
                    <button type="button" @click="addAnswer(index)" class="btn btn-secondary btn-sm">Agregar
                        Respuesta</button>
                    <button type="button" @click="removeAnswer(index)" v-if="statement.answers.length > 1"
                        class="btn btn-danger btn-sm">Eliminar Respuesta</button>
                </div>
            </div>

            <!-- Botones para agregar o eliminar preguntas -->
            <div class="d-flex justify-content-between mt-4">
                <button type="button" @click="addStatement" class="btn btn-success btn-sm">Agregar Pregunta</button>
                <button type="submit" :disabled="!canCreateTest" class="btn btn-primary">Crear Test</button>
            </div>
        </form>
    </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export default {
    name: "CreateTestView",
    data() {
        return {
            newTest: {
                title: "",
                statements: [
                    {
                        text: "",
                        answers: [
                            { text: "", correct: false },
                            { text: "", correct: false },
                            { text: "", correct: false }
                        ]
                    }
                ]
            }
        };
    },
    computed: {
        canCreateTest() {
            return this.newTest.statements.every(statement =>
                statement.answers.some(answer => answer.correct)
            );
        }
    },
    methods: {
        addStatement() {
            this.newTest.statements.push({
                text: "",
                answers: [{ text: "", correct: false }]
            });
        },
        removeStatement(index) {
            if (this.newTest.statements.length > 1) {
                this.newTest.statements.splice(index, 1);
            }
        },
        addAnswer(statementIndex) {
            this.newTest.statements[statementIndex].answers.push({
                text: "",
                correct: false
            });
        },
        removeAnswer(statementIndex) {
            if (this.newTest.statements[statementIndex].answers.length > 1) {
                this.newTest.statements[statementIndex].answers.pop();
            }
        },
        async crearTest() {
            if (!this.canCreateTest) {
                alert("Cada pregunta debe tener al menos una respuesta correcta.");
                return;
            }

            try {
                const docRef = await addDoc(collection(db, "tests"), this.newTest);
                console.log("Nuevo test creado con ID:", docRef.id);
                this.$router.push("/"); // Redirigir a la página principal
            } catch (error) {
                console.error("Error creando el test:", error);
            }
        }
    }
};
</script>

<style scoped>
/* Aquí puedes agregar más estilos personalizados si lo necesitas */
</style>