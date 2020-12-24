const authMiddleware = require("../api/middleware/check-auth")

it('should throw an error if authorization header is not present', function() {
    const req  = {
        get: function() {
            return null;
        }
    }
})