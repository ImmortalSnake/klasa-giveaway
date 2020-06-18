module.exports = {
    inputFiles: ["./src"],
    mode: "modules",
    out: "docs",
    theme: "default",
    exclude: [
        "**/+(test|languages)/*.ts",
        "**/commands/Giveaways/*.ts"
    ]
}