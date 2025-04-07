<template>
    <div>
        <h1>{{ test.title }}</h1>
        <div v-for="(statement, index) in randomizedStatements" :key="index" class="statement">
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
            test: {},
            randomizedStatements: [],
            selectedAnswers: [],
            correctAnswers: 0,
            totalQuestions: 0,
            showResults: false
        };
    },
    methods: {
        async fetchTest() {
            const testRef = doc(db, "tests", this.$route.params.testId);
            const testSnapshot = await getDoc(testRef);
            if (testSnapshot.exists()) {
                const testData = testSnapshot.data();
                this.test = testData;
                this.randomizedStatements = this.shuffleArray([...testData.statements]);
                this.totalQuestions = this.randomizedStatements.length;
                this.selectedAnswers = Array(this.totalQuestions).fill(null);
            } else {
                console.error("Test no encontrado");
            }
        },
        submitTest() {
            let correctAnswersCount = 0;
            this.randomizedStatements.forEach((statement, index) => {
                const selectedAnswer = this.selectedAnswers[index];
                if (selectedAnswer !== null && statement.answers[selectedAnswer].correct) {
                    correctAnswersCount++;
                }
            });
            this.correctAnswers = correctAnswersCount;
            this.showResults = true;
            this.saveHistory(correctAnswersCount);
        },
        async saveHistory(correctAnswersCount) {
            try {
                const historyRef = collection(db, "history");
                const newHistoryEntry = {
                    testId: this.test.id || "id_" + new Date().getTime(),
                    testTitle: this.test.title,
                    correctAnswers: correctAnswersCount,
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
    },
    mounted() {
        this.fetchTest();
    }
};
</script>