<template>
    <div>
        <h1>Crear Test</h1>
        <input v-model="title" placeholder="Título del test" />
        <button @click="addTest">Guardar Test</button>
    </div>
</template>

<script>
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default {
    data() {
        return { title: "" };
    },
    methods: {
        async addTest() {
            if (!this.title) return alert("Añade un título");
            await addDoc(collection(db, "tests"), { title: this.title });
            this.$router.push("/");
        }
    }
};
</script>