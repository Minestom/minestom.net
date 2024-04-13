<template>
    <Suspense>
        <div>
            <ul v-if="implementations.length > 0">
                <li v-for="item in implementations" :key="item.name">
                    <h2>
                        {{ item.name }}
                        <span v-if="item.preRelease">(Pre-release)</span>
                    </h2>
                    <p>{{ item.description }}</p>
                    <p>Owned by: {{ item.owner }}</p>
                </li>
            </ul>
            <p v-else>No implementations found.</p>
        </div>
        <template #fallback> Loading... </template>
    </Suspense>
</template>

<script>
import implementationsData from "../public/implementations.json";

export default {
    name: "ImplementationsList",
    data() {
        return {
            implementations: implementationsData.results,
        };
    },
};
</script>
