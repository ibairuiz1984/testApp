<template>
    <div class="container mt-5">
        <h1 class="mb-4">Editar Test</h1>
        <form @submit.prevent="guardarTest">
            <!-- Título del Test -->
            <div class="mb-3">
                <label for="title" class="form-label">Título del Test</label>
                <input v-model="test.title" type="text" id="title" class="form-control" required />
            </div>

            <!-- Preguntas -->
            <div v-for="(statement, index) in test.statements" :key="index" class="mb-4">
                <h5 class="mb-2">Pregunta {{ index + 1 }}</h5>
                <div class="mb-3">
                    <label for="statement" class="form-label">Texto de la Pregunta</label>
                    <input v-model="statement.text" type="text" id="statement" class="form-control" required />
                </div>

                <!-- Respuestas -->
                <div v-for="(answer, i) in statement.answers" :key="i" class="mb-3">
                    <label for="answer" class="form-label">Respuesta {{ i + 1 }}</label>
                    <input v-model="answer.text" type="text" :id="'answer_' + i" class="form-control" required />

                    <div class="form-check mt-2">
                        <input type="checkbox" v-model="answer.correct" :id="'correctAnswer_' + i"
                            class="form-check-input" />
                        <label :for="'correctAnswer_' + i" class="form-check-label">¿Es la respuesta correcta?</label>
                    </div>
                </div>

                <div class="d-flex justify-content-between mt-2">
                    <button type="button" @click="addAnswer(index)" class="btn btn-secondary btn-sm">Agregar
                        Respuesta</button>
                    <button type="button" @click="removeAnswer(index)" v-if="statement.answers.length > 1"
                        class="btn btn-danger btn-sm">Eliminar Respuesta</button>
                </div>
            </div>

            <div class="d-flex justify-content-between mt-4">
                <button type="button" @click="addStatement" class="btn btn-success btn-sm">Agregar Pregunta</button>
                <button type="submit" class="btn btn-primary">Guardar Cambios</button>
            </div>
        </form>
    </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default {
    name: "EditTestView",
    data() {
        return {
            test: {
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
    async created() {
        const testId = this.$route.params.id;
        await this.cargarTest(testId);
    },
    methods: {
        async cargarTest(testId) {
            try {
                const docRef = doc(db, "tests", testId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    this.test = docSnap.data();
                } else {
                    console.error("Test no encontrado");
                }
            } catch (error) {
                console.error("Error al cargar el test:", error);
            }
        },
        addStatement() {
            this.test.statements.push({
                text: "",
                answers: [{ text: "", correct: false }]
            });
        },
        removeStatement(index) {
            if (this.test.statements.length > 1) {
                this.test.statements.splice(index, 1);
            }
        },
        addAnswer(statementIndex) {
            this.test.statements[statementIndex].answers.push({
                text: "",
                correct: false
            });
        },
        removeAnswer(statementIndex) {
            if (this.test.statements[statementIndex].answers.length > 1) {
                this.test.statements[statementIndex].answers.pop();
            }
        },
        async guardarTest() {
            try {
                const testId = this.$route.params.id;
                const docRef = doc(db, "tests", testId);
                await updateDoc(docRef, this.test);
                this.$router.push("/"); // Redirigir a la lista de tests
            } catch (error) {
                console.error("Error guardando los cambios:", error);
            }
        }
    }
};
</script>

<style scoped>
/* Personaliza los estilos si es necesario */
</style>