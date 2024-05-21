<template>
    <span
        class="rounded-full px-3 py-1 bg-[var(--vp-custom-block-info-bg)] w-min text-vp-c-text-1"
    >
        <span v-if="!loading && error.length == 0" class="text-vp-c-text-2"
            >Latest Version:
        </span>
        {{ loading ? "Loading..." : latestVersion }}
        {{ error.length > 0 ? error : null }}
    </span>
</template>

<script>
import axios from "axios";

export default {
    name: "LibrariesList",
    data() {
        return {
            loading: false,
            latestVersion: "",
            error: "",
        };
    },
    created() {
        this.fetchLatestVersion();
    },
    methods: {
        async fetchLatestVersion() {
            this.loading = true;
            try {
                const response = await axios.get("/api/latest-version");
                if (response.data.length > 10) {
                    this.error = "Malformed response";
                    return;
                }
                this.latestVersion = response.data;
                this.error = "";
            } catch (error) {
                console.error("Error fetching libraries:", error);
                this.latestVersion = "";
                this.error = "(" + error.status + ")";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
