module.exports = function (app) {
    app.get("/translateString", function (req, res) {
        res.json({
            response: {
                hi: true
            }
        });
    });
};
