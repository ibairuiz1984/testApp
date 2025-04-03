<template>
    <div class="container mt-5">
        <h1 class="mb-4">{{ test?.title || "Cargando test..." }}</h1>
        <div v-if="test">
            <div v-for="(statement, index) in test.statements" :key="index" class="mb-4">
                <p><strong>{{ statement.text }}</strong></p>
                <div v-for="(answer, i) in statement.answers" :key="i" class="form-check">
                    <label :class="{
                        'correct': submitted && userAnswers[index] === i && answer.correct,
                        'incorrect': submitted && userAnswers[index] === i && !answer.correct
                    }" class="form-check-label">
                        <input type="radio" :name="'question_' + index" :value="i" v-model="userAnswers[index]"
                            class="form-check-input" />
                        {{ answer.text }}
                    </label>
                </div>
            </div>
            <button @click="submitTest" class="btn btn-primary">Enviar respuestas</button>

            <div v-if="submitted" class="mt-4">
                <h3>Resultados:</h3>
                <p>Respuestas correctas: {{ correctAnswers }} de {{ totalQuestions }}</p>
                <div v-for="(statement, index) in test.statements" :key="index">
                    <p>{{ statement.text }}</p>
                    <p v-if="userAnswers[index] !== null">
                        Respuesta seleccionada: {{ statement.answers[userAnswers[index]].text }}
                        <span v-if="statement.answers[userAnswers[index]].correct" class="text-success">Correcta</span>
                        <span v-if="!statement.answers[userAnswers[index]].correct"
                            class="text-danger">Incorrecta</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

export default {
    name: "TestView",
    props: ["id"], // Recibe el ID del test desde la URL
    data() {
        return {
            test: null,
            userAnswers: [], // Respuestas del usuario
            correctAnswers: 0, // Número de respuestas correctas
            totalQuestions: 0, // Total de preguntas
            submitted: false // Para mostrar los resultados después de enviar
        };
    },
    async created() {
        await this.cargarTest();
    },
    methods: {
        // Cargar el test desde Firestore
        async cargarTest() {
            try {
                const docRef = doc(db, "tests", this.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    this.test = docSnap.data();
                    // Inicializamos un arreglo para almacenar las respuestas seleccionadas
                    this.userAnswers = new Array(this.test.statements.length).fill(null);
                } else {
                    console.error("El test no existe");
                }
            } catch (error) {
                console.error("Error al cargar el test:", error);
            }
        },

        // Calcular los resultados y guardar el historial
        submitTest() {
            this.correctAnswers = 0;
            this.totalQuestions = 0;

            // Verificamos las respuestas
            this.test.statements.forEach((statement, index) => {
                const selectedAnswer = this.userAnswers[index];
                if (selectedAnswer !== null && statement.answers[selectedAnswer].correct) {
                    this.correctAnswers++;
                }
                this.totalQuestions++;
            });

            // Establecer que el test ha sido enviado
            this.submitted = true;

            // Guardar el historial en Firestore
            this.saveHistory();
        },

        // Guardar el resultado del test en el historial
        async saveHistory() {
            try {
                const historyRef = collection(db, "history");
                const newHistoryEntry = {
                    testId: this.test.id, // ID del test
                    correctAnswers: this.correctAnswers,
                    totalQuestions: this.totalQuestions,
                    date: new Date() // Fecha actual
                };

                // Guardamos el historial en la colección 'history'
                await addDoc(historyRef, newHistoryEntry);
                console.log("Resultado guardado en el historial.");
            } catch (error) {
                console.error("Error guardando el historial:", error);
            }
        }
    }
};
</script>

<style scoped>
.correct {
    color: green;
}

.incorrect {
    color: red;
}

.correct-answer {
    color: green;
    font-weight: bold;
}

.incorrect-answer {
    color: red;
    font-weight: bold;
}

.text-success {
    font-weight: bold;
}

.text-danger {
    font-weight: bold;
}
</style>
