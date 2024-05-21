<template>
    <div class="VPDoc px-[32px] py-[48px]">
        <div class="flex flex-col gap-2 relative mx-auto max-w-[948px]">
            <h1 class="text-vp-c-text-1 text-3xl font-semibold mb-4">
                Libraries
            </h1>
            <p class="text-vp-c-text-3 font-normal text-md">
                Here you can find libraries, which can be used to share code
                between multiple projects.
            </p>

            <p class="text-vp-c-text-3 font-normal text-md">
                To submit your library, simply add the minestom-library topic to
                your repository on GitHub.
            </p>
            <input
                v-model="searchText"
                class="rounded-lg px-3 py-2 w-[calc(100%-2px)] translate-x-[1px] bg-vp-c-bg focus:ring-vp-c-brand-2 text-vp-c-text-2 transition-colors font-base ring-vp-c-border ring-1"
                placeholder="Search..."
            />
            <div v-if="loading" class="my-3 text-center">Loading...</div>
            <ul
                v-else-if="filteredLibraries.length > 0"
                class="grid grid-cols-1 lg:grid-cols-2 gap-2"
            >
                <a
                    v-for="item in filteredLibraries"
                    :key="item.name"
                    :href="item.url"
                    class="p-4 group bg-vp-c-bg transition-all flex flex-col rounded-lg border border-vp-c-border hover:border-vp-c-brand-2 animate-in fade-in-40 relative"
                >
                    <h2 class="font-bold">
                        {{ item.name }}
                        <span class="font-normal"> by </span>
                        <span>{{ item.owner }}</span>
                    </h2>
                    <p class="text-vp-c-text-2 mb-2">
                        {{ item.description }}
                    </p>
                    <p class="text-vp-c-text-3 mt-auto flex flex-row">
                        <span class="mr-auto">{{ item.stars }} stars</span>
                        <span
                            class="group-hover:text-vp-c-brand-2 transition-colors"
                            >View on GitHub</span
                        >
                    </p>
                </a>
            </ul>
            <p v-else class="my-3">No libraries found.</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "LibrariesList",
    data() {
        return {
            libraries: [],
            searchText: "",
            loading: false,
        };
    },
    created() {
        this.fetchLibraries();
    },
    methods: {
        async fetchLibraries() {
            this.loading = true;
            try {
                const response = await axios.get("/api/libraries");
                if (!Array.isArray(response)) {
                    console.error(
                        "Malformed response from server when requesting libraries",
                    );
                    return;
                }
                this.libraries = response.data;
            } catch (error) {
                console.error("Error fetching libraries:", error);
                this.libraries = [];
            } finally {
                this.loading = false;
            }
        },
    },
    computed: {
        filteredLibraries() {
            return this.libraries.filter((item) =>
                item.name.toLowerCase().includes(this.searchText.toLowerCase()),
            );
        },
    },
};
</script>
