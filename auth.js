/**
 * Created by Felix Resch on 01-Apr-16.
 */

module.exports = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};