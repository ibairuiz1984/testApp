<template>
    <div>
        <h1>Historial de Tests</h1>
        <div v-if="history.length === 0">
            <p>No has realizado ningún test aún.</p>
        </div>
        <ul>
            <li v-for="(entry, index) in history" :key="index">
                <p><strong>{{ entry.testTitle }}</strong></p>
                <p>Aciertos: {{ entry.correctAnswers }} / {{ entry.totalQuestions }}</p>
                <p>Fecha: {{ entry.date.toDate().toLocaleString() }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
    name: "HistoryView",
    data() {
        return {
            history: [] // Guardamos el historial de pruebas
        };
    },
    async created() {
        await this.cargarHistorial();
    },
    methods: {
        // Al cargar el historial
        async cargarHistorial() {
            try {
                const querySnapshot = await getDocs(collection(db, "history"));
                const historial = [];

                querySnapshot.forEach((docSnapshot) => {
                    const data = docSnapshot.data();
                    historial.push({
                        testTitle: data.testTitle || "Test no encontrado",
                        correctAnswers: data.correctAnswers,
                        totalQuestions: data.totalQuestions,
                        date: data.date.toDate() // Asegúrate de convertir la fecha de Timestamp a Date
                    });
                });

                this.history = historial;
            } catch (error) {
                console.error("Error cargando el historial:", error);
            }
        }

    }
};
</script>
