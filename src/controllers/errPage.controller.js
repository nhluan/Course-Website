class errPageController {
    async page404(req, res) {
        res.render("404", { layout: false })
    }
}
export default new errPageController();