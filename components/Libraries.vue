<template>
    <Suspense>
        <div>
            <ul v-if="libraries.length > 0">
                <li v-for="item in libraries" :key="item.name">
                    <h2>
                        {{ item.name }}
                        <span v-if="item.preRelease">(Pre-release)</span>
                    </h2>
                    <p>{{ item.description }}</p>
                    <p>Owned by: {{ item.owner }}</p>
                </li>
            </ul>
            <p v-else>No libraries found.</p>
        </div>
        <template #fallback> Loading... </template>
    </Suspense>
</template>

<script>
import librariesData from "../public/libraries.json";

export default {
    name: "LibrariesList",
    data() {
        return {
            libraries: librariesData.results,
        };
    },
};
</script>
