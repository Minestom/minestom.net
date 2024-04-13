<template>
    <div class="VPDoc px-[32px] py-[48px]">
        <div class="flex flex-col gap-2 relative mx-auto max-w-[948px]">
            <h1 class="text-vp-c-text-1 text-3xl font-semibold mb-4">
                Libraries
            </h1>
            <input
                v-model="searchText"
                class="rounded-lg px-3 py-2 bg-opacity-20 bg-vp-c-bg-soft font-base font-medium"
                placeholder="Search..."
            />
            <div v-if="loading" class="my-3 text-center">Loading...</div>
            <ul
                v-else-if="filteredLibraries.length > 0"
                class="grid grid-cols-1 lg:grid-cols-2 gap-2"
            >
                <li
                    v-for="item in filteredLibraries"
                    :key="item.name"
                    class="p-4 bg-vp-c-bg-alt hover:drop-shadow-md drop-shadow-sm transition-all rounded-lg animate-in fade-in-40 flex flex-col"
                >
                    <h2 class="font-bold">
                        {{ item.name }}
                        <span class="font-normal"> by </span>
                        <span>{{ item.owner }}</span>
                    </h2>
                    <p class="text-vp-c-text-2 mb-2">{{ item.description }}</p>
                    <a
                        class="transition-colors text-vp-c-text-3 hover:text-vp-c-text-2 mt-auto"
                        :href="item.url"
                        >View on GitHub

                        <span v-if="item.preRelease">(Pre-release)</span></a
                    >
                </li>
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
                const response = await axios.get(
                    "https://api.github.com/search/repositories",
                    {
                        params: {
                            q: "topic:minestom-library",
                        },
                        headers: {
                            Accept: "application/vnd.github.v3+json",
                        },
                    },
                );
                this.libraries = response.data.items.map((repo) => ({
                    name: repo.name,
                    owner: repo.owner.login,
                    description: repo.description || "No description provided.",
                    preRelease: repo.pre_release,
                    url: repo.html_url,
                }));
            } catch (error) {
                console.error("Error fetching libraries:", error);
                this.libraries = []; // Reset the libraries on error.
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
