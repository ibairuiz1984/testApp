<template>
    <div class="container mt-5">
        <h1 class="mb-4">{{ test?.title || "Cargando test..." }}</h1>
        <div v-if="test">
            <div v-for="(statement, index) in randomizedStatements" :key="index" class="mb-4">
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
                <div v-for="(statement, index) in randomizedStatements" :key="index">
                    <p>{{ statement.text }}</p>
                    <p v-if="userAnswers[index] !== null">
                        Respuesta seleccionada: {{ statement.answers[userAnswers[index]].text }}
                        <span v-if="statement.answers[userAnswers[index]].correct" class="text-success">Correcta</span>
                        <span v-else class="text-danger">Incorrecta</span>
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
    props: ["id"],
    data() {
        return {
            test: null,
            randomizedStatements: [],
            userAnswers: [],
            correctAnswers: 0,
            totalQuestions: 0,
            submitted: false
        };
    },
    async created() {
        await this.cargarTest();
    },
    methods: {
        async cargarTest() {
            try {
                const docRef = doc(db, "tests", this.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    this.test = docSnap.data();
                    this.randomizedStatements = this.shuffleArray([...this.test.statements]);
                    this.userAnswers = new Array(this.randomizedStatements.length).fill(null);
                } else {
                    console.error("El test no existe");
                }
            } catch (error) {
                console.error("Error al cargar el test:", error);
            }
        },
        submitTest() {
            this.correctAnswers = 0;
            this.totalQuestions = this.randomizedStatements.length;

            this.randomizedStatements.forEach((statement, index) => {
                const selectedAnswer = this.userAnswers[index];
                if (selectedAnswer !== null && statement.answers[selectedAnswer].correct) {
                    this.correctAnswers++;
                }
            });

            this.submitted = true;
            this.saveHistory();
        },
        async saveHistory() {
            try {
                const historyRef = collection(db, "history");
                const newHistoryEntry = {
                    testId: this.test.id || "id_" + new Date().getTime(),
                    correctAnswers: this.correctAnswers,
                    totalQuestions: this.totalQuestions,
                    date: new Date()
                };
                await addDoc(historyRef, newHistoryEntry);
                console.log("Resultado guardado en el historial.");
            } catch (error) {
                console.error("Error guardando el historial:", error);
            }
        },
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
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