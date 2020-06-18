module.exports = {
    inputFiles: ["./src"],
    mode: "modules",
    out: "doc",
    theme: "default",
    exclude: [
        "**/+(test|languages)/*.ts",
        "**/commands/Giveaways/*.ts"
    ]
}