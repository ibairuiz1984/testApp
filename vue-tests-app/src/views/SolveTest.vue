<template>
    <div>
        <h1>{{ test.title }}</h1>
        <div v-for="(statement, index) in test.statements" :key="index" class="statement">
            <p>{{ statement.text }}</p>
            <div v-for="(answer, i) in statement.answers" :key="i" class="answer">
                <label>
                    <input type="radio" :value="i" v-model="selectedAnswers[index]" />
                    {{ answer.text }}
                </label>
            </div>
        </div>
        <button @click="submitTest">Enviar respuestas</button>
        <div v-if="showResults">
            <h2>Resultados:</h2>
            <p>Respuestas correctas: {{ correctAnswers }} de {{ totalQuestions }}</p>
        </div>
    </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";

export default {
    data() {
        return {
            test: {}, // Test que se va a resolver
            selectedAnswers: [], // Respuestas seleccionadas por el usuario
            correctAnswers: 0,
            totalQuestions: 0,
            showResults: false
        };
    },
    methods: {
        // Cargar el test desde Firestore
        async fetchTest() {
            const testRef = doc(db, "tests", this.$route.params.testId);
            const testSnapshot = await getDoc(testRef);
            if (testSnapshot.exists()) {
                this.test = testSnapshot.data();
                this.totalQuestions = this.test.statements.length;
                this.selectedAnswers = Array(this.totalQuestions).fill(null); // Inicializamos en null
            } else {
                console.error("Test no encontrado");
            }
        },

        // Calcular los resultados y guardar el historial
        submitTest() {
            let correctAnswersCount = 0;

            // Evaluamos las respuestas
            this.test.statements.forEach((statement, index) => {
                const selectedAnswer = this.selectedAnswers[index];
                if (selectedAnswer !== null && statement.answers[selectedAnswer].correct) {
                    correctAnswersCount++;
                }
            });

            this.correctAnswers = correctAnswersCount;
            this.showResults = true;

            // Guardar el historial en Firestore
            this.saveHistory(correctAnswersCount);
        },

        // Guardar el resultado del test en el historial
        async saveHistory(correctAnswersCount) {
            try {
                const historyRef = collection(db, "history");
                const newHistoryEntry = {
                    testId: this.test.id || "id_" + new Date().getTime(), // Asegúrate de tener un ID válido
                    testTitle: this.test.title, // Título del test
                    correctAnswers: correctAnswersCount,
                    totalQuestions: this.totalQuestions,
                    date: new Date() // Fecha actual
                };

                // Guardamos el historial en la colección 'history'
                await addDoc(historyRef, newHistoryEntry); // Usamos addDoc para que Firestore cree un ID único automáticamente
                console.log("Resultado guardado en el historial.");
            } catch (error) {
                console.error("Error guardando el historial:", error);
            }
        }

    },
    mounted() {
        this.fetchTest(); // Cargar el test cuando se monta el componente
    }
};
</script>
