// NOTE: Used to tell TS config that .scss files are a module and will remove errors when importing them.
// Requires the updating tsconfig.json to include src, which will cause build issues since numerous TS errors exist
// Un-included for now, but a potential todo.
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}