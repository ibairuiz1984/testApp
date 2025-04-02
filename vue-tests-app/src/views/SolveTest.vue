<template>
    <div>
        <h1>{{ test.title }}</h1>
        <p>Responde el test aquí</p>
    </div>
</template>

<script>
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default {
    data() {
        return { test: {} };
    },
    async created() {
        const docRef = doc(db, "tests", this.$route.params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            this.test = docSnap.data();
        } else {
            alert("Test no encontrado");
            this.$router.push("/");
        }
    }
};
</script>