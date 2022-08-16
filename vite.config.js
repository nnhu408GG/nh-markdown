import { defineConfig } from "vite";
// import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  //   resolve: {
  //     alias: {
  //       "@ui": resolve(__dirname, "./src/components/ui"),
  //     },
  //   },
  server: {
    host: "0.0.0.0",
    port: 663,
    // proxy: {
    //   "/api":"http://nnhu.space"
    // }
  },
});
