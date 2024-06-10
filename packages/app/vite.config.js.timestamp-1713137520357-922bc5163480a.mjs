// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/kepc0/Documents/Workspaces/chords-extractor/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/kepc0/Documents/Workspaces/chords-extractor/node_modules/@vitejs/plugin-react-swc/index.mjs";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      proxy: {
        "/api": env.VITE_BACKEND_URL
      }
    },
    plugins: [react()]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxrZXBjMFxcXFxEb2N1bWVudHNcXFxcV29ya3NwYWNlc1xcXFxjaG9yZHMtZXh0cmFjdG9yXFxcXGFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxca2VwYzBcXFxcRG9jdW1lbnRzXFxcXFdvcmtzcGFjZXNcXFxcY2hvcmRzLWV4dHJhY3RvclxcXFxhcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2tlcGMwL0RvY3VtZW50cy9Xb3Jrc3BhY2VzL2Nob3Jkcy1leHRyYWN0b3IvYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpXG4gIHJldHVybiB7XG4gICAgc2VydmVyOiB7XG4gICAgICBwcm94eToge1xuICAgICAgICAnL2FwaSc6IGVudi5WSVRFX0JBQ0tFTkRfVVJMXG4gICAgICB9XG4gICAgfSxcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1csU0FBUyxjQUFjLGVBQWU7QUFDOVksT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDakQsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFFBQVEsSUFBSTtBQUFBLE1BQ2Q7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDbkI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=