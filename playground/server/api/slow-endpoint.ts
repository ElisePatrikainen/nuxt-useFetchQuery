// a slow endpoint for testing purposes
export default defineEventHandler(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return new Date().toString();
})