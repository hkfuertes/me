declare module '*.yaml' {
  const content: any;
  export default content;
  export const gists: string[];
  export const with_readme: string[];
  export const without_readme: string[];
}

declare module '*.yml' {
  const content: any;
  export default content;
  export const gists: string[];
  export const with_readme: string[];
  export const without_readme: string[];
}
